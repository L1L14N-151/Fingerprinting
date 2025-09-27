# 🔍 Browser Fingerprint Detector

## ⚠️ IMPORTANT: GHOSTERY/UBLOCK USERS ⚠️

### 🚫 **THIS SITE IS BLOCKED BY GHOSTERY AND SIMILAR EXTENSIONS**

If you use **Ghostery**, **uBlock Origin**, **Privacy Badger**, or **Firefox Enhanced Tracking Protection**, the fingerprinting detection WILL NOT WORK!

**To test this site:**
- 🟢 **Use INCOGNITO/PRIVATE MODE** (extensions are disabled)
- 🟢 **Temporarily disable Ghostery/uBlock for this site**
- 🟢 **Use a different browser without privacy extensions**

---

**Advanced Digital Fingerprint Detector** - Discover how websites identify you and protect yourself effectively.

🌐 **Live Demo**: [https://L1L14N-151.github.io/Fingerprinting](https://L1L14N-151.github.io/Fingerprinting)

## ✨ Features

### 📊 Complete Analysis
- **12+ metrics** analyzed in real-time
- **SHA-256 hash** unique for each visitor
- **Interactive radar chart** showing your uniqueness
- **Scores based on real statistics** (November 2024)

### 🛡️ Built-in Protection
- **Step-by-step guides** for Tor, VM, and advanced configurations
- **Browser configurations** (Firefox, Chrome, Edge, Brave)
- **Real-time privacy score**
- **Personalized tips** based on your configuration

## 🚀 Installation

### Option 1: GitHub Pages (Recommended)
```bash
git clone https://github.com/L1L14N-151/Fingerprinting.git
cd Fingerprinting
# Site will be automatically available via GitHub Pages
```

### Option 2: Local Server
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

## 📈 Analyzed Metrics

| Category | Metrics | Uniqueness Impact |
|----------|---------|-------------------|
| **Canvas** | Graphic fingerprint | 99.5% unique |
| **WebGL** | GPU, Vendor, Renderer | 85% unique |
| **Audio** | Sample rate, Context | 75% unique |
| **Screen** | Resolution, DPI, Color depth | 60% unique |
| **System** | OS, CPU cores, RAM | 50% unique |
| **Browser** | User-Agent, Plugins, Fonts | 70% unique |
| **Location** | Timezone, Language | 40% unique |

## 🔐 The Privacy Paradox

> ⚠️ **The more you try to hide, the more unique you become!**

Blockers and "privacy" extensions often create a **more unique** fingerprint than standard configurations.

### Effective Solutions

#### 1. 🌐 **Tor Browser** (Best)
- All users have exactly the same fingerprint
- One-click identity change
- Built-in Tor network

#### 2. 💻 **Virtual Machine**
- New fingerprint with each snapshot
- Complete isolation from host system
- Compatible with all browsers

#### 3. 🔧 **Advanced Configuration**
- Firefox: `privacy.resistFingerprinting = true`
- Chrome: Anti-fingerprinting flags
- Brave: Shields mode "Aggressive"

## 📁 Project Structure

```
Fingerprinting/
├── index.html              # Main interface
├── fingerprint.js          # Detection logic
├── fingerprint.css         # Minimalist design + dark mode
├── fingerprint-scores.js   # 2024 statistics scoring
└── user-agent-parser.js    # User-Agent analysis
```

## 🎯 Technologies

- **Vanilla JavaScript** - No framework, 100% native
- **Canvas API** - Unique graphic fingerprint
- **WebGL** - GPU information
- **Web Audio API** - Audio fingerprint
- **CSS Variables** - Automatic dark mode
- **SHA-256** - Cryptographic hash

## 📊 Statistics Used

Based on real data from:
- StatCounter Global Stats
- Chrome User Experience Report
- Mozilla Firefox Telemetry
- Can I Use Analytics

Last updated: **November 2024**

## 🤝 Contributing

PRs are welcome! For major changes, please open an issue first.

## 📝 License

MIT - Feel free to use this code for your projects.

## 🔗 Resources

- [AmIUnique.org](https://amiunique.org) - Alternative fingerprint test
- [BrowserLeaks](https://browserleaks.com) - Detailed tests
- [Cover Your Tracks (EFF)](https://coveryourtracks.eff.org) - Test by EFF
- [Tor Project](https://torproject.org) - Anti-fingerprinting solution

---

⭐ **Star this project if you find it useful!**