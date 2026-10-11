"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function Page() {
  return (
    <main className="gulgo-client-page gulgo-score-pass-page">
      <div className="container py-8 md:py-10">

        {/* ============================================================
            HEADER
        ============================================================ */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
                <BarChart3 className="h-3.5 w-3.5" />
                SCORE PASS V1
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Score Pass
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Consultez le statut de votre évaluation et, lorsque les
                conditions de restitution sont réunies, accédez à votre
                résultat Score Pass.
              </p>
            </div>

            <EnterpriseIllustration variant="score" />

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-white/70" />

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Référentiel
                </div>

                <div className="mt-0.5 text-sm font-semibold">
                  Version V1.0
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            STATUS
        ============================================================ */}
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

          <div className="card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="icon-box">
                <Clock3 className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                      Statut de l&apos;évaluation
                    </div>

                    <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
                      Évaluation en cours
                    </h2>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    En cours
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  Votre dossier est actuellement en cours de constitution
                  ou de contrôle. Le résultat Score Pass sera accessible
                  lorsque les conditions prévues par le référentiel seront
                  réunies.
                </p>
              </div>
            </div>

            {/* Progression */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">
                  Avancement du parcours
                </span>

                <span className="text-xs font-semibold text-[var(--muted)]">
                  2 / 4 étapes
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "50%" }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <ProgressStep
                  number="01"
                  label="Dossier"
                  done
                />

                <ProgressStep
                  number="02"
                  label="Données"
                  active
                />

                <ProgressStep
                  number="03"
                  label="Contrôles"
                />

                <ProgressStep
                  number="04"
                  label="Restitution"
                />
              </div>
            </div>
          </div>

          {/* SCORE PREVIEW */}
          <div className="premium-card p-6 md:p-8">
            <div className="icon-box mb-5">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Résultat
            </div>

            <h2 className="mt-2 text-lg font-semibold text-[var(--ink)]">
              Score Pass
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-slate-100">
                <span className="text-xl font-bold text-slate-300">
                  —
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Résultat non disponible
                </div>

                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  Le Score Pass sera affiché lorsque l&apos;évaluation sera
                  suffisamment complète et autorisée à la restitution.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                <p className="text-xs leading-5 text-slate-600">
                  L&apos;absence de score ne signifie pas automatiquement un
                  score nul. Le référentiel distingue notamment les données
                  manquantes, non évaluables, non applicables et les situations
                  nécessitant une vérification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            INFORMATION CARDS
        ============================================================ */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<FileCheck2 className="h-5 w-5" />}
            title="Données et preuves"
            description="Les informations nécessaires à l'évaluation sont collectées et contrôlées."
          />

          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Contrôles"
            description="Les éléments du dossier peuvent faire l'objet de contrôles et de vérifications."
          />

          <InfoCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Restitution"
            description="Le résultat est produit selon la version méthodologique applicable à l'évaluation."
          />
        </section>

        {/* ============================================================
            QUICK ACTIONS
        ============================================================ */}
        <section className="mt-6 card p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                Poursuivre votre dossier
              </div>

              <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
                Complétez les éléments nécessaires à l&apos;évaluation
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Vous pouvez consulter vos évaluations, transmettre les
                documents demandés et suivre les éventuelles demandes de
                compléments.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/client/evaluations"
                className="btn btn-secondary inline-flex items-center justify-center gap-2"
              >
                Mes évaluations
              </Link>

              <Link
                href="/client/documents"
                className="btn btn-primary inline-flex items-center justify-center gap-2"
              >
                Documents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            METHODOLOGY NOTICE
        ============================================================ */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

            <div>
              <div className="text-sm font-semibold text-blue-950">
                À propos du Score Pass
              </div>

              <p className="mt-1 text-sm leading-6 text-blue-950/70">
                Le Score Pass constitue une information structurée de
                crédibilité économique fondée sur les données et preuves
                disponibles à la date de l&apos;évaluation. Il ne constitue
                ni une notation de crédit, ni une probabilité de défaut, ni
                une garantie de solvabilité, de remboursement, de performance
                future ou d&apos;accès au financement.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ================================================================
   INFO CARD
================================================================ */

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="icon-box mb-4">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   PROGRESS STEP
================================================================ */

function ProgressStep({
  number,
  label,
  done = false,
  active = false,
}: {
  number: string;
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          done
            ? "bg-blue-600 text-white"
            : active
              ? "border border-blue-200 bg-blue-50 text-blue-700"
              : "border border-slate-200 bg-white text-slate-400",
        ].join(" ")}
      >
        {done ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <span
        className={[
          "text-xs font-semibold",
          done || active
            ? "text-[var(--ink)]"
            : "text-slate-400",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}