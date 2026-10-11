# gulgo — audit UX/UI, architecture et sécurité — 2026

## Périmètre
Refonte professionnelle du dépôt gulgo fourni dans `dev1-gulgo.rar`.

## Références publiques consultées
La refonte a été confrontée aux patterns actuels de plusieurs projets open source et documentations :
- Next.js SaaS Starter — https://github.com/nextjs/saas-starter
- shadcn/ui — https://github.com/shadcn-ui/ui
- Kiranism / next-shadcn-dashboard-starter — https://github.com/Kiranism/next-shadcn-dashboard-starter
- shadcndashboard / next-shadcn-dashboard — https://github.com/shadcndashboard/next-shadcn-dashboard
- Next.js metadata — https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Supabase + Next.js — https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

Cette liste constitue un benchmark ciblé de références pertinentes et maintenues ; il n'est pas techniquement possible de consulter « tous les GitHub et tous les sites existants ».

## Principales améliorations appliquées

### 1. Expérience utilisateur
- header marketing rendu plus premium et plus lisible ;
- header sticky avec effet de verre discret ;
- focus states renforcés ;
- lien « Aller au contenu principal » pour l'accessibilité clavier ;
- meilleure hiérarchie visuelle et profondeur des cartes ;
- respect global de `prefers-reduced-motion` ;
- bouton de recherche transformé en accès fonctionnel vers les insights au lieu d'un bouton sans action.

### 2. SEO / partage
- `NEXT_PUBLIC_SITE_URL` utilisé comme source configurable de l'URL canonique ;
- JSON-LD Organisation ;
- sitemap XML via `app/sitemap.ts` ;
- robots via `app/robots.ts` ;
- routes privées `/admin/` et `/client/` exclues du crawl.

### 3. Sécurité Supabase
Le dépôt permettait auparavant à un utilisateur authentifié de s'insérer lui-même dans `organization_members` pour une organisation arbitraire dès qu'il connaissait son UUID. Une migration de durcissement est ajoutée :
- création organisation + premier administrateur + entreprise dans une fonction `security definer` atomique ;
- suppression de la possibilité générale d'auto-adhésion ;
- onboarding migré vers `create_organization_with_admin`.

### 4. Maintenabilité
Les changements restent compatibles avec l'architecture Next.js App Router existante et n'imposent pas une migration massive vers une nouvelle bibliothèque UI. L'objectif est de conserver le moteur métier Score Pass et d'améliorer progressivement la couche produit.

## Validation locale
- TypeScript : **OK** avec `npm run typecheck`.
- Tests Vitest : dépendance exécutable absente de l'environnement d'exécution utilisé pour l'audit.
- Build Next.js : bloqué ici par l'absence du binaire SWC Linux dans l'archive et l'impossibilité de télécharger le paquet depuis npm dans l'environnement isolé.

## Pages présentes dans le dépôt
### Marketing
`/`, `/solutions`, `/score-pass`, `/methode`, `/entreprises`, `/a-propos`, `/actualites`

### Authentification
`/login`, `/register`, `/check-email`, `/onboarding`

### Espace client
`/client`, `/client/company`, `/client/documents`, `/client/evaluations`, `/client/evaluations/new`, `/client/evaluations/[id]`, `/client/requests`, `/client/score-pass`, `/client/score-pass/report`, `/client/members`, `/client/notifications`, `/client/settings`

### Administration
`/admin`, `/admin/score-pass`, `/admin/settings`, `/admin/documents`, `/admin/requests`, `/admin/enterprises`, `/admin/evaluations`, `/admin/users`, `/admin/audit`, `/admin/anomalies`

## Recommandation de production
Avant mise en ligne :
1. définir `NEXT_PUBLIC_SITE_URL` avec le domaine réel ;
2. installer proprement les dépendances avec `npm ci` ;
3. exécuter `npm run typecheck`, `npm run lint`, `npm run test` et `npm run build` dans CI ;
4. vérifier les politiques RLS sur un projet Supabase de staging ;
5. remplacer les éventuelles images externes du prototype par des assets locaux dont gulgo possède les droits.
