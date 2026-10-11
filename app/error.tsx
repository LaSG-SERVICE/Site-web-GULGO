"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="state-page">
      <div className="state-card">
        <div className="state-icon"><AlertTriangle size={22} /></div>
        <span className="pro-kicker">GULGO / ERREUR</span>
        <h1>Une erreur est survenue.</h1>
        <p>Le service n’a pas pu afficher cette page correctement. Vous pouvez réessayer ou revenir à l’accueil.</p>
        <div className="state-actions">
          <button className="pro-orange-btn" onClick={() => reset()}><RefreshCw size={16} /> Réessayer</button>
          <Link className="pro-outline-btn" href="/"><ArrowLeft size={16} /> Accueil</Link>
        </div>
      </div>
    </main>
  );
}
