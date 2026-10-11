import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import Link from "next/link";
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
  ShieldCheck,
} from "lucide-react";

const evaluations = [
  {
    id: "SP-DEMO-001",
    version: "V1.0",
    status: "IN_PROGRESS",
    statusLabel: "En cours",
    statusClass: "bg-amber-50 text-amber-700 border border-amber-200",
    score: "—",
    period: "2026",
    updated: "Mise à jour récente",
  },
];

export default function Evaluations() {
  const total = evaluations.length;
  const inProgress = evaluations.filter(
    (evaluation) => evaluation.status === "IN_PROGRESS"
  ).length;
  const completed = evaluations.filter(
    (evaluation) => evaluation.status === "SCORE_PRODUCED"
  ).length;

  return (
    <div className="gulgo-client-page gulgo-evaluations-page space-y-8">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
        <div className="absolute inset-0 bg-grid opacity-10" />

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
              Score Pass depuis un espace unique.
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

      {/* ============================================================
          KPI
      ============================================================ */}
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<FileText className="h-5 w-5" />}
          label="Dossiers"
          value={String(total)}
          description="Évaluations enregistrées"
        />

        <KpiCard
          icon={<Clock3 className="h-5 w-5" />}
          label="En cours"
          value={String(inProgress)}
          description="Dossiers à compléter"
        />

        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Score produit"
          value={String(completed)}
          description="Évaluations finalisées"
        />
      </section>

      {/* ============================================================
          INFORMATION
      ============================================================ */}
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* TABLE */}
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--ink)]">
                Liste des évaluations
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Consultez l&apos;état d&apos;avancement de vos dossiers.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              <Activity className="h-3.5 w-3.5" />
              {total} dossier{total > 1 ? "s" : ""}
            </div>
          </div>

          {/* Desktop */}
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
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>
                      <div>
                        <div className="font-semibold text-[var(--ink)]">
                          {evaluation.id}
                        </div>

                        <div className="mt-1 text-xs text-[var(--muted)]">
                          Dossier Score Pass
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {evaluation.period}
                      </div>
                    </td>

                    <td>
                      <span className="text-sm font-medium text-slate-700">
                        {evaluation.version}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${evaluation.statusClass}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {evaluation.statusLabel}
                      </span>
                    </td>

                    <td>
                      <span className="text-sm font-semibold text-slate-700">
                        {evaluation.score}
                      </span>
                    </td>

                    <td>
                      <span className="text-xs text-[var(--muted)]">
                        {evaluation.updated}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-200 md:hidden">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[var(--ink)]">
                      {evaluation.id}
                    </div>

                    <div className="mt-1 text-xs text-[var(--muted)]">
                      Dossier Score Pass · {evaluation.version}
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${evaluation.statusClass}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {evaluation.statusLabel}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MobileInfo
                    label="Période"
                    value={evaluation.period}
                  />

                  <MobileInfo
                    label="Score"
                    value={evaluation.score}
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
            ))}
          </div>
        </div>

        {/* ============================================================
            SIDEBAR
        ============================================================ */}
        <aside className="space-y-5">
          <div className="premium-card p-6">
            <div className="icon-box mb-5">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              Évaluation structurée
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Le parcours Score Pass V1 structure les informations,
              les données et les preuves nécessaires à l&apos;évaluation.
            </p>

            <div className="mt-5 space-y-3">
              <SideFeature
                icon={<ClipboardCheck className="h-4 w-4" />}
                text="37 variables à renseigner"
              />

              <SideFeature
                icon={<FileText className="h-4 w-4" />}
                text="Données et preuves associées"
              />

              <SideFeature
                icon={<BarChart3 className="h-4 w-4" />}
                text="Restitution structurée"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              À retenir
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-950/75">
              Une donnée manquante n&apos;est pas automatiquement considérée
              comme une valeur nulle. Les règles de calcul dépendent du
              référentiel Score Pass V1.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* ================================================================
   COMPONENTS
================================================================ */

function KpiCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="card group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(16,24,40,0.08)]">
      <div className="flex items-start justify-between">
        <div className="icon-box">{icon}</div>

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

      <div className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </div>
    </div>
  );
}

function SideFeature({
  icon,
  text,
}: {
  icon: React.ReactNode;
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