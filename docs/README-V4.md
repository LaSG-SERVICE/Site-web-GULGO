# gulgo V4 — refonte professionnelle complète

Cette version répond aux cinq problèmes signalés :

1. **Logo visible et animé** : le logo officiel est utilisé depuis `public/branding/gulgo-logo-cropped.png`. Il est présenté dans une plaque visuelle et dispose d'orbites discrètes et d'un léger mouvement continu. Les animations sont neutralisées avec `prefers-reduced-motion`.
2. **Navigation multi-pages** : l'accueil mène vers `/solutions`, `/score-pass`, `/methode`, `/entreprises`, `/a-propos`, `/actualites`, `/login` et `/register`. Les pages publiques partagent le même header/footer.
3. **Connexion professionnelle** : `/login` dispose d'un écran en deux panneaux, visualisation Score Pass, preuves, indicateurs et formulaire fonctionnel Supabase.
4. **Création de compte professionnelle** : `/register` reprend le même langage visuel et conserve la création Supabase.
5. **Autres pages** : les espaces client/admin héritent du même langage bleu nuit, bleu, orange, cartes, KPI et progressions ; les pages marketing sont entièrement harmonisées.

## Installation

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Routes publiques

- `/`
- `/solutions`
- `/score-pass`
- `/methode`
- `/entreprises`
- `/a-propos`
- `/actualites`
- `/login`
- `/register`
- `/check-email`
- `/onboarding`

## Routes applicatives conservées

- `/client/*`
- `/admin/*`
- `/api/*`

## Réseau local Next.js

`next.config.ts` conserve `allowedDevOrigins` pour `192.168.1.13`. Si l'adresse IP du PC change, mettre à jour cette valeur.

## Illustrations

`docs/gulgo-V4-illustration-toutes-pages.png` est une planche de référence visuelle présentant l'accueil, la connexion, l'inscription, les dashboards client/admin et les pages marketing.
