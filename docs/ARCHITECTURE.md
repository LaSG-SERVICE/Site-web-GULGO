# Architecture gulgo Web V1

## 1. Vision
gulgo est une application B2B multi-tenant : plusieurs entreprises clientes disposent de leurs propres comptes, membres, données, documents, évaluations et demandes, tandis que le personnel gulgo dispose d'un back-office transversal.

## 2. Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS
- Supabase Auth
- PostgreSQL + Row Level Security (RLS)
- Supabase Storage : logos publics, documents privés
- Vercel pour le déploiement
- Vitest pour les tests du moteur

## 3. Tenants
`organizations` est le tenant. `organization_members` relie les utilisateurs aux tenants. `enterprises` porte le profil économique de l'entreprise.

## 4. Sécurité
- RLS sur les tables métier
- isolation par organisation
- documents dans un bucket privé
- aucune clé service-role côté navigateur
- audit des opérations sensibles
- validation des types et tailles de fichiers

## 5. Identité visuelle
Le logo officiel gulgo est `public/branding/gulgo-logo.svg`. Chaque organisation possède son propre `logo_url`. Le composant `LogoUploader` permet au client de déposer/modifier son logo.

> Le fichier SVG présent dans le starter est un emplacement technique de démonstration. Remplacer ce fichier par le logo officiel gulgo fourni par l'entreprise avant production.

## 6. Score Pass
Le moteur officiel est côté serveur (`lib/scorepass/engine.ts`). Les paramètres issus du classeur sont archivés dans `data/scorepass-v1.json`. La base est conçue pour stocker la version méthodologique, les variables, preuves, dimensions, scores, hard gates, anomalies et sorties.

## 7. Non-rétroactivité
Une évaluation conserve `model_version`. Une nouvelle version de paramétrage ne doit pas recalculer rétroactivement les évaluations officielles existantes.
