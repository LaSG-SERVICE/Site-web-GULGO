# Refonte graphique gulgo

## Direction artistique

La refonte applique à gulgo une identité visuelle inspirée de l'approche éditoriale de TOUS STATISTICIEN :

- bleu institutionnel pour la confiance et la donnée ;
- orange comme couleur d'accent et d'appel à l'action ;
- sections aérées et hiérarchie typographique forte ;
- mise en avant des chiffres clés ;
- cartes de services sobres ;
- navigation plus lisible ;
- interfaces métier cohérentes entre espace public, entreprise et administration.

## Fichiers principaux modifiés

- `app/globals.css` : nouveau design system global, responsive et composants partagés.
- `components/Brand.tsx` : identité gulgo harmonisée.
- `app/layout.tsx` : métadonnées et icônes ramenées vers les assets réellement présents.
- `app/client/page.tsx` : correction de typage Supabase.
- `eslint.config.mjs` : règle éditoriale française adaptée.

## Validation

- TypeScript : OK (`npm run typecheck`).
- ESLint : OK (`npm run lint`).
- Les tests Vitest nécessitent une réinstallation propre des dépendances car l'archive d'origine contient un `node_modules` incomplet pour l'environnement Linux.
- Le build Next.js n'a pas pu terminer ici car Next.js tente de télécharger son binaire SWC et l'environnement d'exécution ne dispose pas d'un accès réseau au registre npm.

## Installation locale

Après extraction, supprimer `node_modules` et `.next`, puis lancer :

```bash
npm install
npm run dev
```
