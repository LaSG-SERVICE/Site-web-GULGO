import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Info,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const dimensions = [
  {
    code: "D1",
    name: "Identité et existence",
    score: 90,
  },
  {
    code: "D2",
    name: "Activité et modèle économique",
    score: 70,
  },
  {
    code: "D3",
    name: "Situation financière",
    score: 80,
  },
  {
    code: "D4",
    name: "Gouvernance et organisation",
    score: 75,
  },
  {
    code: "D5",
    name: "Traçabilité et conformité",
    score: 65,
  },
  {
    code: "D6",
    name: "Dynamique et perspectives",
    score: 60,
  },
];

export default function Report() {
  const scorePass = 74;
  const iqp = 79.25;

  return (
    <main className="gulgo-client-page">
      <div className="container py-8 md:py-10">

        {/* ============================================================
            TOP BAR
        ============================================================ */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/client/evaluations"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux évaluations
          </Link>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <LockKeyhole className="h-3.5 w-3.5" />
            Restitution confidentielle
          </div>
        </div>

        {/* ============================================================
            HEADER
        ============================================================ */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
                <BarChart3 className="h-3.5 w-3.5" />
                SCORE PASS V1
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Rapport Score Pass
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Restitution structurée de l&apos;évaluation selon le
                référentiel méthodologique Score Pass V1.0.
              </p>
            </div>

            <div className="lg:text-right">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                Version méthodologique
              </div>

              <div className="mt-1 text-sm font-semibold">
                V1.0
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SCORE + IQP
        ============================================================ */}
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          {/* SCORE PASS */}
          <div className="card relative overflow-hidden p-6 md:p-8">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Score Pass
                </div>

                <h2 className="mt-3 text-lg font-semibold text-[var(--ink)]">
                  Indicateur synthétique
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                  Score interne agrégé à partir des dimensions évaluées
                  selon les règles du référentiel Score Pass V1.
                </p>
              </div>

              <div className="relative flex h-44 w-44 shrink-0 items-center justify-center self-center">
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-100" />

                <div
                  className="absolute inset-0 rounded-full border-[12px] border-blue-600 border-r-transparent border-b-transparent"
                  style={{
                    transform: "rotate(25deg)",
                  }}
                />

                <div className="text-center">
                  <div className="text-5xl font-bold tracking-tight text-[var(--navy)]">
                    {scorePass}
                  </div>

                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    / 100
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <Info className="h-4 w-4" />
                Valeur affichée à titre d&apos;illustration technique.
              </div>
            </div>
          </div>

          {/* IQP */}
          <div className="premium-card p-6 md:p-8">
            <div className="icon-box mb-5">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Indice de qualité des preuves
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight text-[var(--navy)]">
                {iqp.toLocaleString("fr-FR")}
              </span>

              <span className="mb-1 text-sm font-medium text-[var(--muted)]">
                / 100
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Indicateur complémentaire permettant d&apos;apprécier la qualité
              des éléments disponibles pour l&apos;évaluation.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${iqp}%` }}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            CONTEXT
        ============================================================ */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <ContextCard
            icon={<FileCheck2 className="h-5 w-5" />}
            label="Référentiel"
            value="Score Pass V1.0"
          />

          <ContextCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Dimensions"
            value="6 dimensions"
          />

          <ContextCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Nature"
            value="Exemple technique"
          />
        </section>

        {/* ============================================================
            DIMENSIONS
        ============================================================ */}
        <section className="mt-6 card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                  Analyse
                </div>

                <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
                  Résultats par dimension
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Détail des scores composant la restitution.
                </p>
              </div>

              <div className="text-xs text-[var(--muted)]">
                Échelle : 0 à 100
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Intitulé</th>
                  <th>Score</th>
                  <th className="w-[38%]">
                    Progression
                  </th>
                </tr>
              </thead>

              <tbody>
                {dimensions.map((dimension) => (
                  <tr key={dimension.code}>
                    <td>
                      <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                        {dimension.code}
                      </span>
                    </td>

                    <td>
                      <span className="font-medium text-[var(--ink)]">
                        {dimension.name}
                      </span>
                    </td>

                    <td>
                      <span className="font-semibold text-[var(--ink)]">
                        {dimension.score}
                        <span className="font-normal text-[var(--muted)]">
                          /100
                        </span>
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${dimension.score}%`,
                            }}
                          />
                        </div>

                        <span className="w-10 text-right text-xs font-semibold text-slate-500">
                          {dimension.score}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-slate-200 md:hidden">
            {dimensions.map((dimension) => (
              <div key={dimension.code} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                      {dimension.code}
                    </span>

                    <h3 className="mt-3 text-sm font-semibold text-[var(--ink)]">
                      {dimension.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--navy)]">
                      {dimension.score}
                    </div>

                    <div className="text-[11px] text-[var(--muted)]">
                      / 100
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${dimension.score}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            METHODOLOGY
        ============================================================ */}
        <section className="mt-6 grid gap-5 lg:grid-cols-2">

          <div className="card p-6 md:p-8">
            <div className="icon-box mb-5">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Lecture méthodologique
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Le Score Pass constitue une information structurée de
              crédibilité économique fondée sur les données et preuves
              disponibles à la date de l&apos;évaluation.
            </p>

            <div className="mt-5 space-y-3">
              <MethodItem>
                Les données disponibles sont analysées selon le référentiel
                Score Pass V1.
              </MethodItem>

              <MethodItem>
                Les données manquantes ne sont pas automatiquement
                considérées comme nulles.
              </MethodItem>

              <MethodItem>
                Les règles de calcul et d&apos;agrégation sont définies par
                la version méthodologique utilisée.
              </MethodItem>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 md:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Info className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-amber-950">
              Avertissement méthodologique
            </h2>

            <p className="mt-3 text-sm leading-6 text-amber-950/75">
              Le Score Pass constitue une information structurée de
              crédibilité économique fondée sur les données et preuves
              disponibles à la date de l&apos;évaluation. Il ne constitue ni
              une notation de crédit, ni une probabilité de défaut, ni une
              garantie de solvabilité, de remboursement, de performance
              future ou d&apos;accès au financement.
            </p>

            <p className="mt-4 text-sm leading-6 text-amber-950/75">
              Toute décision économique, commerciale, financière ou
              d&apos;investissement relève exclusivement du décideur concerné.
            </p>
          </div>
        </section>

        {/* ============================================================
            DEMO NOTICE
        ============================================================ */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

            <div>
              <div className="text-sm font-semibold text-blue-950">
                Exemple technique — aucune valeur officielle
              </div>

              <p className="mt-1 text-sm leading-6 text-blue-950/70">
                Les valeurs présentées dans ce rapport sont issues du cas
                numérique de démonstration du référentiel. Une restitution
                officielle devra être générée à partir d&apos;une évaluation
                enregistrée, de sa version de modèle et des données et
                preuves effectivement disponibles.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            ACTIONS
        ============================================================ */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/client/evaluations"
            className="btn btn-secondary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux évaluations
          </Link>

          <Link
            href="/client/documents"
            className="btn btn-primary inline-flex items-center justify-center gap-2"
          >
            Consulter les documents
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

/* ================================================================
   CONTEXT CARD
================================================================ */

function ContextCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="icon-box">
        {icon}
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </div>

        <div className="mt-1 text-sm font-semibold text-[var(--ink)]">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   METHOD ITEM
================================================================ */

function MethodItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

      <p className="text-sm leading-6 text-[var(--muted)]">
        {children}
      </p>
    </div>
  );
}