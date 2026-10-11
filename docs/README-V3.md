# gulgo V3 — direction artistique et intégration

## Positionnement
gulgo est présenté comme une plateforme B2B de crédibilité économique : données structurées, preuves traçables, contrôles, analyse et Score Pass.

## Identité
- Bleu nuit : confiance, rigueur, institutionnel.
- Orange : action, signal, validation.
- Blanc : lisibilité et respiration.
- Logo officiel gulgo conservé sans modification.
- Signature : « LA CONFIANCE DEVIENT UN ACTIF. »

## Homepage
La page d'accueil suit une narration :
1. Hero / promesse
2. Chiffres clés
3. Solutions
4. Architecture de la donnée
5. Score Pass
6. Méthode
7. Publics gulgo
8. Data & Insights
9. CTA final
10. Footer

## Principes UX
- Peu de texte dans les zones critiques.
- Alternance entre contenu éditorial, photographie, données et interface produit.
- Score Pass utilisé comme élément visuel principal.
- Animations discrètes et désactivables avec `prefers-reduced-motion`.
- Navigation mobile native et responsive.

## Illustration
La maquette de référence est `gulgo-V3-illustration-professionnelle.png`.
Elle sert de référence visuelle ; les données affichées dans les mockups sont illustratives.

## Lancement local
```cmd
npm install
npm run dev
```
Puis ouvrir `http://localhost:3000`.

Pour l'accès LAN, `next.config.ts` autorise actuellement `192.168.1.13` en développement. Si l'adresse IP locale change, la valeur doit être mise à jour.
