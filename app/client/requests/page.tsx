"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  MessageSquare,
  Plus,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

const requests = [
  {
    id: "REQ-DEMO-001",
    title: "Justificatif d’activité",
    description:
      "Un justificatif complémentaire peut être demandé afin de poursuivre la vérification du dossier.",
    evaluation: "SP-DEMO-001",
    status: "PENDING",
    statusLabel: "À traiter",
    priority: "Important",
    date: "08/09/2026",
  },
];

export default function Page() {
  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  return (
    <div className="gulgo-client-page gulgo-requests-page space-y-8">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
              <MessageSquare className="h-3.5 w-3.5" />
              SUIVI DES DEMANDES
            </div>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Demandes gulgo
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Répondez aux demandes de complément adressées à votre
              entreprise et suivez leur traitement depuis votre espace.
            </p>
          </div>

          <EnterpriseIllustration variant="requests" />

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4" />
            Suivi sécurisé des dossiers
          </div>
        </div>
      </section>

      {/* ============================================================
          KPI
      ============================================================ */}
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<FileText className="h-5 w-5" />}
          label="Demandes"
          value={String(totalRequests)}
          description="Demandes associées à vos dossiers"
        />

        <KpiCard
          icon={<Clock3 className="h-5 w-5" />}
          label="À traiter"
          value={String(pendingRequests)}
          description="Actions actuellement attendues"
        />

        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Traitées"
          value={String(completedRequests)}
          description="Demandes clôturées"
        />
      </section>

      {/* ============================================================
          CONTENT
      ============================================================ */}
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* ----------------------------------------------------------
            REQUEST LIST
        ---------------------------------------------------------- */}
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--ink)]">
                Demandes en cours
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Consultez les compléments demandés pour vos évaluations.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {pendingRequests} action
              {pendingRequests > 1 ? "s" : ""} attendue
              {pendingRequests > 1 ? "s" : ""}
            </div>
          </div>

          {requests.length > 0 ? (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Demande</th>
                      <th>Évaluation</th>
                      <th>Priorité</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <div>
                            <div className="font-semibold text-[var(--ink)]">
                              {request.title}
                            </div>

                            <div className="mt-1 max-w-sm text-xs leading-5 text-[var(--muted)]">
                              {request.description}
                            </div>

                            <div className="mt-2 text-[11px] font-medium text-slate-400">
                              {request.id}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="text-sm font-medium text-slate-700">
                            {request.evaluation}
                          </span>
                        </td>

                        <td>
                          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {request.priority}
                          </span>
                        </td>

                        <td>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {request.statusLabel}
                          </span>
                        </td>

                        <td>
                          <span className="text-xs text-[var(--muted)]">
                            {request.date}
                          </span>
                        </td>

                        <td className="text-right">
                          <Link
                            href={`/client/evaluations/${request.evaluation}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                          >
                            Consulter
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
                {requests.map((request) => (
                  <div key={request.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <FileCheck2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[var(--ink)]">
                          {request.title}
                        </div>

                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {request.id}
                        </div>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        À traiter
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                      {request.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MobileInfo
                        label="Évaluation"
                        value={request.evaluation}
                      />

                      <MobileInfo
                        label="Date"
                        value={request.date}
                      />
                    </div>

                    <Link
                      href={`/client/evaluations/${request.evaluation}`}
                      className="btn btn-secondary mt-5 flex w-full items-center justify-center gap-2"
                    >
                      Consulter la demande
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* ----------------------------------------------------------
            SIDEBAR
        ---------------------------------------------------------- */}
        <aside className="space-y-5">
          <div className="premium-card p-6">
            <div className="icon-box mb-5">
              <UploadCloud className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              Comment répondre ?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Lorsqu&apos;un complément est demandé, vous pourrez transmettre
              les informations ou documents nécessaires directement depuis
              votre dossier.
            </p>

            <div className="mt-5 space-y-3">
              <ProcessStep
                number="01"
                title="Consulter"
                description="Prenez connaissance de la demande."
              />

              <ProcessStep
                number="02"
                title="Compléter"
                description="Ajoutez les informations demandées."
              />

              <ProcessStep
                number="03"
                title="Transmettre"
                description="Envoyez votre réponse à gulgo."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Documents
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-950/75">
              Les documents nécessaires à une demande pourront être déposés
              depuis votre espace documentaire.
            </p>

            <Link
              href="/client/documents"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              Accéder aux documents
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* ============================================================
          INFORMATION
      ============================================================ */}
      <div className="flex items-center gap-3 border-t border-slate-200 pt-5 text-xs text-[var(--muted)]">
        <ShieldCheck className="h-4 w-4 shrink-0" />

        <span>
          Les demandes sont rattachées aux dossiers d&apos;évaluation
          concernés et leur traitement pourra être historisé.
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   KPI CARD
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

/* ================================================================
   MOBILE INFO
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

      <div className="mt-1 truncate text-sm font-semibold text-slate-700">
        {value}
      </div>
    </div>
  );
}

/* ================================================================
   PROCESS STEP
================================================================ */

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">
        {number}
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-700">
          {title}
        </div>

        <div className="mt-1 text-xs leading-5 text-[var(--muted)]">
          {description}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FileCheck2 className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-[var(--ink)]">
        Aucune demande en cours
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        Vous n&apos;avez actuellement aucune demande de complément à traiter.
      </p>
    </div>
  );
}