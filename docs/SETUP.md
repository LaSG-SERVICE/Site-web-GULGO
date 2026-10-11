# Installation pas à pas

1. Ouvrir le dossier dans VS Code.
2. Utiliser **Command Prompt** dans le terminal si PowerShell bloque `npm.ps1`.
3. `npm install`
4. Copier `.env.local.example` en `.env.local`.
5. Renseigner les deux variables Supabase.
6. Exécuter la migration SQL.
7. `npm run dev`
8. Ouvrir http://localhost:3000

## Premier parcours
Accueil → Créer un compte → confirmer l'e-mail si demandé → Connexion → Onboarding → créer l'organisation → déposer le logo → espace client.

## Back-office
Pour les environnements de démonstration, la navigation admin existe. En production, les routes admin doivent être protégées par le rôle gulgo et testées avec RLS avant déploiement.

## gulgo V3

La page d'accueil a été reconstruite autour du logo officiel gulgo et de la signature « La confiance devient un actif. ».

```bash
npm install
npm run dev
```

Puis : `http://localhost:3000`

Pour tester depuis le réseau local, l'adresse actuellement autorisée dans `next.config.ts` est `192.168.1.13`. Si l'adresse IP de la machine change, remplacer cette valeur puis redémarrer Next.js.

Aperçu statique : `docs/gulgo-V3-illustration.png`.
