import type { ReactNode } from "react";
import { BarChart3, Bell, Building2, FileText, LockKeyhole, MessageSquare, Settings2, Users, ClipboardCheck, CheckCircle2, ArrowUpRight } from "lucide-react";

type Variant = "company"|"evaluations"|"documents"|"requests"|"members"|"notifications"|"score"|"settings";

const icons: Record<Variant, ReactNode> = {
  company: <Building2 size={18} />, evaluations: <ClipboardCheck size={18} />, documents: <FileText size={18} />, requests: <MessageSquare size={18} />, members: <Users size={18} />, notifications: <Bell size={18} />, score: <BarChart3 size={18} />, settings: <Settings2 size={18} />,
};
const titles: Record<Variant,string> = {company:"Profil entreprise",evaluations:"Évaluation",documents:"Documents",requests:"Demandes",members:"Organisation",notifications:"Activité",score:"Score Pass",settings:"Configuration"};

export function EnterpriseIllustration({variant}:{variant:Variant}){
  return <div className={`gulgo-illustration gulgo-illustration-${variant}`} aria-hidden="true">
    <div className="gulgo-illustration-orbit orbit-one"/><div className="gulgo-illustration-orbit orbit-two"/>
    <div className="gulgo-illustration-frame">
      <div className="gulgo-illustration-toolbar"><div className="gulgo-window-dots"><i/><i/><i/></div><span className="gulgo-toolbar-title">gulgo <em>/</em> ESPACE ENTREPRISE</span><span className="gulgo-toolbar-secure"><LockKeyhole size={9}/> SECURE</span></div>
      <div className="gulgo-illustration-body">
        <div className="gulgo-illustration-sidebar"><b/><i/><i/><i/><i/><i/><span/></div>
        <div className="gulgo-illustration-canvas">
          <div className="gulgo-illustration-title"><span className="gulgo-illustration-icon">{icons[variant]}</span><div><b>{titles[variant]}</b><small>ESPACE ENTREPRISE · gulgo</small></div><ArrowUpRight className="gulgo-mini-arrow" size={12}/></div>
          <div className="gulgo-illustration-widgets"><span><b>17%</b><small>COMPLÉTUDE</small></span><span><b>01</b><small>DOSSIER</small></span><span><b>ACTIF</b><small>STATUT</small></span></div>
          <div className="gulgo-illustration-detail"><div className="gulgo-illustration-chart"><i/><i/><i/><i/><i/><i/></div><div className="gulgo-illustration-lines"><span/><span/><span/><span/></div><div className="gulgo-illustration-check"><CheckCircle2 size={12}/><small>ESPACE CONTRÔLÉ</small></div></div>
        </div>
      </div>
      <div className="gulgo-illustration-status"><LockKeyhole size={10}/><span>ENVIRONNEMENT SÉCURISÉ</span><b/><small>24/7</small></div>
    </div>
  </div>
}
