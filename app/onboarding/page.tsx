
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoUploader } from "@/components/LogoUploader";

export default function Onboarding() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [orgId, setOrgId] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const sb = createClient();
        const {
          data: { user },
          error: authError,
        } = await sb.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data: membership, error: membershipError } = await sb
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (!active) return;

        if (membershipError) {
          setError("Impossible de vérifier votre espace entreprise. Veuillez réessayer.");
          setChecking(false);
          return;
        }

        if (membership?.organization_id) {
          router.replace("/client");
          return;
        }

        setCompany(user.user_metadata?.company_name || "");
        setChecking(false);
      } catch {
        if (active) {
          setError("Une erreur est survenue lors de la préparation de votre espace.");
          setChecking(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [router]);

  async function createOrg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!company.trim() || busy) return;

    setBusy(true);
    setError("");

    try {
      const sb = createClient();

      const {
        data: { user },
      } = await sb.auth.getUser();

      if (!user) {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
        return;
      }

      const { data: organizationId, error: rpcError } = await sb.rpc(
        "create_organization_with_admin",
        {
          org_name: company.trim(),
        }
      );

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      if (!organizationId) {
        setError("La création de votre organisation n'a pas abouti.");
        return;
      }

      setOrgId(organizationId as string);
      setDone(true);
    } catch {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setBusy(false);
    }
  }

  // Identité graphique GULGO
  const Logo = ({ large = false }: { large?: boolean }) => (
    <div className="flex items-center gap-3">
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#12304A] text-white shadow-lg shadow-[#12304A]/15 ${
          large ? "h-14 w-14" : "h-11 w-11"
        }`}
      >
        <span className={`font-black tracking-tighter ${large ? "text-4xl" : "text-3xl"}`}>
          G
        </span>
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-tl-md bg-[#D6A36A]" />
      </div>

      <div>
        <p className={`font-extrabold tracking-[0.12em] text-[#12304A] ${large ? "text-xl" : "text-lg"}`}>
          GULGO
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-slate-400">
          Enterprise Workspace
        </p>
      </div>
    </div>
  );

  // Icônes
  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Chargement
  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7F9] px-5">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12304A] text-white shadow-xl">
            <span className="text-5xl font-black">G</span>
          </div>

          <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#12304A]" />

          <p className="text-sm font-semibold text-[#12304A]">
            Préparation de votre espace
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Nous configurons votre environnement professionnel.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7F9] text-[#182C3E]">

      {/* HEADER */}
      <header className="relative z-20 border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-14">

          <Logo />

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Environnement sécurisé
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xs font-semibold text-slate-500 transition hover:text-[#12304A]"
          >
            Déjà inscrit ? Connexion
          </button>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-14 lg:py-12">

        {/* INTRODUCTION */}
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-[2px] w-8 bg-[#C69B69]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#98744E]">
                Configuration de votre organisation
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#12304A] sm:text-4xl lg:text-[46px]">
              {done
                ? "Votre espace prend forme."
                : "Construisez votre espace professionnel."}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              {done
                ? "Votre organisation est créée. Finalisez maintenant son identité visuelle pour personnaliser votre environnement."
                : "Bienvenue sur GULGO. Configurez votre organisation et créez un environnement professionnel adapté à votre activité."}
            </p>
          </div>

          <div className="hidden shrink-0 pb-2 text-right lg:block">
            <p className="text-xs font-semibold text-slate-400">
              VOTRE ESPACE
            </p>
            <p className="mt-1 text-sm font-bold text-[#12304A]">
              Enterprise Workspace
            </p>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_65px_-30px_rgba(18,48,74,0.22)] lg:grid-cols-[0.82fr_1.18fr]">

          {/* LEFT BRAND PANEL */}
          <aside className="relative flex min-h-[570px] flex-col overflow-hidden bg-[#12304A] p-8 text-white sm:p-11 lg:p-12">

            {/* Décoration */}
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#315773]/25 blur-3xl" />

            <div className="relative z-10">
              <Logo large />

              <div className="mt-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6AD7B]">
                  UNE NOUVELLE EXPÉRIENCE
                </p>

                <h2 className="max-w-md text-3xl font-bold leading-[1.2] tracking-tight sm:text-[38px]">
                  Votre activité.
                  <br />
                  Votre identité.
                  <br />
                  <span className="text-[#D6AD7B]">
                    Votre espace.
                  </span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                  GULGO vous accompagne dans la mise en place d'un environnement
                  professionnel dédié à votre organisation, avec une identité
                  qui vous appartient.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-auto space-y-6 pt-16">

              {[
                {
                  title: "Un espace à votre image",
                  description: "Personnalisez votre environnement professionnel.",
                },
                {
                  title: "Une organisation structurée",
                  description: "Centralisez votre présence dans un espace dédié.",
                },
                {
                  title: "Une expérience simplifiée",
                  description: "Retrouvez vos fonctionnalités au même endroit.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-[#D6AD7B]">
                    <CheckIcon />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div className="pointer-events-none absolute -bottom-20 -right-8 select-none text-[260px] font-black leading-none text-white/[0.025]">
              G
            </div>
          </aside>

          {/* RIGHT FORM PANEL */}
          <section className="flex min-w-0 flex-col bg-white">

            {/* STEPPER */}
            <div className="border-b border-slate-100 px-7 py-7 sm:px-10 lg:px-12">
              <div className="flex items-center">

                <div className="flex flex-1 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#12304A] text-white"
                  }`}>
                    {done ? <CheckIcon /> : "01"}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#12304A]">
                      Organisation
                    </p>
                    <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">
                      Informations générales
                    </p>
                  </div>
                </div>

                <div className="mx-3 h-px flex-1 bg-slate-200 sm:mx-5" />

                <div className="flex flex-1 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-[#12304A] text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    02
                  </div>

                  <div>
                    <p className={`text-xs font-bold ${done ? "text-[#12304A]" : "text-slate-400"}`}>
                      Personnalisation
                    </p>
                    <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">
                      Identité visuelle
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* FORM */}
            <div className="flex flex-1 flex-col justify-center px-7 py-9 sm:px-10 lg:px-14 lg:py-12">

              {!done ? (

                <form onSubmit={createOrg} className="mx-auto w-full max-w-xl space-y-8">

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B18A5B]">
                      ÉTAPE 01 — INFORMATIONS
                    </span>

                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#12304A] sm:text-[30px]">
                      Présentons votre organisation.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Pour commencer, renseignez le nom de votre entreprise.
                      Cette information permettra d'identifier votre espace sur GULGO.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="company"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                    >
                      Dénomination de l'entreprise
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                          <rect x="3" y="7" width="18" height="14" rx="2" />
                          <path d="M8 7V4h8v3M8 12h2m4 0h2M8 16h2m4 0h2" strokeLinecap="round" />
                        </svg>
                      </div>

                      <input
                        id="company"
                        type="text"
                        required
                        maxLength={120}
                        autoComplete="organization"
                        placeholder="Ex. : La SG-SERVICE"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="h-[58px] w-full rounded-xl border border-slate-200 bg-[#FAFBFC] pl-12 pr-4 text-sm font-medium text-[#12304A] outline-none transition duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-[#527B98] focus:bg-white focus:ring-4 focus:ring-[#12304A]/[0.06]"
                      />
                    </div>

                    <p className="text-[11px] leading-5 text-slate-400">
                      Vous pourrez modifier les informations complémentaires
                      de votre organisation depuis votre espace.
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                    >
                      <span className="font-bold">!</span>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-7">
                    <button
                      type="submit"
                      disabled={busy || !company.trim()}
                      className="group flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#12304A] px-6 text-sm font-bold text-white shadow-lg shadow-[#12304A]/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1C4565] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Création de votre organisation...
                        </>
                      ) : (
                        <>
                          Continuer la configuration
                          <span className="transition-transform group-hover:translate-x-1">
                            <ArrowIcon />
                          </span>
                        </>
                      )}
                    </button>

                    <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
                        <rect x="5" y="10" width="14" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                      Configuration de votre espace sécurisé
                    </div>
                  </div>
                </form>

              ) : (

                <div className="mx-auto w-full max-w-xl space-y-8">

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckIcon />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-emerald-900">
                          Organisation créée avec succès
                        </h2>
                        <p className="mt-2 text-xs leading-6 text-emerald-800/80">
                          L'organisation <strong>{company}</strong> est
                          maintenant enregistrée sur GULGO.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B18A5B]">
                      ÉTAPE 02 — PERSONNALISATION
                    </span>

                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#12304A]">
                      Votre identité visuelle.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Ajoutez le logo de votre entreprise pour donner
                      à votre espace une identité reconnaissable.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-[#FAFBFC] p-5 sm:p-7">
                    <LogoUploader organizationId={orgId} />
                  </div>

                  {error && (
                    <p role="alert" className="text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => router.push("/client")}
                    className="group flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#12304A] px-6 text-sm font-bold text-white shadow-lg shadow-[#12304A]/10 transition hover:bg-[#1C4565]"
                  >
                    Accéder à mon espace entreprise
                    <span className="transition-transform group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Vous pourrez compléter ou modifier votre identité visuelle
                    à tout moment.
                  </p>

                </div>
              )}

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-[10px] text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} GULGO. Tous droits réservés.
          </p>
          <p className="font-medium tracking-wide">
            VOTRE ENVIRONNEMENT PROFESSIONNEL
          </p>
        </footer>

      </section>
    </main>
  );
}
