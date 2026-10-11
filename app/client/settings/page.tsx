"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import {
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function Settings() {
  return (
    <main className="gulgo-client-page gulgo-settings-page">
      <div className="container py-8 md:py-10">

        {/* ============================================================
            HEADER
        ============================================================ */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(8,27,51,0.14)] md:px-9 md:py-10">
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
                <LockKeyhole className="h-3.5 w-3.5" />
                ESPACE DE COMPTE
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Paramètres
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Gérez vos préférences de compte, vos notifications et les
                paramètres liés à la sécurité de votre espace gulgo.
              </p>
            </div>

            <EnterpriseIllustration variant="settings" />

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-white/70" />

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Environnement
                </div>

                <div className="mt-0.5 text-sm font-semibold">
                  Espace sécurisé
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            ACCOUNT
        ============================================================ */}
        <section className="mt-6">
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Compte
            </div>

            <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
              Informations du compte
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Gérez les paramètres associés à votre accès gulgo.
            </p>
          </div>

          <div className="card divide-y divide-slate-200 overflow-hidden">
            <SettingRow
              icon={<UserRound className="h-5 w-5" />}
              title="Profil utilisateur"
              description="Informations personnelles et identité associées à votre compte."
            />

            <SettingRow
              icon={<Mail className="h-5 w-5" />}
              title="Adresse e-mail"
              description="Adresse utilisée pour l'authentification et les communications gulgo."
            />

            <SettingRow
              icon={<LockKeyhole className="h-5 w-5" />}
              title="Mot de passe"
              description="Gestion des paramètres d'accès et de sécurité de votre compte."
            />
          </div>
        </section>

        {/* ============================================================
            NOTIFICATIONS
        ============================================================ */}
        <section className="mt-8">
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Communication
            </div>

            <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Gérez les informations que vous souhaitez recevoir concernant
              votre espace et vos évaluations.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7">
              <div className="flex gap-4">
                <div className="icon-box shrink-0">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Préférences de notification
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Les préférences de notifications seront prochainement
                    connectées aux paramètres de votre compte.
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                À configurer
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECURITY
        ============================================================ */}
        <section className="mt-8">
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Sécurité
            </div>

            <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
              Sécurité et accès
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Les paramètres de sécurité sont gérés dans le cadre du système
              d'authentification gulgo.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="card p-6 md:p-7">
              <div className="icon-box mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-[var(--ink)]">
                Protection du compte
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                L'accès aux fonctionnalités de votre espace dépend de votre
                authentification et des droits associés à votre organisation.
              </p>

              <div className="mt-5 space-y-3">
                <SecurityItem>
                  Authentification du compte
                </SecurityItem>

                <SecurityItem>
                  Gestion des droits d'accès
                </SecurityItem>

                <SecurityItem>
                  Séparation des espaces organisationnels
                </SecurityItem>
              </div>
            </div>

            <div className="card p-6 md:p-7">
              <div className="icon-box mb-5">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-[var(--ink)]">
                Accès aux données
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Les données de votre organisation sont destinées à rester
                accessibles uniquement selon les permissions définies pour
                votre espace.
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Architecture
                </div>

                <div className="mt-2 text-sm font-semibold text-[var(--ink)]">
                  Authentification · rôles · RLS
                </div>

                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  Les règles d'accès sont appliquées au niveau de
                  l'infrastructure de données.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================
            INFORMATION
        ============================================================ */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

            <div>
              <div className="text-sm font-semibold text-blue-950">
                Paramètres de compte
              </div>

              <p className="mt-1 text-sm leading-6 text-blue-950/70">
                Cette interface constitue le point d'intégration des
                préférences utilisateur. Les réglages seront progressivement
                reliés aux services d'authentification, de notifications et
                aux paramètres du compte.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ================================================================
   SETTING ROW
================================================================ */

function SettingRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 md:p-6"
    >
      <div className="icon-box shrink-0">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </button>
  );
}

/* ================================================================
   SECURITY ITEM
================================================================ */

function SecurityItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      <span>{children}</span>
    </div>
  );
}