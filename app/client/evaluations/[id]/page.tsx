import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Info,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { EvaluationVariableForm } from "@/components/EvaluationVariableForm";

export default async function EvaluationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="gulgo-client-page space-y-7">
      {/* ============================================================
          EN-TÊTE DU DOSSIER
      ============================================================ */}

      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(16,24,40,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--blue)]" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* IDENTITÉ */}
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
                    Version V1
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--ink)] md:text-3xl">
                  Dossier d’évaluation
                </h1>

                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  <span>Référence</span>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-[var(--ink-2)]">
                    {id}
                  </span>
                </p>
              </div>
            </div>

            {/* RETOUR */}
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
              label="Collecte"
              value="37 variables"
            />

            <QuickInfo
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Traitement"
              value="Données et preuves"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          BANDEAU MÉTHODOLOGIQUE
      ============================================================ */}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)]">
                À propos de cette collecte
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                Renseignez les informations demandées dans le référentiel
                Score Pass V1. Les données et preuves disponibles permettent
                de construire progressivement le dossier d’évaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(16,24,40,0.035)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)]">
                Données du dossier
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                Les informations saisies sont rattachées à ce dossier et
                doivent être renseignées avec précision à partir des éléments
                disponibles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FORMULAIRE
      ============================================================ */}

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-6 py-5 md:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="icon-box h-10 w-10 rounded-xl">
                <FileCheck2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--ink)]">
                  Données de l’évaluation
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Complétez les variables nécessaires à l’instruction du
                  dossier.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge-blue">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saisie en cours
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-soft)]/40 p-5 md:p-7">
          <EvaluationVariableForm evaluationId={id} />
        </div>
      </section>

      {/* ============================================================
          RAPPEL MÉTHODOLOGIQUE
      ============================================================ */}

      <section className="relative overflow-hidden rounded-[24px] bg-[var(--navy)] p-6 text-white md:p-7">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="max-w-4xl">
            <h2 className="font-semibold">
              Principe de collecte
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Les données manquantes ne doivent pas être assimilées
              automatiquement à une valeur nulle. Lorsque l’information
              n’est pas disponible ou ne peut pas être évaluée, le statut
              approprié doit être utilisé conformément au référentiel
              Score Pass V1.
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
  icon: React.ReactNode;
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