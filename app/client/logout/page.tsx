"use client";

import Link from "next/link";
import { CheckCircle2, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    if (loading) return;
    setLoading(true);
    try {
      await createClient().auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="gulgo-client-page gulgo-logout-page">
      <section className="gulgo-logout-shell">
        <div className="relative z-10">
          <div className="gulgo-logout-icon">
            <LogOut className="h-7 w-7" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#dbe7ef] bg-[#f6fafc] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#15558e]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sortie sécurisée
          </div>

          <h1>Déconnexion de votre espace entreprise</h1>
          <p>
            Vous êtes sur le point de quitter votre espace gulgo. Votre session
            sera fermée de manière sécurisée et vous pourrez vous reconnecter
            ultérieurement pour poursuivre la gestion de votre dossier.
          </p>

          <div className="gulgo-logout-actions">
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="gulgo-logout-primary"
            >
              <LogOut className="h-4 w-4" />
              {loading ? "Déconnexion…" : "Confirmer la déconnexion"}
            </button>

            <Link href="/client" className="gulgo-logout-secondary">
              Rester dans mon espace
            </Link>
          </div>

          <div className="gulgo-logout-meta">
            <CheckCircle2 className="h-4 w-4" />
            <span>Session et accès protégés par l’authentification gulgo.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
