"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Building2, ClipboardList, FileText, MessageSquare, Users, LogOut, Settings, Bell, BarChart3, Menu, X, ExternalLink, UserRound, ChevronRight, ShieldCheck, Sparkles, CircleCheck } from "lucide-react";
import { Brand } from "@/components/Brand";
import { createClient } from "@/lib/supabase/client";

const mainItems = [
  ["/client", "Tableau de bord", LayoutDashboard],
  ["/client/company", "Mon entreprise", Building2],
  ["/client/evaluations", "Évaluations", ClipboardList],
  ["/client/documents", "Documents", FileText],
  ["/client/requests", "Demandes gulgo", MessageSquare],
  ["/client/members", "Membres", Users],
  ["/client/notifications", "Notifications", Bell],
] as const;
const secondaryItems = [
  ["/client/score-pass", "Score Pass", BarChart3],
  ["/client/settings", "Paramètres", Settings],
  ["/client/logout", "Déconnexion", LogOut],
] as const;

type Props={children:ReactNode};
export function ClientShell({children}:Props){
 const path=usePathname(); const router=useRouter(); const [mobileOpen,setMobileOpen]=useState(false); const [loggingOut,setLoggingOut]=useState(false); const [orgName,setOrgName]=useState("Votre entreprise"); const [logoUrl,setLogoUrl]=useState<string|null>(null);
 useEffect(()=>{let mounted=true; const load=async()=>{try{const sb=createClient(); const {data:{user}}=await sb.auth.getUser(); if(!user)return; const {data:m}=await sb.from("organization_members").select("organization_id").eq("user_id",user.id).limit(1).maybeSingle(); if(!m?.organization_id)return; const {data:o}=await sb.from("organizations").select("name,logo_url").eq("id",m.organization_id).maybeSingle(); if(mounted){setOrgName(o?.name||"Votre entreprise"); setLogoUrl(o?.logo_url||localStorage.getItem(`gulgo-logo-${m.organization_id}`));}}catch{}}; load(); const h=(e:any)=>setLogoUrl(e.detail?.url||null); window.addEventListener("gulgo-logo-updated",h); return()=>{mounted=false;window.removeEventListener("gulgo-logo-updated",h)}},[]);
 const pageMeta = path === "/client" ? ["Tableau de bord", "Vue d’ensemble de votre activité GULGO"]
   : path.startsWith("/client/company") ? ["Mon entreprise", "Profil, informations et complétude du dossier"]
   : path.startsWith("/client/evaluations") ? ["Évaluations", "Pilotage et suivi de vos dossiers Score Pass"]
   : path.startsWith("/client/documents") ? ["Documents", "Bibliothèque documentaire sécurisée"]
   : path.startsWith("/client/requests") ? ["Demandes GULGO", "Suivi des demandes et actions en cours"]
   : path.startsWith("/client/members") ? ["Membres", "Gestion des utilisateurs de l’espace entreprise"]
   : path.startsWith("/client/notifications") ? ["Notifications", "Centre d’activité et informations gulgo"]
   : path.startsWith("/client/score-pass") ? ["Score Pass", "Évaluation et suivi de votre performance"]
   : path.startsWith("/client/settings") ? ["Paramètres", "Configuration du compte et sécurité"]
   : path.startsWith("/client/logout") ? ["Déconnexion", "Sortie sécurisée de l’espace entreprise"]
   : ["Espace entreprise", "Gestion de votre dossier GULGO"];
 async function out(){if(loggingOut)return;setLoggingOut(true);try{await createClient().auth.signOut();router.push("/");router.refresh();}finally{setLoggingOut(false)}}
 return <div className="gulgo-client-shell min-h-screen">
   <header className="gulgo-mobile-header md:hidden"><Brand compact logoUrl={logoUrl} organizationName={orgName}/><button className="gulgo-icon-button" onClick={()=>setMobileOpen(v=>!v)} aria-label="Menu">{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button></header>
   {mobileOpen&&<div className="gulgo-mobile-overlay"><button className="gulgo-mobile-backdrop" onClick={()=>setMobileOpen(false)} aria-label="Fermer"/><aside className="gulgo-mobile-drawer"><ClientNavigation path={path} onNavigate={()=>setMobileOpen(false)}/></aside></div>}
   <div className="gulgo-client-frame">
    <aside className="gulgo-client-sidebar hidden md:flex">
      <div className="gulgo-client-brand"><Brand compact logoUrl={logoUrl} organizationName={orgName}/><span className="gulgo-brand-caption">PORTAIL ENTREPRISE</span></div>
      <div className="gulgo-client-identity"><div className="gulgo-sidebar-company-logo">{logoUrl ? <img src={logoUrl} alt="Logo de l’entreprise" /> : <span>{(orgName||"T").trim().charAt(0).toUpperCase()}</span>}</div><div className="gulgo-sidebar-company-copy"><strong>{orgName}</strong><span>Compte entreprise</span></div><span className="gulgo-identity-status"><CircleCheck size={13}/> Actif</span></div>
      <nav className="gulgo-client-nav"><div className="gulgo-nav-label">Mon espace</div><ClientNavigation path={path} onlyMain/><div className="gulgo-nav-label gulgo-nav-label-secondary">Suivi & compte</div><ClientNavigation path={path} onlySecondary/></nav>
      <div className="gulgo-client-sidebar-bottom"><div className="gulgo-security"><div className="gulgo-security-icon"><ShieldCheck size={16}/></div><div><strong>Environnement contrôlé</strong><span>Données et documents protégés dans votre espace entreprise.</span></div></div><button className="gulgo-logout" onClick={out} disabled={loggingOut}><LogOut size={17}/>{loggingOut?"Déconnexion…":"Déconnexion"}</button></div>
    </aside>
    <main className="gulgo-client-main">
      <header className="gulgo-client-topbar"><div className="gulgo-top-context"><div className="gulgo-breadcrumb"><span>PORTAIL GULGO</span><ChevronRight size={12}/><span>ESPACE ENTREPRISE</span></div><strong>{pageMeta[0]}</strong><span className="gulgo-top-subtitle">{pageMeta[1]}</span></div><div className="gulgo-top-actions"><div className="gulgo-live-status"><CircleCheck size={14}/><span>Espace sécurisé</span></div><Link href="/" className="gulgo-site-link"><ExternalLink size={15}/>Voir le site</Link><Link href="/client/notifications" className="gulgo-notification"><Bell size={18}/><span/></Link><div className="gulgo-top-profile gulgo-enterprise-profile"><div className="gulgo-enterprise-logo">{logoUrl ? <img src={logoUrl} alt="Logo de l’entreprise" /> : <span>{(orgName||"E").trim().charAt(0).toUpperCase()}</span>}</div><div className="gulgo-enterprise-profile-copy"><strong>{orgName}</strong><span>Compte entreprise · Espace sécurisé</span></div></div></div></header>
      <div className="gulgo-client-content">{children}</div>
    </main>
   </div>
 </div>
}
function ClientNavigation({path,onlyMain=false,onlySecondary=false,onNavigate}:{path:string;onlyMain?:boolean;onlySecondary?:boolean;onNavigate?:()=>void}){
 const items=onlySecondary?secondaryItems:onlyMain?mainItems:[...mainItems,...secondaryItems];
 return <div className="gulgo-nav-list">{items.map(([href,label,Icon])=>{const active=href==="/client"?path==="/client":path.startsWith(href);return <Link key={href} href={href} onClick={onNavigate} className={`gulgo-client-nav-link ${active?"is-active":""}`}><span className="gulgo-nav-icon"><Icon size={17}/></span><span>{label}</span>{active&&<ChevronRight className="gulgo-nav-arrow" size={15}/>}</Link>})}</div>
}
