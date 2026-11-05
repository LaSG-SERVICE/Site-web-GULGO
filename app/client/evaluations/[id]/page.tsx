
import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Info,
  LockKeyhole,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { EvaluationVariableForm } from "@/components/EvaluationVariableForm";

/* ================================================================
   TYPES
================================================================ */

type PageProps = {
  params: Promise<{ id: string }>;
};

/* ================================================================
   PAGE PRINCIPALE
================================================================ */

export default async function EvaluationDetail({ params }: PageProps) {
  const { id } = await params;

  const validId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    );

  if (!validId) {
    return (
      <div className="gulgo-client-page space-y-5 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Référence d'évaluation invalide
          </h1>
          <p className="mt-2 text-sm text-red-700">
            L'identifiant du dossier transmis dans l'URL n'est pas valide.
          </p>
        </div>

        <Link
          href="/client/evaluations"
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux évaluations
        </Link>
      </div>
    );
  }

  return (
    <div className="gulgo-client-page space-y-7">

      {/* ==========================================================
          EN-TÊTE
      ========================================================== */}

      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(16,24,40,0.06)]">

        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--blue)]" />

        <div className="relative p-6 md:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--blue-light)] text-[var(--blue)]">
                <ClipboardCheck className="h-7 w-7" />
              </div>

              <div>

                <div className="mb-2 flex flex-wrap items-center gap-2">

                  <span className="badge badge-blue">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Évaluation Score Pass
                  </span>

                  <span className="badge">
                    Référentiel V1
                  </span>

                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--ink)] md:text-3xl">
                  Dossier d'évaluation
                </h1>

                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">

                  <span>Référence</span>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-[var(--ink-2)]">
                    SP-{id.slice(0, 8).toUpperCase()}
                  </span>

                </p>

              </div>
            </div>

            <Link
              href="/client/evaluations"
              className="btn btn-secondary inline-flex items-center justify-center gap-2 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux évaluations
            </Link>

          </div>

          {/* INFORMATIONS RAPIDES */}

          <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">

            <QuickInfo
              icon={<ClipboardCheck className="h-4 w-4" />}
              label="Référentiel"
              value="Score Pass V1"
            />

            <QuickInfo
              icon={<BarChart3 className="h-4 w-4" />}
              label="Structure"
              value="6 dimensions · 24 indicateurs"
            />

            <QuickInfo
              icon={<FileText className="h-4 w-4" />}
              label="Collecte"
              value="37 variables"
            />

          </div>

        </div>
      </section>

      {/* ==========================================================
          PARCOURS D'ÉVALUATION
      ========================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

        <div className="mb-5">

          <h2 className="text-base font-semibold text-[var(--ink)]">
            Parcours Score Pass
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Les différentes étapes de constitution, de vérification et de
            restitution de votre dossier.
          </p>

        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">

          <WorkflowStep
            number="01"
            title="Informations initiales"
            description="Identification du dossier"
            icon={<ClipboardCheck className="h-5 w-5" />}
            state="complete"
          />

          <WorkflowStep
            number="02"
            title="Variables"
            description="Saisie des 37 variables"
            icon={<FileText className="h-5 w-5" />}
            state="current"
          />

          <WorkflowStep
            number="03"
            title="Documents"
            description="Dépôt des justificatifs"
            icon={<Upload className="h-5 w-5" />}
            state="pending"
          />

          <WorkflowStep
            number="04"
            title="Contrôles"
            description="Vérifications par les experts"
            icon={<ShieldCheck className="h-5 w-5" />}
            state="pending"
          />

          <WorkflowStep
            number="05"
            title="Restitution"
            description="Résultats Score Pass"
            icon={<BarChart3 className="h-5 w-5" />}
            state="pending"
          />

        </div>

      </section>

      {/* ==========================================================
          INFORMATIONS MÉTHODOLOGIQUES
      ========================================================== */}

      <section className="grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
              <Info className="h-5 w-5" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-[var(--ink)]">
                À propos de la collecte
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                Renseignez les informations demandées dans le référentiel
                Score Pass V1. Les variables descriptives, calculées,
                de traçabilité et de contrôle ne doivent pas être traitées
                comme de simples champs de saisie.
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-[var(--ink)]">
                Confidentialité des données
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                Les réponses et les documents transmis sont rattachés
                au dossier de l'entreprise. Leur accès doit être limité
                aux utilisateurs autorisés selon les politiques de sécurité
                GULGO.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================================
          COLLECTE DES VARIABLES
      ========================================================== */}

      <section className="card overflow-hidden">

        <div className="border-b border-slate-200 bg-white px-6 py-5 md:px-7">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-3">

              <div className="icon-box h-10 w-10 rounded-xl">
                <FileCheck2 className="h-5 w-5" />
              </div>

              <div>

                <h2 className="font-semibold text-[var(--ink)]">
                  Étape 02 — Variables Score Pass
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Renseignez les informations nécessaires à l'évaluation
                  de votre entreprise.
                </p>

              </div>

            </div>

            <span className="badge badge-blue">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Collecte des données
            </span>

          </div>

        </div>

        <div className="bg-[var(--bg-soft)]/40 p-5 md:p-7">

          <EvaluationVariableForm
            evaluationId={id}
          />

        </div>

      </section>

      {/* ==========================================================
          DOCUMENTS JUSTIFICATIFS
      ========================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Upload className="h-5 w-5" />
          </div>

          <div className="min-w-0">

            <h2 className="font-semibold text-[var(--ink)]">
              Étape 03 — Documents et justificatifs
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Les documents justificatifs doivent être associés aux
              variables qu'ils permettent de documenter. Ils seront
              ensuite accessibles aux experts GULGO pour vérification.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              <span className="badge">
                <FileText className="h-3.5 w-3.5" />
                Documents PDF
              </span>

              <span className="badge">
                Documents bureautiques
              </span>

              <span className="badge">
                Justificatifs et preuves
              </span>

            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Le dépôt des documents sera activé dans le module
              de gestion documentaire associé à cette évaluation.
            </p>

          </div>

        </div>

      </section>

      {/* ==========================================================
          CONTRÔLES ET RESTITUTION
      ========================================================== */}

      <section className="grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h2 className="font-semibold text-[var(--ink)]">
            Étape 04 — Contrôles experts
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Les experts GULGO examinent les réponses, les justificatifs,
            les contradictions éventuelles et les anomalies.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5" />
            Espace réservé aux experts autorisés
          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <BarChart3 className="h-5 w-5" />
          </div>

          <h2 className="font-semibold text-[var(--ink)]">
            Étape 05 — Restitution
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Après les contrôles et la validation des paramètres
            méthodologiques, le moteur produira le score global,
            les résultats par dimension et le rapport de restitution.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5" />
            Disponible après validation du dossier
          </div>

        </div>

      </section>

      {/* ==========================================================
          RAPPEL MÉTHODOLOGIQUE
      ========================================================== */}

      <section className="relative overflow-hidden rounded-[24px] bg-[var(--navy)] p-6 text-white md:p-7">

        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-start">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="max-w-4xl">

            <h2 className="font-semibold">
              Principe méthodologique Score Pass
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Une donnée manquante ne doit jamais être assimilée
              automatiquement à une valeur nulle. Les données calculées,
              les contrôles, la qualité des preuves, les règles de
              normalisation et les pondérations doivent respecter
              le référentiel Score Pass V1.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

/* ================================================================
   COMPOSANT — INFORMATION RAPIDE
================================================================ */

function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--blue)] shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-[var(--ink)]">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ================================================================
   COMPOSANT — ÉTAPES DU PARCOURS
================================================================ */

function WorkflowStep({
  number,
  title,
  description,
  icon,
  state,
}: {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  state: "complete" | "current" | "pending";
}) {
  const styles = {
    complete: {
      container: "border-green-200 bg-green-50/70",
      icon: "bg-green-100 text-green-700",
      number: "text-green-700",
      label: "Initialisée",
    },
    current: {
      container: "border-blue-200 bg-blue-50/70",
      icon: "bg-blue-100 text-blue-700",
      number: "text-blue-700",
      label: "À compléter",
    },
    pending: {
      container: "border-slate-200 bg-slate-50",
      icon: "bg-slate-100 text-slate-500",
      number: "text-slate-400",
      label: "À venir",
    },
  };

  const style = styles[state];

  return (
    <div className={`rounded-xl border p-4 ${style.container}`}>

      <div className="flex items-center justify-between">

        <span className={`text-xs font-bold ${style.number}`}>
          {number}
        </span>

        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.icon}`}>
          {icon}
        </div>

      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
        {description}
      </p>

      <p className={`mt-3 text-[10px] font-bold uppercase tracking-wide ${style.number}`}>
        {style.label}
      </p>

    </div>
  );
}
