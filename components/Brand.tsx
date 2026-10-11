"use client";
import Link from "next/link";
export function Brand({compact=false, logoUrl, organizationName}: {compact?:boolean; logoUrl?:string|null; organizationName?:string|null}) {
  return <Link href="/client" className={`gulgo-brand ${compact?'gulgo-brand-compact':''}`} aria-label="gulgo — Espace entreprise">
    <span className="gulgo-brand-mark">{logoUrl ? <img src={logoUrl} alt="Logo de l’entreprise" /> : <span>T</span>}</span>
    <span className="gulgo-brand-copy"><strong>{organizationName || "Votre entreprise"}</strong><small>{organizationName ? "Espace entreprise" : "Enterprise Workspace"}</small></span>
  </Link>
}
