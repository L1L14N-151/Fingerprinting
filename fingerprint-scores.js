// Simplified and accurate fingerprint scoring system
// Based on real 2024 statistics

// Browser scoring - Simple and direct
function calculateRealBrowserScore(fp) {
    const ua = fp.userAgent.toLowerCase();

    // Desktop browsers
    if (!ua.includes('mobile') && !ua.includes('android')) {
        if (ua.includes('chrome') && !ua.includes('edg')) {
            return 25;  // Chrome desktop ~65% market share
        } else if (ua.includes('firefox')) {
            return 65;  // Firefox desktop ~6.5% market share
        } else if (ua.includes('safari') && !ua.includes('chrome')) {
            return 55;  // Safari desktop ~9% market share
        } else if (ua.includes('edg')) {
            return 50;  // Edge desktop ~13% market share
        } else if (ua.includes('brave')) {
            return 85;  // Brave ~1.2% market share
        } else if (ua.includes('opera') || ua.includes('opr')) {
            return 75;  // Opera ~3% market share
        } else if (ua.includes('vivaldi')) {
            return 92;  // Vivaldi <0.5% market share
        }
    }

    // Mobile browsers
    if (ua.includes('mobile') || ua.includes('android')) {
        if (ua.includes('chrome')) {
            return 30;  // Chrome mobile ~66% market share
        } else if (ua.includes('safari')) {
            return 40;  // Safari mobile ~24% market share
        } else if (ua.includes('firefox')) {
            return 90;  // Firefox mobile ~0.4% market share
        } else if (ua.includes('samsung')) {
            return 70;  // Samsung Browser ~4.5% market share
        }
    }

    return 80;  // Unknown browser
}

// OS/System scoring - Fixed
function calculateRealSystemScore(fp) {
    const platform = fp.platform.toLowerCase();
    const ua = fp.userAgent.toLowerCase();

    // Desktop OS
    if (!ua.includes('mobile') && !ua.includes('android')) {
        if (platform.includes('win')) {
            return 20;  // Windows ~72% of desktop
        } else if (platform.includes('mac')) {
            // macOS ~16% of desktop
            if (navigator.hardwareConcurrency >= 8) {
                return 65;  // macOS ARM is rarer
            }
            return 55;  // macOS Intel
        } else if (platform.includes('linux')) {
            return 85;  // Linux ~4% of desktop
        }
    }

    // Mobile OS
    if (ua.includes('android')) {
        return 35;  // Android ~44% of all devices
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
        return 45;  // iOS ~17% of all devices
    }

    return 75;  // Unknown OS
}

// Screen resolution scoring - Updated November 2024 stats
function calculateRealScreenScore(fp) {
    const res = fp.screenResolution;

    // Most common resolutions 2024 (from StatCounter & similar sources)
    const commonResolutions = {
        // Desktop resolutions
        '1920x1080': 10,  // ~22.3% - Most common desktop
        '1366x768': 20,   // ~13.6% - Still very common laptops
        '1536x864': 25,   // ~8.9%
        '1440x900': 35,   // ~5.2%
        '1600x900': 35,   // ~4.8%
        '1280x720': 30,   // ~4.5%
        '2560x1440': 40,  // ~4.3% - 2K monitors
        '1280x800': 45,   // ~3.1%
        '3840x2160': 50,  // ~2.8% - 4K
        '1680x1050': 55,  // ~2.2%
        '2560x1600': 60,  // ~1.8% - MacBook Pro 14"
        '2880x1800': 65,  // ~1.2% - MacBook Pro 15" Retina
        '3440x1440': 75,  // ~0.9% - Ultrawide
        '5120x1440': 85,  // ~0.3% - Super ultrawide

        // Mobile resolutions (viewport, not device)
        '390x844': 25,    // ~5.8% - iPhone 14/15/13/12
        '393x852': 25,    // ~4.2% - iPhone 15 Pro
        '430x932': 30,    // ~3.9% - iPhone 15 Pro Max
        '414x896': 30,    // ~3.5% - iPhone 11 Pro/XS
        '375x812': 35,    // ~3.1% - iPhone X/11 Pro
        '375x667': 35,    // ~2.8% - iPhone 6/7/8
        '360x800': 30,    // ~2.5% - Samsung phones
        '412x915': 35,    // ~2.3% - Pixel phones
        '360x780': 35,    // ~2.1% - Various Android
        '385x854': 40,    // ~1.8% - Android mid-range

        // Tablet resolutions
        '768x1024': 40,   // ~2.4% - iPad
        '810x1080': 45,   // ~1.6% - iPad 10.2
        '820x1180': 45,   // ~1.2% - iPad Air
        '1024x1366': 50,  // ~0.8% - iPad Pro 12.9
    };

    // Return score based on resolution
    if (commonResolutions[res]) {
        return commonResolutions[res];
    }

    // Check for common patterns
    const [width, height] = res.split('x').map(Number);

    // Very common aspect ratios
    if (width === 1920 && height === 1080) return 10;  // Full HD variants
    if (width === 1366 && height === 768) return 20;   // HD variants

    // Mobile portrait (9:19.5 to 9:21 ratio)
    if (width < 500 && height > 800 && height/width > 1.9 && height/width < 2.3) {
        return 35;  // Common mobile
    }

    // Uncommon resolution
    return 75;
}

// Canvas fingerprinting score
function calculateRealCanvasScore(fp) {
    if (!fp.canvasData) {
        return 95;  // Canvas blocking is very rare (0.5% of users)
    }
    // Canvas fingerprints are almost always unique (99.5%)
    // This is THE most identifying metric
    return 99;  // 99.5% unique in reality
}

// WebGL score
function calculateRealWebGLScore(fp) {
    if (!fp.webglRenderer) {
        return 85;  // No WebGL is rare
    }

    const renderer = (fp.webglRenderer || '').toLowerCase();

    if (renderer.includes('intel')) {
        return 40;  // Intel ~38% of GPUs
    } else if (renderer.includes('nvidia')) {
        return 50;  // NVIDIA ~27%
    } else if (renderer.includes('amd') || renderer.includes('radeon')) {
        return 60;  // AMD ~16%
    } else if (renderer.includes('apple')) {
        return 70;  // Apple ~8%
    } else if (renderer.includes('mali') || renderer.includes('adreno')) {
        return 65;  // Mobile GPUs ~9%
    }

    return 75;  // Unknown GPU
}

// Audio fingerprinting score
function calculateRealAudioScore(fp) {
    if (!fp.audioSampleRate) {
        return 75;  // No audio is somewhat rare
    }

    if (fp.audioSampleRate === 44100) {
        return 45;  // Most common sample rate ~65%
    } else if (fp.audioSampleRate === 48000) {
        return 55;  // Second most common ~32%
    }

    return 80;  // Unusual sample rate
}

// Hardware score
function calculateRealHardwareScore(fp) {
    const cores = fp.hardwareConcurrency || 4;

    // CPU cores distribution
    const coreScores = {
        2: 70,   // ~8% - Old devices
        4: 35,   // ~28% - Most common
        6: 45,   // ~18%
        8: 40,   // ~25% - Modern standard
        10: 65,  // ~8% - Apple M1/M2 Pro
        12: 70,  // ~6% - High-end
        14: 85,  // ~2% - M3 Pro
        16: 85,  // ~2% - Desktop high-end
    };

    if (coreScores[cores]) {
        return coreScores[cores];
    }

    if (cores > 16) {
        return 90;  // Workstation
    }

    return 60;
}

// Language score
function calculateRealLanguageScore(fp) {
    const lang = fp.language || 'en-US';

    // Common languages
    const langScores = {
        'en-US': 35,   // ~27% most common
        'zh-CN': 40,   // ~20%
        'en-GB': 55,   // ~4.5%
        'es-ES': 55,   // ~4%
        'pt-BR': 60,   // ~4%
        'fr-FR': 60,   // ~3%
        'de-DE': 60,   // ~3%
        'ja-JP': 65,   // ~3%
        'ru-RU': 65,   // ~2.5%
    };

    if (langScores[lang]) {
        return langScores[lang];
    }

    return 75;  // Uncommon language
}

// Timezone score
function calculateRealTimezoneScore(fp) {
    const tz = fp.timezone || 'UTC';

    // Common timezones
    const tzScores = {
        'Asia/Shanghai': 45,        // ~12.5%
        'America/New_York': 50,     // ~6%
        'Europe/London': 55,        // ~5%
        'America/Chicago': 60,      // ~3.5%
        'Europe/Paris': 60,         // ~3%
        'America/Los_Angeles': 60,  // ~3%
        'Asia/Tokyo': 65,           // ~3%
        'Europe/Moscow': 65,        // ~2.5%
    };

    if (tzScores[tz]) {
        return tzScores[tz];
    }

    // Europe/Paris and similar are moderately common
    if (tz.includes('Europe/')) {
        return 60;
    } else if (tz.includes('America/')) {
        return 55;
    } else if (tz.includes('Asia/')) {
        return 50;
    }

    return 70;  // Uncommon timezone
}

// Plugins score
function calculateRealPluginsScore(fp) {
    const count = fp.plugins.length;

    if (count === 0) {
        return 25;  // ~85% have no plugins (modern browsers)
    } else if (count === 1) {
        return 60;  // ~8%
    } else if (count === 2) {
        return 70;  // ~3.5%
    } else if (count === 3) {
        return 80;  // ~2%
    }

    return 90;  // 4+ plugins is very rare
}

// Fonts score
function calculateRealFontsScore(fp) {
    const fontCount = fp.fonts || 0;

    if (fontCount === 0) {
        return 85;  // Blocked fonts (privacy mode)
    } else if (fontCount < 20) {
        return 70;  // Few fonts (Linux/mobile)
    } else if (fontCount < 40) {
        return 55;  // Below average
    } else if (fontCount < 60) {
        return 35;  // Average Windows
    } else if (fontCount < 80) {
        return 30;  // Windows with Office
    } else if (fontCount < 100) {
        return 45;  // macOS/Designer
    }

    return 60;  // Many fonts
}

// Storage score
function calculateRealStorageScore(fp) {
    let score = 20;  // Base score if everything is normal

    // Check for unusual configurations
    if (!fp.cookiesEnabled) score = 70;     // Blocking cookies is rare
    if (!fp.localStorage) score += 20;      // Blocking localStorage
    if (!fp.sessionStorage) score += 15;    // Blocking sessionStorage
    if (!fp.indexedDB) score += 10;         // Blocking indexedDB

    return Math.min(90, score);
}

// Overall entropy calculation
function calculateOverallEntropy(scores) {
    // Simple average-based entropy calculation
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Convert to bits of entropy (0-100 score to 0-20 bits)
    const bits = (avgScore / 100) * 20;

    return bits.toFixed(1);
}

// Export all functions
window.calculateRealBrowserScore = calculateRealBrowserScore;
window.calculateRealSystemScore = calculateRealSystemScore;
window.calculateRealScreenScore = calculateRealScreenScore;
window.calculateRealCanvasScore = calculateRealCanvasScore;
window.calculateRealWebGLScore = calculateRealWebGLScore;
window.calculateRealAudioScore = calculateRealAudioScore;
window.calculateRealHardwareScore = calculateRealHardwareScore;
window.calculateRealLanguageScore = calculateRealLanguageScore;
window.calculateRealTimezoneScore = calculateRealTimezoneScore;
window.calculateRealPluginsScore = calculateRealPluginsScore;
window.calculateRealFontsScore = calculateRealFontsScore;
window.calculateRealStorageScore = calculateRealStorageScore;
window.calculateOverallEntropy = calculateOverallEntropy;