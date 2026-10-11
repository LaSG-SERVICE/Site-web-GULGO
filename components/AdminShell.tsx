"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  FileText,
  MessageSquare,
  ShieldAlert,
  Users,
  Settings,
  History,
  LogOut,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Brand } from "@/components/Brand";
import { createClient } from "@/lib/supabase/client";

const items = [
  ["/admin", "Vue d’ensemble", LayoutDashboard],
  ["/admin/enterprises", "Entreprises", Building2],
  ["/admin/evaluations", "Dossiers / évaluations", ClipboardList],
  ["/admin/documents", "Documents", FileText],
  ["/admin/requests", "Demandes", MessageSquare],
  ["/admin/anomalies", "Anomalies", ShieldAlert],
  ["/admin/score-pass", "Score Pass", BarChart3],
  ["/admin/users", "Utilisateurs", Users],
  ["/admin/audit", "Audit", History],
  ["/admin/settings", "Paramétrage", Settings],
] as const;

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const path = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function out() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await createClient().auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
        <Brand compact />

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={closeMobile}
            className="absolute inset-0 bg-slate-950/30"
          />

          <aside className="absolute left-0 top-16 bottom-0 w-[290px] overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-5 rounded-2xl bg-[var(--navy)] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    Back-office gulgo
                  </div>
                  <div className="mt-0.5 text-xs text-white/60">
                    Environnement interne
                  </div>
                </div>
              </div>
            </div>

            <AdminNavigation path={path} onNavigate={closeMobile} />

            <button
              type="button"
              onClick={out}
              disabled={loggingOut}
              className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Déconnexion..." : "Déconnexion"}
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* =======================================================
            DESKTOP SIDEBAR
        ======================================================= */}
        <aside className="sidebar sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
          {/* Brand */}
          <div className="flex h-[76px] items-center border-b border-slate-200 px-5">
            <Brand compact />
          </div>

          {/* Environment */}
          <div className="px-4 pt-5">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
                  <ShieldCheck size={18} />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-xs font-bold uppercase tracking-[0.08em] text-blue-900">
                    Back-office
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Environnement interne
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Navigation
            </div>

            <AdminNavigation path={path} />
          </div>

          {/* Bottom account area */}
          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-bold text-white">
                T
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">
                  gulgo Staff
                </div>

                <div className="truncate text-xs text-slate-500">
                  Administration
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={out}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Déconnexion..." : "Déconnexion"}
            </button>
          </div>
        </aside>

        {/* =======================================================
            MAIN AREA
        ======================================================= */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-30 hidden h-[76px] border-b border-slate-200 bg-white/90 backdrop-blur md:block">
            <div className="flex h-full items-center justify-between px-8">
              {/* Left */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Administration
                </div>

                <div className="mt-0.5 text-sm font-semibold text-slate-800">
                  Pilotage de la plateforme
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 lg:flex"
                  aria-label="Recherche"
                >
                  <Search size={18} />
                </button>

                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Notifications"
                >
                  <Bell size={18} />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                </button>

                <div className="h-7 w-px bg-slate-200" />

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-bold text-white">
                    T
                  </div>

                  <div className="hidden lg:block">
                    <div className="text-sm font-semibold text-slate-800">
                      gulgo Staff
                    </div>

                    <div className="text-xs text-slate-500">
                      Administration
                    </div>
                  </div>
                </div>

                <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 xl:inline-flex">
                  Staff
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===============================================================
   ADMIN NAVIGATION
================================================================ */

function AdminNavigation({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="grid gap-1">
      {items.map(([href, label, Icon]) => {
        const active =
          path === href ||
          (href !== "/admin" && path.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
              "text-sm font-medium transition-all duration-200",
              active
                ? "bg-[var(--navy)] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
          >
            {/* Active indicator */}
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-400" />
            )}

            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                active
                  ? "bg-white/10 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={1.9} />
            </span>

            <span className="min-w-0 flex-1 truncate">{label}</span>

            <ChevronRight
              size={15}
              className={[
                "shrink-0 transition-all",
                active
                  ? "translate-x-0 text-white/70"
                  : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              ].join(" ")}
            />
          </Link>
        );
      })}
    </nav>
  );
}