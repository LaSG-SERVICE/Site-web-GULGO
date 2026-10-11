# Déploiement gulgo

## DEV
1. Créer un projet Supabase DEV.
2. Exécuter `supabase/migrations/001_initial.sql` dans SQL Editor.
3. Copier `.env.local.example` vers `.env.local` et renseigner URL + anon key.
4. `npm install`
5. `npm run dev`

## PROD
Créer un projet Supabase distinct. Ne jamais partager les secrets DEV/PROD. Configurer les mêmes migrations et vérifier les policies RLS avant ouverture.

## Vercel
Connecter le dépôt GitHub privé à Vercel, renseigner les variables d'environnement, lancer le build puis rattacher le domaine gulgo.

## Contrôles pré-production
- `npm run typecheck`
- `npm run lint`
- `npm test`
- revue RLS avec deux organisations de test
- test upload logo
- test upload document privé
- test isolation A/B
- test hard gates et versionnage
