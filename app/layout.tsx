import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

/* ============================================================
   GULGO — IDENTITÉ ÉDITORIALE & SEO
   ============================================================ */

const siteName = "GULGO";

const siteTitle =
  "GULGO — Donner de la crédibilité aux données de votre entreprise";

const siteDescription =
  "GULGO transforme les données d'entreprise en information structurée, vérifiable et exploitable. Collecte, contrôle, analyse et restitution au sein d'un environnement professionnel.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gulgo.com";


/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  applicationName: siteName,

  generator: "Next.js",

  keywords: [
    "GULGO",
    "Score Pass",
    "crédibilité économique",
    "données d'entreprise",
    "évaluation d'entreprise",
    "fiabilisation des données",
    "vérification des données",
    "analyse de données",
    "valorisation des données",
    "PME",
    "entreprises",
  ],

  authors: [
    {
      name: "GULGO",
      url: siteUrl,
    },
  ],

  creator: "GULGO",
  publisher: "GULGO",

  category: "business",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* ==========================================================
     OPEN GRAPH
     ========================================================== */

  openGraph: {
    type: "website",

    locale: "fr_FR",

    url: siteUrl,

    siteName,

    title: siteTitle,

    description:
      "Une plateforme professionnelle pour structurer, vérifier et valoriser les données d'entreprise.",

    images: [
      {
        url: "/branding/gulgo-logo.png",

        width: 1200,
        height: 630,

        alt:
          "GULGO — Donner de la crédibilité aux données de votre entreprise",

        type: "image/png",
      },
    ],
  },

  /* ==========================================================
     TWITTER / X
     ========================================================== */

  twitter: {
    card: "summary_large_image",

    title: siteTitle,

    description:
      "Collecter, vérifier, structurer et valoriser les données de votre entreprise.",

    images: ["/branding/gulgo-logo.png"],
  },

  /* ==========================================================
     ICÔNES
     ========================================================== */

  icons: {
    icon: [
      {
        url: "/branding/gulgo-logo.png",
        type: "image/png",
      },
    ],

    shortcut: [
      {
        url: "/branding/gulgo-logo.png",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/branding/gulgo-logo.png",
      },
    ],
  },
};


/* ============================================================
   VIEWPORT
   ============================================================ */

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  maximumScale: 5,

  colorScheme: "light",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#081b33",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#081b33",
    },
  ],
};


/* ============================================================
   ROOT LAYOUT
   ============================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
            }),
          }}
        />
      </body>
    </html>
  );
}