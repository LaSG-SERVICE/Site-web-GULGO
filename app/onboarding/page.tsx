
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
        } = await sb.auth.getUser();

        if (!active) return;

        if (!user) {
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
          setError("Impossible de vérifier votre organisation.");
          setChecking(false);
          return;
        }

        if (membership?.organization_id) {
          router.replace("/client");
          return;
        }

        setCompany(
          (user.user_metadata?.company_name as string) || ""
        );

        setChecking(false);
      } catch {
        if (active) {
          setError("Une erreur est survenue. Veuillez réessayer.");
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
        setBusy(false);
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
        setBusy(false);
        return;
      }

      if (!organizationId) {
        setError("La création de votre organisation a échoué.");
        setBusy(false);
        return;
      }

      setOrgId(organizationId as string);
      setDone(true);
      setBusy(false);
    } catch {
      setError("Une erreur inattendue est survenue.");
      setBusy(false);
    }
  }

  // Écran de chargement
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102b49] text-white shadow-xl">
            <span className="text-4xl font-black animate-pulse">G</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Préparation de votre espace...
          </p>
          <p className="mt-2 text-xs text-slate-400">
            GULGO · Votre environnement professionnel
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102b49] text-white shadow-sm">
              <span className="text-3xl font-black">G</span>
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#102b49]">
                GULGO
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Enterprise Workspace
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-600">
              Espace sécurisé
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-500 transition hover:text-[#102b49]"
          >
            Retour à la connexion
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">

        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#3273a8]">
            CONFIGURATION DE VOTRE ESPACE
          </p>

          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#102b49] sm:text-4xl lg:text-[42px]">
            Donnez vie à votre
            <span className="text-[#3273a8]"> espace entreprise.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Configurez votre organisation et personnalisez votre environnement
            professionnel pour commencer à profiter pleinement de GULGO.
          </p>
        </div>

        {/* TWO COLUMNS */}
        <div className="grid items-stretch gap-7 lg:grid-cols-[0.85fr_1.35fr]">

          {/* LEFT PANEL */}
          <aside className="relative flex min-h-[470px] flex-col overflow-hidden rounded-2xl bg-[#102b49] p-8 text-white sm:p-10">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />

            <div className="relative z-10">

              <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <span className="text-4xl font-black">G</span>
              </div>

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                BIENVENUE SUR GULGO
              </p>

              <h2 className="max-w-md text-3xl font-bold leading-tight">
                Votre entreprise mérite un espace à son image.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/75">
                Créez votre environnement professionnel, centralisez votre
                organisation et construisez une identité qui vous ressemble.
              </p>
            </div>

            <div className="relative z-10 mt-auto space-y-6 pt-12">

              {[
                {
                  number: "01",
                  title: "Un espace dédié",
                  description: "Un environnement propre à votre organisation.",
                },
                {
                  number: "02",
                  title: "Votre identité",
                  description: "Personnalisez votre espace avec votre logo.",
                },
                {
                  number: "03",
                  title: "Une gestion simplifiée",
                  description: "Retrouvez votre espace professionnel en un seul endroit.",
                },
              ].map((item) => (
                <div key={item.number} className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xs font-bold text-blue-100">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-blue-100/65">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div className="pointer-events-none absolute -bottom-24 -right-16 text-[260px] font-black leading-none text-white/[0.035]">
              G
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_-20px_rgba(15,23,42,0.16)]">

            {/* STEPS */}
            <div className="grid grid-cols-2 border-b border-slate-100">

              <div className={`border-b-2 p-5 sm:p-7 ${
                !done ? "border-[#3273a8] bg-blue-50/30" : "border-emerald-500"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#102b49] text-white"
                  }`}>
                    {done ? "✓" : "01"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Organisation
                    </p>
                    <p className="hidden text-xs text-slate-400 sm:block">
                      Création de votre espace
                    </p>
                  </div>
                </div>
              </div>

              <div className={`border-b-2 p-5 sm:p-7 ${
                done ? "border-[#3273a8] bg-blue-50/30" : "border-transparent"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-[#102b49] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    02
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Personnalisation
                    </p>
                    <p className="hidden text-xs text-slate-400 sm:block">
                      Votre identité visuelle
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* FORM CONTENT */}
            <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">

              {!done ? (

                <form onSubmit={createOrg} className="w-full space-y-8">

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#3273a8]">
                      ÉTAPE 01 / 02
                    </span>

                    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#102b49]">
                      Création de votre organisation
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Commençons par identifier votre entreprise.
                      Vous pourrez personnaliser les autres informations
                      depuis votre espace.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-3 block text-sm font-bold text-slate-700"
                    >
                      Nom de votre entreprise
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="company"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="organization"
                      placeholder="Ex. : La SG-SERVICE"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-14 w-full rounded-xl border border-slate-200 bg-[#fafbfd] px-5 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3273a8] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <p className="mt-3 text-xs text-slate-400">
                      Le nom de votre organisation sera utilisé dans votre espace professionnel.
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-7">

                    <button
                      type="submit"
                      disabled={busy || !company.trim()}
                      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#102b49] px-6 text-sm font-bold text-white transition hover:bg-[#193e63] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          Créer mon espace entreprise
                          <span className="text-lg">→</span>
                        </>
                      )}
                    </button>

                    <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                      La création de votre espace vous permettra
                      d'accéder à votre environnement GULGO.
                    </p>

                  </div>
                </form>

              ) : (

                <div className="space-y-8">

                  <div className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                      ✓
                    </span>

                    <div>
                      <h2 className="font-bold text-emerald-900">
                        Votre organisation est créée !
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-emerald-800/80">
                        {company} dispose maintenant de son propre espace
                        sur GULGO. Vous pouvez passer à la personnalisation.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#3273a8]">
                      ÉTAPE 02 / 02
                    </span>

                    <h2 className="mt-3 text-2xl font-extrabold text-[#102b49]">
                      Votre identité visuelle
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Ajoutez le logo de votre organisation pour
                      personnaliser votre espace professionnel.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-[#fafbfd] p-5 sm:p-7">
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
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#102b49] px-6 text-sm font-bold text-white transition hover:bg-[#193e63]"
                  >
                    Accéder à mon espace
                    <span className="text-lg">→</span>
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Vous pourrez compléter votre identité visuelle ultérieurement.
                  </p>

                </div>
              )}

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-7 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} GULGO. Tous droits réservés.
          </p>
          <p>
            Votre espace professionnel, en toute confiance.
          </p>
        </footer>

      </section>
    </main>
  );
}
