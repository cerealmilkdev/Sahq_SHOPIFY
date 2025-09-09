# 🚀 Sahq - Shopify Theme (CURRENTLY ON BUILD)

Un thème Shopify moderne et flexible, conçu pour offrir une expérience e-commerce exceptionnelle avec une personnalisation poussée.

![Sahq Theme](https://img.shields.io/badge/Shopify-Theme-blue?style=for-the-badge&logo=shopify)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎨 Personnalisation](#-personnalisation)
- [📱 Sections disponibles](#-sections-disponibles)
- [🔧 Développement](#-développement)
- [📈 Roadmap](#-roadmap)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## 🎯 Vue d'ensemble

Sahq est un thème Shopify moderne basé sur le Skeleton Theme de Shopify, enrichi avec des fonctionnalités avancées et un design contemporain. Il combine la robustesse de l'architecture Shopify avec la flexibilité de Tailwind CSS pour créer une expérience e-commerce exceptionnelle.

### 🎨 Design Philosophy

- **Mobile-first** : Optimisé pour tous les appareils
- **Performance** : CSS critique et optimisations avancées
- **Accessibilité** : Conforme aux standards WCAG
- **Flexibilité** : Personnalisation poussée via l'éditeur de thème

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Core

- ✅ **Sections modulaires** : Ajout/suppression/réorganisation facile
- ✅ **Design responsive** : Adaptation parfaite sur tous les écrans
- ✅ **Optimisation SEO** : Meta tags, structured data, performance
- ✅ **Accessibilité** : Navigation clavier, screen readers, contrastes
- ✅ **Internationalisation** : Support multi-langues complet

### 🛒 Fonctionnalités E-commerce

- ✅ **Gestion des produits** : Galeries, variantes, recommandations
- ✅ **Panier intelligent** : Drawer, calculs, codes promo
- ✅ **Recherche avancée** : Filtres, tri, suggestions
- ✅ **Comptes clients** : Inscription, connexion, historique
- ✅ **Checkout optimisé** : Processus fluide et sécurisé

### 🎨 Fonctionnalités Design

- ✅ **Système de couleurs** : Palette personnalisable
- ✅ **Typographie flexible** : 3 fonts configurables (heading, body, accent)
- ✅ **Animations fluides** : Micro-interactions et transitions
- ✅ **Glassmorphism** : Effets modernes et élégants
- ✅ **Dark mode ready** : Support pour thème sombre

## 🏗️ Architecture

```
Sahq/
├── 📁 assets/                 # Fichiers statiques (CSS, JS, images)
│   ├── critical.css          # CSS critique pour performance
│   ├── custom-fonts.css      # Fonts personnalisées
│   └── tailwind.output.css   # CSS Tailwind compilé
├── 📁 blocks/                # Blocs réutilisables
├── 📁 config/                # Configuration du thème
│   ├── settings_schema.json  # Paramètres de personnalisation
│   └── settings_data.json    # Valeurs par défaut
├── 📁 layout/                # Layouts principaux
│   └── theme.liquid          # Layout principal
├── 📁 locales/               # Fichiers de traduction
├── 📁 sections/              # Sections de contenu
│   ├── hero.liquid           # Section Hero moderne
│   ├── header.liquid         # Navigation principale
│   ├── footer.liquid         # Pied de page
│   └── ...                   # Autres sections
├── 📁 snippets/              # Composants réutilisables
├── 📁 templates/             # Templates de pages
└── 📄 package.json           # Dépendances et scripts
```

## 🚀 Installation

### Prérequis

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (dernière version)
- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- Compte Shopify (development store recommandé)

### Installation rapide

1. **Cloner le repository**

   ```bash
   git clone https://github.com/cerealmilkdev/Sahq_SHOPIFY.git
   cd Sahq_SHOPIFY
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer le développement**

   ```bash
   npm run dev
   ```

4. **Compiler Tailwind CSS** (dans un autre terminal)
   ```bash
   npm run tailwind
   ```

### Déploiement

1. **Build pour production**

   ```bash
   shopify theme push
   ```

2. **Ou via l'interface Shopify**
   - Admin → Online Store → Themes
   - Upload theme files

## ⚙️ Configuration

### Paramètres du thème

Le thème offre une personnalisation complète via l'éditeur Shopify :

#### 🎨 Typographie

- **Heading Font** : Police pour les titres
- **Body Font** : Police pour le texte principal
- **Accent Font** : Police pour les éléments d'accent

#### 🎨 Couleurs

- **Background Color** : Couleur de fond principale
- **Foreground Color** : Couleur du texte
- **Input Corner Radius** : Rayon des coins des formulaires

#### 📐 Layout

- **Page Width** : Largeur maximale du contenu (90rem/110rem)
- **Page Margin** : Marges latérales (10-100px)

### Configuration avancée

#### Variables CSS personnalisées

```css
:root {
  --font-heading--family: "Your Heading Font", sans-serif;
  --font-body--family: "Your Body Font", sans-serif;
  --font-accent--family: "Your Accent Font", sans-serif;
  --color-accent: #007bff;
  --color-accent-dark: #0056b3;
}
```

## 🎨 Personnalisation

### Ajouter une nouvelle section

1. **Créer le fichier section**

   ```liquid
   <!-- sections/my-section.liquid -->
   <section class="my-section">
     <h2>{{ section.settings.title }}</h2>
     <p>{{ section.settings.description }}</p>
   </section>

   {% schema %}
   {
     "name": "My Section",
     "settings": [
       {
         "type": "text",
         "id": "title",
         "label": "Title",
         "default": "My Section"
       }
     ]
   }
   {% endschema %}
   ```

2. **Ajouter au template**
   ```json
   // templates/index.json
   {
     "sections": {
       "my_section": {
         "type": "my-section",
         "settings": {
           "title": "Welcome"
         }
       }
     },
     "order": ["my_section"]
   }
   ```

### Personnaliser les couleurs

1. **Via l'éditeur Shopify**

   - Theme Settings → Colors
   - Modifier les couleurs principales

2. **Via CSS personnalisé**
   ```css
   /* assets/custom-styles.css */
   .my-custom-element {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   }
   ```

## 📱 Sections disponibles

### 🎯 Sections Core

| Section        | Description               | Fonctionnalités                                  |
| -------------- | ------------------------- | ------------------------------------------------ |
| **Hero**       | Section d'accueil moderne | Image/vidéo background, overlay, CTA, responsive |
| **Header**     | Navigation principale     | Menu, logo, panier, compte client                |
| **Footer**     | Pied de page              | Liens, newsletter, réseaux sociaux               |
| **Product**    | Page produit              | Galerie, variantes, recommandations              |
| **Collection** | Page collection           | Grille, filtres, tri, pagination                 |
| **Cart**       | Panier                    | Items, quantités, codes promo                    |
| **Search**     | Recherche                 | Résultats, filtres, suggestions                  |

### 🎨 Sections Marketing

| Section          | Description                       | Statut              |
| ---------------- | --------------------------------- | ------------------- |
| **Features**     | Mise en avant des fonctionnalités | 🚧 En développement |
| **Testimonials** | Avis clients                      | 🚧 En développement |
| **Newsletter**   | Inscription newsletter            | 🚧 En développement |
| **Social Feed**  | Réseaux sociaux                   | 🚧 En développement |
| **FAQ**          | Questions fréquentes              | 🚧 En développement |

## 🔧 Développement

### Scripts disponibles

```bash
# Développement
npm run dev                    # Lance le serveur de développement
npm run dev:tailwind          # Compile Tailwind en mode watch

# Production
shopify theme push            # Déploie le thème
shopify theme pull            # Récupère les modifications
```

### Structure de développement

#### Conventions CSS

- **BEM** : Block\_\_Element--Modifier
- **Variables CSS** : `--component-property`
- **Responsive** : Mobile-first avec `min-width`
- **Performance** : CSS critique séparé

#### Conventions Liquid

- **Snippets** : Réutilisables et paramétrables
- **Sections** : Modulaires avec schema
- **Traductions** : Clés organisées par contexte
- **Performance** : Lazy loading des images

### Outils recommandés

- **VS Code** avec extension Shopify Liquid
- **Shopify CLI** pour le développement
- **Theme Check** pour la validation
- **Lighthouse** pour les performances

## 📈 Roadmap

### 🎯 Version 1.1 (Q1 2024)

- [ ] Section Features avec icônes
- [ ] Section Testimonials avec carousel
- [ ] Section Newsletter signup
- [ ] Optimisation des performances
- [ ] Support dark mode

### 🎯 Version 1.2 (Q2 2024)

- [ ] Section FAQ accordion
- [ ] Section Social media feed
- [ ] Quick view des produits
- [ ] Wishlist functionality
- [ ] Advanced product filtering

### 🎯 Version 2.0 (Q3 2024)

- [ ] Mega menu navigation
- [ ] Advanced cart drawer
- [ ] Product comparison
- [ ] Customer reviews system
- [ ] Advanced analytics integration

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment participer :

### 🐛 Signaler un bug

1. Vérifier les [issues existantes](https://github.com/Mandroso22/Sahq_SHOPIFY/issues)
2. Créer une nouvelle issue avec le template bug report
3. Inclure les étapes de reproduction et captures d'écran

### 💡 Proposer une fonctionnalité

1. Créer une issue avec le template feature request
2. Décrire la fonctionnalité et son utilité
3. Discuter avec l'équipe

### 🔧 Contribuer au code

1. Fork le repository
2. Créer une branche feature : `git checkout -b feature/amazing-feature`
3. Commit les changements : `git commit -m 'Add amazing feature'`
4. Push vers la branche : `git push origin feature/amazing-feature`
5. Ouvrir une Pull Request

### 📋 Guidelines

- Suivre les conventions de code existantes
- Tester sur différents appareils
- Documenter les nouvelles fonctionnalités
- Respecter les standards d'accessibilité

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

## 🆘 Support

### 📚 Documentation

- [Shopify Theme Development](https://shopify.dev/docs/storefronts/themes)
- [Liquid Template Language](https://shopify.dev/docs/api/liquid)
- [Theme Architecture](https://shopify.dev/docs/storefronts/themes/architecture)

### 💬 Communauté

- [Shopify Community](https://community.shopify.com/)
- [GitHub Discussions](https://github.com/Mandroso22/Sahq_SHOPIFY/discussions)

### 📧 Contact

- **Email** : adminms@makesocial.me
- **GitHub** : [@cerealmilkdev](https://github.com/cerealmilkdev)

---

<div align="center">

**Sahq Theme** - Construit avec ❤️ pour la communauté Shopify

[![GitHub stars](https://img.shields.io/github/stars/Mandroso22/Sahq_SHOPIFY?style=social)](https://github.com/Mandroso22/Sahq_SHOPIFY/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Mandroso22/Sahq_SHOPIFY?style=social)](https://github.com/Mandroso22/Sahq_SHOPIFY/network)
[![GitHub issues](https://img.shields.io/github/issues/Mandroso22/Sahq_SHOPIFY)](https://github.com/Mandroso22/Sahq_SHOPIFY/issues)

</div>


