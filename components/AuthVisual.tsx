import { BarChart3, CheckCircle2, FileCheck2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { GulgoLogo } from "@/components/GulgoLogo";

export function AuthVisual({ mode }: { mode: "login" | "register" }) {
  return <section className="auth-visual">
    <div className="auth-grid"/><div className="auth-glow auth-glow-a"/><div className="auth-glow auth-glow-b"/>
    <div className="auth-content"><GulgoLogo light/>
      <div className="auth-copy"><span className="auth-kicker"><Sparkles size={13}/> PLATEFORME gulgo</span><h1>{mode === "login" ? "Votre confiance, vos données, votre espace." : "Construisez votre crédibilité économique."}</h1><p>{mode === "login" ? "Retrouvez vos évaluations, vos preuves et votre Score Pass dans un espace conçu pour décider plus sereinement." : "Centralisez vos informations, associez vos preuves et préparez votre Score Pass dans un parcours clair."}</p></div>
      <div className="auth-product-card"><div className="auth-card-top"><span><i/> Évaluation active</span><b>Score Pass V1</b></div><div className="auth-score-row"><div className="auth-ring"><strong>78</strong><small>/100</small></div><div className="auth-bars"><div><span>Identité</span><b style={{width:"92%"}}/></div><div><span>Activité</span><b style={{width:"78%"}}/></div><div><span>Finance</span><b style={{width:"71%"}}/></div><div><span>Gouvernance</span><b style={{width:"84%"}}/></div></div></div><div className="auth-card-foot"><span><CheckCircle2 size={14}/> 31 preuves vérifiées</span><span><ShieldCheck size={14}/> Traçabilité active</span></div></div>
      <div className="auth-mini auth-mini-a"><FileCheck2 size={17}/><span><b>Preuve vérifiée</b><small>Document associé</small></span></div><div className="auth-mini auth-mini-b"><TrendingUp size={17}/><span><b>+18 points</b><small>depuis la dernière revue</small></span></div>
      <div className="auth-trust"><span><BarChart3 size={15}/> Données structurées</span><span><ShieldCheck size={15}/> Environnement sécurisé</span></div>
    </div>
  </section>;
}
