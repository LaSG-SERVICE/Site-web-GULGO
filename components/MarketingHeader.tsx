"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Search } from "lucide-react";
import { GulgoLogo } from "@/components/GulgoLogo";

const links = [
  ["Solutions", "/solutions"],
  ["Score Pass", "/score-pass"],
  ["Méthode", "/methode"],
  ["Entreprises", "/entreprises"],
  ["À propos", "/a-propos"],
  ["Actualités", "/actualites"],
] as const;

export function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="pro-header">
      <div className="pro-container pro-header-inner">
        <GulgoLogo />
        <nav className="pro-nav" aria-label="Navigation principale">
          {links.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="pro-header-actions">
          <Link href="/actualites" className="pro-icon-button" aria-label="Consulter les actualités Gulgo">
            <Search size={18} aria-hidden="true" />
          </Link>
          <Link href="/login" className="pro-outline-btn">Se connecter</Link>
          <Link href="/register" className="pro-orange-btn">Créer mon espace <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <details className="pro-mobile-nav">
          <summary aria-label="Ouvrir le menu"><Menu size={22} aria-hidden="true" /></summary>
          <div className="pro-mobile-panel">
            <div className="pro-mobile-top"><GulgoLogo compact /><span>Navigation</span></div>
            {links.map(([label, href]) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
            ))}
            <Link href="/login" className="pro-outline-btn">Se connecter</Link>
            <Link href="/register" className="pro-orange-btn">Créer mon espace <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </details>
      </div>
    </header>
  );
}
