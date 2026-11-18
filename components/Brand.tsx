"use client";

import Image from "next/image";
import Link from "next/link";

export function Brand({
  compact = false,
  logoUrl,
  organizationName,
}: {
  compact?: boolean;
  logoUrl?: string | null;
  organizationName?: string | null;
}) {
  return (
    <Link
      href="/client"
      className={`gulgo-brand ${compact ? "gulgo-brand-compact" : ""}`}
      aria-label="gulgo — Espace entreprise"
    >
      <span className="gulgo-brand-mark">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Logo de l’entreprise"
            width={64}
            height={64}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span>T</span>
        )}
      </span>

      <span className="gulgo-brand-copy">
        <strong>{organizationName || "Votre entreprise"}</strong>
        <small>
          {organizationName
            ? "Espace entreprise"
            : "Enterprise Workspace"}
        </small>
      </span>
    </Link>
  );
}
