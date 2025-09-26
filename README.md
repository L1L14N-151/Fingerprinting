# 🔍 Browser Fingerprint Detector

**Détecteur d'empreinte numérique avancé** - Découvrez comment les sites web vous identifient et protégez-vous efficacement.

🌐 **Demo Live**: [https://votre-username.github.io/fingerprint-detector](https://votre-username.github.io/fingerprint-detector)

## ✨ Fonctionnalités

### 📊 Analyse Complète
- **12+ métriques** analysées en temps réel
- **Hash SHA-256** unique pour chaque visiteur
- **Graphique radar** interactif montrant votre unicité
- **Scores basés sur des statistiques réelles** (Novembre 2024)

### 🛡️ Protection Intégrée
- **Guides étape par étape** pour Tor, VM, et configurations avancées
- **Configurations navigateurs** (Firefox, Chrome, Edge, Brave)
- **Score de confidentialité** en temps réel
- **Conseils personnalisés** selon votre configuration

## 🚀 Installation

### Option 1: GitHub Pages (Recommandé)
```bash
git clone https://github.com/votre-username/fingerprint-detector.git
cd fingerprint-detector
# Le site sera automatiquement disponible via GitHub Pages
```

### Option 2: Serveur Local
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Ouvrez `http://localhost:8000` dans votre navigateur.

## 📈 Métriques Analysées

| Catégorie | Métriques | Impact Unicité |
|-----------|-----------|----------------|
| **Canvas** | Empreinte graphique | 99.5% unique |
| **WebGL** | GPU, Vendor, Renderer | 85% unique |
| **Audio** | Sample rate, Context | 75% unique |
| **Écran** | Résolution, DPI, Color depth | 60% unique |
| **Système** | OS, CPU cores, RAM | 50% unique |
| **Navigateur** | User-Agent, Plugins, Fonts | 70% unique |
| **Localisation** | Timezone, Langue | 40% unique |

## 🔐 Le Paradoxe de la Protection

> ⚠️ **Plus vous tentez de vous cacher, plus vous devenez unique !**

Bloqueurs et extensions "privacy" créent souvent une empreinte **plus unique** que les configurations standards.

### Solutions Efficaces

#### 1. 🌐 **Tor Browser** (Meilleur)
- Tous les utilisateurs ont exactement la même empreinte
- Changement d'identité en un clic
- Réseau Tor intégré

#### 2. 💻 **Machine Virtuelle**
- Nouvelle empreinte à chaque snapshot
- Isolation complète du système hôte
- Compatible avec tous les navigateurs

#### 3. 🔧 **Configuration Avancée**
- Firefox: `privacy.resistFingerprinting = true`
- Chrome: Flags anti-fingerprinting
- Brave: Shields mode "Aggressive"

## 📁 Structure du Projet

```
fingerprint-detector/
├── index.html              # Interface principale
├── fingerprint.js          # Logique de détection
├── fingerprint.css         # Design minimaliste + dark mode
├── fingerprint-scores.js   # Scoring statistiques 2024
└── user-agent-parser.js    # Analyse User-Agent
```

## 🎯 Technologies

- **Vanilla JavaScript** - Aucun framework, 100% natif
- **Canvas API** - Empreinte graphique unique
- **WebGL** - Informations GPU
- **Web Audio API** - Empreinte audio
- **CSS Variables** - Dark mode automatique
- **SHA-256** - Hash cryptographique

## 📊 Statistiques Utilisées

Basé sur des données réelles de:
- StatCounter Global Stats
- Chrome User Experience Report
- Mozilla Firefox Telemetry
- Can I Use Analytics

Mises à jour: **Novembre 2024**

## 🤝 Contribution

Les PR sont les bienvenues ! Pour des changements majeurs, ouvrez d'abord une issue.

## 📝 License

MIT - Utilisez librement ce code pour vos projets.

## 🔗 Ressources

- [AmIUnique.org](https://amiunique.org) - Test d'empreinte alternatif
- [BrowserLeaks](https://browserleaks.com) - Tests détaillés
- [Cover Your Tracks (EFF)](https://coveryourtracks.eff.org) - Test par l'EFF
- [Tor Project](https://torproject.org) - Solution anti-fingerprinting

---

⭐ **Star ce projet si vous le trouvez utile !**