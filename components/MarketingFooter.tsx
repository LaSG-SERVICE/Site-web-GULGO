import Link from "next/link";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { GulgoLogo } from "@/components/GulgoLogo";

export function MarketingFooter() {
  return <footer className="pro-footer">
    <div className="pro-footer-cta"><div className="pro-container pro-footer-cta-inner">
      <div><span className="pro-kicker">LA CONFIANCE DEVIENT UN ACTIF.</span><h2>Transformez vos données en confiance.</h2><p>Une information mieux structurée, mieux documentée et plus lisible pour vos décisions.</p></div>
      <Link href="/register" className="pro-orange-btn">Créer mon espace <ArrowUpRight size={16}/></Link>
    </div></div>
    <div className="pro-container pro-footer-grid">
      <div className="pro-footer-brand"><GulgoLogo light/><p>GULGO est une plateforme de crédibilité économique qui transforme les données d’entreprise en informations structurées, vérifiables et exploitables.</p><div className="pro-social" aria-label="Contacts"><a href="mailto:contact@gulgo.com" aria-label="Contacter GULGO par email"><Mail size={15}/></a></div></div>
      <div><b>Navigation</b><Link href="/">Accueil</Link><Link href="/solutions">Solutions</Link><Link href="/score-pass">Score Pass</Link><Link href="/methode">Méthode</Link></div>
      <div><b>Entreprise</b><Link href="/entreprises">Entreprises</Link><Link href="/a-propos">À propos</Link><Link href="/actualites">Insights</Link><Link href="/login">Connexion</Link></div>
      <div><b>Ressources</b><Link href="/register">Créer un espace</Link><span>Documentation</span><span>Confidentialité</span><span>Conditions d’utilisation</span></div>
    </div>
    <div className="pro-footer-bottom"><div className="pro-container"><span>© {new Date().getFullYear()} GULGO. Tous droits réservés.</span><span>La donnée au service de la confiance.</span></div></div>
  </footer>;
}
