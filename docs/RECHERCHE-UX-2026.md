# gulgo — recherche UX/UI et architecture 2026

Cette refonte s'appuie sur une comparaison de plusieurs références publiques récentes :

## Références consultées

- **TOUS STATISTICIEN** — référence éditoriale française retenue par le projet : structure institutionnelle, mise en avant des chiffres, services, expertise et actualités.
- **Vercel — Next.js SaaS Starter** — séparation nette entre site marketing et espace connecté, CTA visibles, dashboard, authentification et RBAC.
- **Vercel — Admin Dashboard** — usage de Next.js App Router, Tailwind, shadcn/ui, layouts d'administration et composants réutilisables.
- **Kiranism / next-shadcn-dashboard-starter** — approche production-oriented pour tableaux, filtres, recherche, pagination, formulaires, organisations et dashboard analytics.
- **shadcndashboard / next-shadcn-dashboard** — architecture de composants réutilisables, responsive, tableaux, graphiques et écrans d'authentification.
- **SaaS landing page open source avec Framer Motion** — inspiration pour les micro-interactions, les animations d'entrée et les transitions douces.

## Décisions prises pour gulgo

### 1. Positionnement visuel
gulgo doit se situer entre le site institutionnel et la plateforme SaaS B2B :

- bleu profond comme couleur de confiance ;
- orange comme couleur d'action et de signal ;
- beaucoup d'espace blanc ;
- chiffres clés visibles ;
- visuels data plutôt que décorations génériques ;
- cartes sobres avec une hiérarchie forte ;
- animations courtes et fonctionnelles.

### 2. Landing page
La page publique suit désormais une logique :

**Promesse → preuve visuelle → solutions → données en mouvement → Score Pass → parcours → sécurité → actualités → espace entreprise → CTA.**

### 3. Visualisation
Le nouveau bloc « La donnée en mouvement » ajoute :

- photographie data ;
- photographie de collaboration ;
- carte de KPI flottante ;
- mini-série de barres animées ;
- animation de flottement ;
- respect de `prefers-reduced-motion`.

Les visuels photographiques sont actuellement appelés depuis des URLs externes pour le prototype. Pour la production, les remplacer par des images dont gulgo possède les droits et les servir localement via `next/image`.

### 4. Dashboard
La direction recommandée pour les espaces client/admin est :

- sidebar compacte et persistante ;
- header contextuel ;
- KPI en première ligne ;
- graphiques ensuite ;
- tableaux filtrables ;
- statuts lisibles ;
- actions primaires limitées ;
- responsive mobile-first.

### 5. Architecture future
Pour les prochaines versions :

```text
app/
  (marketing)/
  (auth)/
  client/
  admin/
components/
  ui/
  data-viz/
  marketing/
  dashboard/
features/
  score-pass/
  evaluations/
  documents/
  enterprises/
lib/
  supabase/
  scorepass/
```

Cette évolution rapprochera gulgo des architectures feature-based utilisées par les starters SaaS modernes, sans réécrire inutilement le moteur métier existant.
