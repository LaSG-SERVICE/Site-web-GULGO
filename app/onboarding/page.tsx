
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/Brand";
import { LogoUploader } from "@/components/LogoUploader";

export default function Onboarding() {
  const [company, setCompany] = useState("");
  const [orgId, setOrgId] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const {
        data: { user },
      } = await sb.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: membership } = await sb
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (membership?.organization_id) {
        router.push("/client");
        return;
      }

      setCompany(
        (user.user_metadata?.company_name as string) || ""
      );
    })();
  }, [router]);

  async function createOrg(e: React.FormEvent) {
    e.preventDefault();

    if (!company.trim()) {
      setError("Veuillez renseigner le nom de votre entreprise.");
      return;
    }

    setBusy(true);
    setError("");

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
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7fb] flex flex-col">

      {/* Background décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      {/* En-tête */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Brand />

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Espace entreprise
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-12">

        <div className="w-full max-w-2xl">

          {/* Introduction */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 text-white shadow-lg shadow-blue-950/15">
              {done ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7"
                >
                  <path d="M5 12l4 4L19 6" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                >
                  <path d="M12 3v18M3 12h18" />
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              )}
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              GULGO · Enterprise Workspace
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {done
                ? "Votre organisation est créée !"
                : "Bienvenue dans votre espace entreprise"}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
              {done
                ? "Votre espace professionnel est prêt. Personnalisez maintenant son identité visuelle."
                : "Quelques informations suffisent pour configurer votre environnement professionnel et commencer à utiliser GULGO."}
            </p>
          </div>

          {/* Carte principale */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_-25px_rgba(15,23,42,0.18)]">

            {/* Progression */}
            <div className="grid grid-cols-2 border-b border-slate-100">

              <div className={`px-6 py-5 ${
                !done ? "border-b-[3px] border-blue-900 bg-blue-50/40" : "bg-white"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-950 text-white"
                  }`}>
                    {done ? "✓" : "01"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Organisation
                    </p>
                    <p className="text-xs text-slate-400">
                      Informations générales
                    </p>
                  </div>
                </div>
              </div>

              <div className={`px-6 py-5 ${
                done ? "border-b-[3px] border-blue-900 bg-blue-50/40" : "bg-white"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-blue-950 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    02
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Identité visuelle
                    </p>
                    <p className="text-xs text-slate-400">
                      Logo de votre entreprise
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 sm:p-10">

              {!done ? (

                <form onSubmit={createOrg} className="space-y-7">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Informations de votre entreprise
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Indiquez le nom officiel ou commercial de votre organisation.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Nom de l'entreprise
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/10"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Vous pourrez retrouver cet espace dans votre tableau de bord.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <span className="font-bold">!</span>
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy || !company.trim()}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-950 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Création de votre espace...
                      </>
                    ) : (
                      <>
                        Créer mon espace entreprise
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    En créant votre organisation, vous accédez à votre environnement professionnel GULGO.
                  </p>

                </form>

              ) : (

                <div className="space-y-7">

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                        ✓
                      </span>
                      <div>
                        <h2 className="font-bold text-emerald-900">
                          Organisation créée avec succès
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                          Votre espace {company} est maintenant configuré. Vous pouvez ajouter votre logo pour personnaliser votre environnement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Personnalisez votre identité visuelle
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Ajoutez le logo de votre entreprise pour renforcer son identité sur GULGO.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:p-7">
                    <LogoUploader organizationId={orgId} />
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/client")}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-950 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900"
                  >
                    Accéder à mon espace entreprise
                    <span className="text-lg">→</span>
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Vous pourrez également personnaliser votre espace ultérieurement.
                  </p>

                </div>
              )}

            </div>
          </div>

          {/* Pied de page */}
          <footer className="mt-7 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} GULGO · Votre environnement professionnel en toute confiance.
            </p>
          </footer>

        </div>
      </section>
    </main>
  );
}
