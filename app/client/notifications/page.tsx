"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Info,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const notifications = [
  {
    id: "demo-001",
    type: "status",
    title: "Évaluation en cours",
    message:
      "Votre dossier SP-DEMO-001 est actuellement en cours de traitement.",
    date: "Aujourd’hui",
    time: "Récent",
    unread: true,
  },
  {
    id: "demo-002",
    type: "request",
    title: "Données à compléter",
    message:
      "Certaines informations peuvent être nécessaires pour poursuivre votre dossier.",
    date: "Hier",
    time: "Il y a 1 jour",
    unread: false,
  },
];

export default function Notifications() {
  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div className="gulgo-client-page gulgo-notifications-page space-y-8">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
              <Bell className="h-3.5 w-3.5" />
              CENTRE DE NOTIFICATIONS
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-[var(--navy)]">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Retrouvez ici les demandes, changements de statut et messages
              transmis par gulgo concernant vos dossiers.
            </p>
          </div>

          <EnterpriseIllustration variant="notifications" />

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4" />
            Espace organisation
          </div>
        </div>
      </section>

      {/* ============================================================
          KPI
      ============================================================ */}
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<Bell className="h-5 w-5" />}
          label="Notifications"
          value={String(notifications.length)}
          description="Messages disponibles"
        />

        <KpiCard
          icon={<Info className="h-5 w-5" />}
          label="À consulter"
          value={String(unreadCount)}
          description="Notifications non lues"
        />

        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Suivi"
          value="Actif"
          description="Informations de vos dossiers"
        />
      </section>

      {/* ============================================================
          NOTIFICATIONS
      ============================================================ */}
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--ink)]">
                Activité récente
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Les dernières informations relatives à votre espace.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="text-left text-xs font-semibold text-blue-700 transition hover:text-blue-800 sm:text-right"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  type={notification.type}
                  title={notification.title}
                  message={notification.message}
                  date={notification.date}
                  time={notification.time}
                  unread={notification.unread}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* ==========================================================
            SIDEBAR
        ========================================================== */}
        <aside className="space-y-5">
          <div className="premium-card p-6">
            <div className="icon-box mb-5">
              <MessageSquare className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              Restez informé
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Les notifications permettent de suivre les principales étapes
              de vos dossiers et les éventuelles actions attendues.
            </p>

            <div className="mt-5 space-y-3">
              <InfoItem
                icon={<FileCheck2 className="h-4 w-4" />}
                title="Demandes"
                description="Informations ou justificatifs à fournir"
              />

              <InfoItem
                icon={<Clock3 className="h-4 w-4" />}
                title="Statuts"
                description="Évolution de vos dossiers"
              />

              <InfoItem
                icon={<MessageSquare className="h-4 w-4" />}
                title="Messages"
                description="Communications de gulgo"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Centre d&apos;aide
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-950/75">
              Une demande concernant votre dossier peut nécessiter une action
              depuis votre espace client.
            </p>

            <Link
              href="/client/evaluations"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              Voir mes évaluations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* ============================================================
          SECURITY NOTE
      ============================================================ */}
      <div className="flex items-center gap-3 border-t border-slate-200 pt-5 text-xs text-[var(--muted)]">
        <ShieldCheck className="h-4 w-4 shrink-0" />

        <span>
          Les notifications affichées dans cet espace sont rattachées au
          contexte de votre organisation.
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   NOTIFICATION ITEM
================================================================ */

function NotificationItem({
  type,
  title,
  message,
  date,
  time,
  unread,
}: {
  type: string;
  title: string;
  message: string;
  date: string;
  time: string;
  unread: boolean;
}) {
  const icon =
    type === "request" ? (
      <FileCheck2 className="h-5 w-5" />
    ) : type === "status" ? (
      <Clock3 className="h-5 w-5" />
    ) : (
      <Info className="h-5 w-5" />
    );

  return (
    <div
      className={`group px-6 py-5 transition ${
        unread ? "bg-blue-50/30" : "bg-white"
      } hover:bg-slate-50`}
    >
      <div className="flex gap-4">
        {/* ICON */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            unread
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                {title}
              </h3>

              {unread && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>

            <div className="shrink-0 text-xs text-[var(--muted)]">
              {date}
            </div>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {message}
          </p>

          <div className="mt-3 text-xs font-medium text-slate-400">
            {time}
          </div>
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
        <Bell className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-[var(--ink)]">
        Aucune notification
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        Vous n&apos;avez actuellement aucune nouvelle notification.
        Les informations importantes concernant vos dossiers apparaîtront
        ici.
      </p>
    </div>
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
   SIDEBAR ITEM
================================================================ */

function InfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
        {icon}
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