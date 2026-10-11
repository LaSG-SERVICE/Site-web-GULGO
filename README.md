# GULGO Web V1 — Starter complet

Cette base rassemble l'architecture web, le multi-tenant, l'authentification Supabase, RLS, les logos GULGO/client, l'espace client, la collecte des 37 variables, les documents/demandes/notifications, le back-office, le référentiel Score Pass V1 importé depuis Excel, le moteur de calcul autorisé par le référentiel, les hard gates, le versionnement, l'audit et les tests T01–T15.

## Démarrage
```bash
npm install
npm run dev
```

Si PowerShell Windows affiche `npm.ps1 ... execution of scripts is disabled`, utiliser **Command Prompt** dans VS Code, ou configurer PowerShell avec `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

## Supabase
Exécuter `supabase/migrations/001_initial.sql`. Copier `.env.local.example` vers `.env.local` et renseigner les clés du projet DEV.

## Paramétrage Score Pass
Les deux classeurs sources sont dans `data/`. Le snapshot `data/scorepass-v1.json` est issu du classeur de paramétrage. Le script `scripts/import-workbook.py` permet de régénérer un snapshot après validation d'une nouvelle version du fichier.

## Important
Cette base est un **starter professionnel fonctionnel**, pas une certification de production. Les paramètres explicitement marqués « À calibrer », « À formaliser » ou « À finaliser » dans le référentiel restent tels quels et ne sont pas inventés.


## Installation et validation — version V5

Pré-requis : **Node.js >= 20.9** et **npm >= 10**. Next.js 16 utilise Turbopack par défaut et le projet utilise la configuration ESLint flat config.

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

Pour contrôler les dépendances :

```bash
npm run audit
```

> Le fichier `package-lock.json` est volontairement régénéré par `npm install` afin de résoudre les dépendances avec la version actuelle d'ESLint 10.

### Corrections V5

- correction de l'avertissement Next.js lié à `scroll-behavior: smooth` avec `data-scroll-behavior="smooth"` ;
- migration vers ESLint 10, la branche ESLint 9 étant arrivée en fin de vie le 6 août 2026 ;
- navigation publique avec état actif et attribut `aria-current` ;
- états 404, erreur et chargement cohérents avec la direction artistique GULGO ;
- amélioration de la hiérarchie visuelle, des surfaces, ombres, contrastes, états hover/focus et responsive ;
- réduction des animations lorsque `prefers-reduced-motion` est actif ;
- SEO, robots, sitemap et URL canonique conservés ;
- aucun secret Supabase ne doit être placé côté navigateur.
"# Site-web-GULGO" 
