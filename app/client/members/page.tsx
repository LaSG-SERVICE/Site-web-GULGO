"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

const members = [
  {
    id: "demo-001",
    name: "Administrateur",
    email: "admin@organisation.fr",
    role: "CLIENT_ADMIN",
    roleLabel: "Administrateur",
    status: "ACTIVE",
    statusLabel: "Actif",
  },
];

export default function Page() {
  const totalMembers = members.length;
  const activeMembers = members.filter(
    (member) => member.status === "ACTIVE"
  ).length;
  const pendingMembers = members.filter(
    (member) => member.status === "PENDING"
  ).length;

  return (
    <div className="gulgo-client-page gulgo-members-page space-y-8">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
              <Users className="h-3.5 w-3.5" />
              ORGANISATION
            </div>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Membres
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Gérez les utilisateurs rattachés à votre organisation et
              contrôlez leurs niveaux d&apos;accès à l&apos;espace gulgo.
            </p>
          </div>

          <EnterpriseIllustration variant="members" />

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--navy)] shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <UserPlus className="h-4 w-4" />
            Inviter un membre
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ============================================================
          KPI
      ============================================================ */}
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Membres"
          value={String(totalMembers)}
          description="Utilisateurs rattachés"
        />

        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Actifs"
          value={String(activeMembers)}
          description="Accès actuellement actifs"
        />

        <KpiCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Invitations"
          value={String(pendingMembers)}
          description="Invitations en attente"
        />
      </section>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* ----------------------------------------------------------
            MEMBERS TABLE
        ---------------------------------------------------------- */}
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--ink)]">
                Utilisateurs de l&apos;organisation
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Consultez les membres et leurs niveaux d&apos;accès.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Accès contrôlés
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} />

                        <div>
                          <div className="font-semibold text-[var(--ink)]">
                            {member.name}
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                            <Mail className="h-3.5 w-3.5" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                        {member.roleLabel}
                      </span>
                    </td>

                    <td>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {member.statusLabel}
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-200 md:hidden">
            {members.map((member) => (
              <div key={member.id} className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={member.name} />

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[var(--ink)]">
                      {member.name}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 break-all text-xs text-[var(--muted)]">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Rôle
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {member.roleLabel}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Statut
                    </div>

                    <div className="mt-1 text-sm font-semibold text-emerald-700">
                      {member.statusLabel}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary mt-5 flex w-full items-center justify-center gap-2"
                >
                  Gérer le membre
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------
            SIDEBAR
        ---------------------------------------------------------- */}
        <aside className="space-y-5">
          <div className="premium-card p-6">
            <div className="icon-box mb-5">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              Gestion des accès
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Chaque membre dispose d&apos;un rôle déterminant les actions
              auxquelles il peut accéder au sein de l&apos;organisation.
            </p>

            <div className="mt-5 space-y-3">
              <RoleItem
                role="CLIENT_ADMIN"
                description="Administration de l'organisation"
              />

              <RoleItem
                role="CLIENT_USER"
                description="Utilisation de l'espace client"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Sécurité
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-950/75">
              Les accès sont isolés par organisation. Les politiques RLS
              de Supabase constituent la couche de contrôle des données
              côté serveur.
            </p>
          </div>
        </aside>
      </section>

      {/* ============================================================
          FOOT NOTE
      ============================================================ */}
      <div className="flex items-center gap-3 border-t border-slate-200 pt-5 text-xs text-[var(--muted)]">
        <ShieldCheck className="h-4 w-4 shrink-0" />

        <span>
          La gestion des membres est soumise aux rôles et permissions
          configurés pour votre organisation.
        </span>
      </div>
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

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-light)] text-sm font-bold text-blue-700">
      {initials}
    </div>
  );
}

function RoleItem({
  role,
  description,
}: {
  role: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="text-xs font-bold text-slate-700">{role}</div>

      <div className="mt-1 text-xs leading-5 text-[var(--muted)]">
        {description}
      </div>
    </div>
  );
}