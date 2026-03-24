# Design — Crous't Wok Mobile App

## Identité de marque

- **Nom** : Crous't Wok
- **Signature** : Hot and Fresh
- **Positionnement** : Restaurant asiatique revisité autour du riz, des pâtes de riz et d'une expérience chaleureuse
- **Phrase de marque** : « Parce qu'entre la France et l'Asie, c'est une belle histoire d'amour »

---

## Palette de couleurs

| Rôle | Couleur | Valeur |
|------|---------|--------|
| Primary | Rouge profond | `#C0392B` |
| Secondary | Orange chaud | `#E67E22` |
| Background | Noir anthracite | `#1A1A1A` |
| Surface | Anthracite clair | `#242424` |
| Foreground | Blanc cassé / crème | `#F5EFE6` |
| Muted | Gris chaud | `#9A8F85` |
| Accent / Gold | Doré | `#D4A843` |
| Border | Anthracite moyen | `#333333` |

---

## Typographie

- **Titres** : Bold, grandes tailles (28–36px)
- **Sous-titres** : SemiBold (18–22px)
- **Corps** : Regular (14–16px), line-height 1.5
- **Boutons** : SemiBold, uppercase ou sentence case

---

## Liste des écrans

| Écran | Description |
|-------|-------------|
| `HomeScreen` | Écran principal avec toutes les sections scrollables |
| `MenuScreen` | Carte complète du restaurant avec catégories |
| `OrderScreen` | Panier et commande en ligne |
| `AboutScreen` | Concept, engagements, chiffres clés |
| `ContactScreen` | Localisation, horaires, contact |

---

## Structure de l'écran Home (scroll vertical)

1. **Bandeau promotionnel** — Offre du moment (sticky en haut)
2. **Hero Section** — Image immersive, titre, CTA
3. **Section Concept** — Présentation Crous't Wok
4. **Section Engagements** — Cartes icônes (7 valeurs)
5. **Section Menu Phare** — Grille de plats avec prix
6. **Section Commande en ligne** — CTA + téléphone
7. **Section Chiffres** — Stats (15k+ clients, 17+ récompenses, 50+ plats)
8. **Section Spécialités** — 3 blocs premium
9. **Section Avantages** — Livraison, qualité
10. **Section Avis clients** — Témoignages slider
11. **Section Newsletter** — Email + CTA 10% réduction
12. **Section Localisation** — Adresse + carte
13. **Footer** — Liens, réseaux sociaux, copyright

---

## Navigation (Tab Bar)

| Tab | Icône | Écran |
|-----|-------|-------|
| Accueil | `house.fill` | HomeScreen |
| Menu | `fork.knife` | MenuScreen |
| Commander | `cart.fill` | OrderScreen |
| Contact | `location.fill` | ContactScreen |

---

## Composants clés

- `HeroSection` — Image de fond, overlay gradient, titre + sous-titre + 2 boutons CTA
- `PromoBanner` — Bandeau rouge animé en haut
- `ConceptSection` — Texte + icônes + bouton
- `CommitmentsSection` — Grille de cartes avec icônes Material
- `MenuGrid` — FlatList de plats avec image, nom, description, prix, bouton Commander
- `OnlineOrderSection` — Bloc CTA avec téléphone
- `StatsSection` — 3 compteurs animés
- `SpecialtiesSection` — 3 blocs premium horizontaux
- `BenefitsSection` — 3 avantages (livraison, rapidité, qualité)
- `TestimonialsSection` — Slider d'avis clients
- `NewsletterSection` — Formulaire email
- `LocationSection` — Adresse + carte
- `FloatingOrderButton` — Bouton flottant "Commander"
- `WhatsAppButton` — Bouton flottant WhatsApp/téléphone

---

## Flux utilisateur principal

1. L'utilisateur ouvre l'app → voit le Hero avec CTA
2. Tape "Découvrir la carte" → navigue vers MenuScreen
3. Tape "Commander maintenant" → navigue vers OrderScreen
4. Scroll sur Home → découvre les plats phares → tape "Commander" sur un plat
5. Tape le bouton flottant "Commander" → OrderScreen
6. Tab "Contact" → voit l'adresse et peut appeler

---

## Interactions & animations

- Scroll fade-in sur les sections
- Press feedback sur les boutons (scale 0.97 + haptic)
- Bandeau promotionnel animé (défilement horizontal)
- Compteurs animés dans la section Chiffres
- Slider horizontal pour les avis clients
