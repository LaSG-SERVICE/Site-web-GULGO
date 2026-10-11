import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="state-page">
      <div className="state-card">
        <div className="state-icon"><Compass size={22} /></div>
        <span className="pro-kicker">GULGO / 404</span>
        <h1>Cette page n’existe pas.</h1>
        <p>Le lien demandé est introuvable ou a été déplacé. Utilisez la navigation pour poursuivre votre parcours.</p>
        <Link className="pro-orange-btn" href="/"><ArrowLeft size={16} /> Retour à l’accueil</Link>
      </div>
    </main>
  );
}
