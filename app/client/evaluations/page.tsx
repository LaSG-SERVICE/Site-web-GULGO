"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import { createClient } from "@/lib/supabase/client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

/* ================================================================
   TYPES
================================================================ */

type EvaluationStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SCORE_PRODUCED"
  | "VALIDATED";

type Evaluation = {
  id: string;
  enterprise_id: string;
  observation_period: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  version: string;
  status: EvaluationStatus | string;
  score: number | string | null;
};

type StatusInfo = {
  label: string;
  className: string;
};

const statusConfig: Record<EvaluationStatus, StatusInfo> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  COMPLETED: {
    label: "Terminée",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  SCORE_PRODUCED: {
    label: "Score produit",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  VALIDATED: {
    label: "Validé",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
};

const DEFAULT_STATUS: StatusInfo = {
  label: "Statut inconnu",
  className: "bg-slate-100 text-slate-600 border border-slate-200",
};

/* ================================================================
   PAGE PRINCIPALE
================================================================ */

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ==============================================================
     RÉCUPÉRATION DES ÉVALUATIONS
  ============================================================== */

  const fetchEvaluations = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const sb = createClient();

      const {
        data: { user },
        error: authError,
      } = await sb.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      }

      /*
       * Les politiques RLS de Supabase doivent limiter
       * les évaluations aux entreprises autorisées.
       *
       * On ne filtre pas ici par created_by :
       * plusieurs membres d'une même entreprise peuvent
       * devoir consulter un même dossier.
       */

      const { data, error: queryError } = await sb
        .from("evaluations")
        .select(`
          id,
          enterprise_id,
          observation_period,
          created_by,
          created_at,
          updated_at,
          version,
          status,
          score
        `)
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setEvaluations((data ?? []) as Evaluation[]);
    } catch (err) {
      console.error(
        "Erreur de récupération des évaluations :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des évaluations."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvaluations();

  }, [fetchEvaluations]);

  /* ==============================================================
     INDICATEURS
  ============================================================== */

  const total = evaluations.length;

  const drafts = evaluations.filter(
    (evaluation) => evaluation.status === "DRAFT"
  ).length;

  const inProgress = evaluations.filter(
    (evaluation) =>
      evaluation.status === "IN_PROGRESS" ||
      evaluation.status === "DRAFT"
  ).length;

  const submitted = evaluations.filter(
    (evaluation) => evaluation.status === "COMPLETED"
  ).length;

  const scoreProduced = evaluations.filter(
    (evaluation) =>
      evaluation.status === "SCORE_PRODUCED" ||
      evaluation.status === "VALIDATED"
  ).length;

  /* ==============================================================
     CHARGEMENT
  ============================================================== */

  if (loading) {
    return (
      <div className="gulgo-client-page flex min-h-[350px] items-center justify-center p-8">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Chargement de vos évaluations...
        </div>
      </div>
    );
  }

  /* ==============================================================
     ERREUR
  ============================================================== */

  if (error) {
    return (
      <div className="gulgo-client-page space-y-5 p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Impossible de charger les évaluations
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchEvaluations()}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    );
  }

  /* ==============================================================
     AFFICHAGE PRINCIPAL
  ============================================================== */

  return (
    <div className="gulgo-client-page gulgo-evaluations-page space-y-8">

      {/* ==========================================================
          HEADER
      ========================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
        <div className="bg-grid absolute inset-0 opacity-10" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
              <ClipboardCheck className="h-3.5 w-3.5" />
              SCORE PASS V1
            </div>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Vos évaluations
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Créez, complétez et suivez vos dossiers d&apos;évaluation
              Score Pass depuis votre espace entreprise.
            </p>
          </div>

          <EnterpriseIllustration variant="evaluations" />

          <Link
            href="/client/evaluations/new"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--navy)] shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ==========================================================
          KPI
      ========================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          icon={<FileText className="h-5 w-5" />}
          label="Dossiers"
          value={String(total)}
          description="Total des évaluations accessibles"
        />

        <KpiCard
          icon={<Clock3 className="h-5 w-5" />}
          label="À compléter"
          value={String(inProgress)}
          description={`${drafts} dossier(s) en brouillon`}
        />

        <KpiCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Soumis aux experts"
          value={String(submitted)}
          description="En attente de contrôle"
        />

        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Score produit"
          value={String(scoreProduced)}
          description="Scores calculés ou validés"
        />

      </section>

      {/* ==========================================================
          LISTE DES ÉVALUATIONS
      ========================================================== */}

      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">

        {/* TABLEAU */}

        <div className="card overflow-hidden">

          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-base font-semibold text-[var(--ink)]">
                Liste des évaluations
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Consultez et poursuivez vos dossiers Score Pass.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                <Activity className="h-3.5 w-3.5" />
                {total} dossier{total > 1 ? "s" : ""}
              </div>

              <button
                type="button"
                onClick={() => void fetchEvaluations(true)}
                disabled={refreshing}
                aria-label="Actualiser les évaluations"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>

            </div>
          </div>

          {/* DESKTOP */}

          <div className="hidden overflow-x-auto md:block">

            <table className="table w-full">

              <thead>
                <tr>
                  <th>Évaluation</th>
                  <th>Période</th>
                  <th>Version</th>
                  <th>Statut</th>
                  <th>Score</th>
                  <th>Dernière activité</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {evaluations.length === 0 ? (

                  <tr>
                    <td
                      colSpan={7}
                      className="py-14 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <FileText className="h-6 w-6" />
                        </div>

                        <p className="font-semibold text-slate-800">
                          Aucun dossier pour le moment
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          Créez votre première évaluation pour commencer
                          le parcours Score Pass.
                        </p>

                        <Link
                          href="/client/evaluations/new"
                          className="btn btn-primary mt-5 inline-flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Créer une évaluation
                        </Link>
                      </div>
                    </td>
                  </tr>

                ) : (

                  evaluations.map((evaluation) => {

                    const status = getStatusInfo(evaluation.status);

                    const period =
                      evaluation.observation_period ||
                      new Date(evaluation.created_at)
                        .getFullYear()
                        .toString();

                    const updated =
                      evaluation.updated_at || evaluation.created_at;

                    return (

                      <tr key={evaluation.id}>

                        <td>
                          <div>
                            <div className="font-semibold text-[var(--ink)]">
                              SP-{evaluation.id.slice(0, 8).toUpperCase()}
                            </div>

                            <div className="mt-1 text-xs text-[var(--muted)]">
                              Dossier Score Pass
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {period}
                          </div>
                        </td>

                        <td>
                          <span className="text-sm font-medium text-slate-700">
                            {evaluation.version || "V1.0"}
                          </span>
                        </td>

                        <td>
                          <StatusBadge status={status} />
                        </td>

                        <td>
                          <span className="text-sm font-semibold text-slate-700">
                            {formatScore(evaluation.score)}
                          </span>
                        </td>

                        <td>
                          <span className="text-xs text-[var(--muted)]">
                            {formatDate(updated)}
                          </span>
                        </td>

                        <td className="text-right">
                          <Link
                            href={`/client/evaluations/${evaluation.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                          >
                            Ouvrir
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}

          <div className="divide-y divide-slate-200 md:hidden">

            {evaluations.length === 0 ? (

              <div className="p-6 text-center">

                <p className="font-semibold text-slate-800">
                  Aucun dossier enregistré
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Créez votre première évaluation Score Pass.
                </p>

                <Link
                  href="/client/evaluations/new"
                  className="btn btn-primary mt-4 inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer un dossier
                </Link>

              </div>

            ) : (

              evaluations.map((evaluation) => {

                const status = getStatusInfo(evaluation.status);

                const period =
                  evaluation.observation_period ||
                  new Date(evaluation.created_at)
                    .getFullYear()
                    .toString();

                return (

                  <div key={evaluation.id} className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <div className="font-semibold text-[var(--ink)]">
                          SP-{evaluation.id.slice(0, 8).toUpperCase()}
                        </div>

                        <div className="mt-1 text-xs text-[var(--muted)]">
                          Dossier Score Pass · {evaluation.version || "V1.0"}
                        </div>
                      </div>

                      <StatusBadge status={status} />

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <MobileInfo
                        label="Période"
                        value={period}
                      />

                      <MobileInfo
                        label="Score"
                        value={formatScore(evaluation.score)}
                      />

                      <MobileInfo
                        label="Dernière activité"
                        value={formatDate(
                          evaluation.updated_at || evaluation.created_at
                        )}
                      />

                      <MobileInfo
                        label="Version"
                        value={evaluation.version || "V1.0"}
                      />

                    </div>

                    <Link
                      href={`/client/evaluations/${evaluation.id}`}
                      className="btn btn-secondary mt-5 flex w-full items-center justify-center gap-2"
                    >
                      Ouvrir le dossier
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                );
              })

            )}

          </div>

        </div>

        {/* SIDEBAR */}

        <aside className="space-y-5">

          <div className="premium-card p-6">

            <div className="icon-box mb-5">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              Évaluation structurée
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Le parcours Score Pass V1 organise la collecte des
              informations, la transmission des preuves, les contrôles
              experts et la restitution.
            </p>

            <div className="mt-5 space-y-3">

              <SideFeature
                icon={<ClipboardCheck className="h-4 w-4" />}
                text="37 variables à renseigner"
              />

              <SideFeature
                icon={<FileText className="h-4 w-4" />}
                text="Documents et preuves associés"
              />

              <SideFeature
                icon={<ShieldCheck className="h-4 w-4" />}
                text="Vérification par les experts GULGO"
              />

              <SideFeature
                icon={<BarChart3 className="h-4 w-4" />}
                text="Calcul et restitution du score"
              />

            </div>

          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">

            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              À retenir
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-950/75">
              Une donnée manquante n&apos;est pas automatiquement considérée
              comme une valeur nulle. Les données, les preuves et les
              règles méthodologiques doivent être examinées avant la
              production du Score Pass.
            </p>

          </div>

        </aside>

      </section>

    </div>
  );
}

/* ================================================================
   UTILITAIRES
================================================================ */

function getStatusInfo(status: string): StatusInfo {
  if (status in statusConfig) {
    return statusConfig[status as EvaluationStatus];
  }

  return DEFAULT_STATUS;
}

function formatScore(score: number | string | null): string {
  if (score === null || score === undefined || score === "") {
    return "Non calculé";
  }

  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return "Non calculé";
  }

  return `${numericScore.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })}/100`;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ================================================================
   BADGE DE STATUT
================================================================ */

function StatusBadge({ status }: { status: StatusInfo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

/* ================================================================
   KPI
================================================================ */

function KpiCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="card group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(16,24,40,0.08)]">

      <div className="flex items-start justify-between">

        <div className="icon-box">
          {icon}
        </div>

        <div className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {value}
        </div>

      </div>

      <div className="mt-5">

        <div className="text-sm font-semibold text-[var(--ink)]">
          {label}
        </div>

        <div className="mt-1 text-xs text-[var(--muted)]">
          {description}
        </div>

      </div>

    </div>
  );
}

/* ================================================================
   INFORMATIONS MOBILE
================================================================ */

function MobileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </div>

    </div>
  );
}

/* ================================================================
   FONCTIONNALITÉS LATÉRALES
================================================================ */

function SideFeature({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <span>{text}</span>

    </div>
  );
}