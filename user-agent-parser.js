// Advanced User-Agent Parser with spoofing detection

class UserAgentParser {
    constructor(userAgent, platform, vendor) {
        this.ua = userAgent || '';
        this.platform = platform || '';
        this.vendor = vendor || '';
        this.uaLower = this.ua.toLowerCase();

        // Parse all components
        this.browser = this.detectBrowser();
        this.os = this.detectOS();
        this.device = this.detectDevice();
        this.spoofing = this.detectSpoofing();
    }

    detectBrowser() {
        const ua = this.uaLower;
        let name = 'Unknown';
        let version = '';
        let engine = '';

        // Order matters - check from most specific to least specific

        // Brave (must check before Chrome)
        if (navigator.brave && navigator.brave.isBrave) {
            name = 'Brave';
            const match = ua.match(/chrome\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Edge (Chromium-based)
        else if (ua.includes('edg/') || ua.includes('edge/')) {
            name = 'Edge';
            const match = ua.match(/edg[e]?\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Opera (must check before Chrome)
        else if (ua.includes('opr/') || ua.includes('opera/')) {
            name = 'Opera';
            const match = ua.match(/(?:opr|opera)[\/\s]([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Vivaldi (must check before Chrome)
        else if (ua.includes('vivaldi')) {
            name = 'Vivaldi';
            const match = ua.match(/vivaldi\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Samsung Browser
        else if (ua.includes('samsungbrowser')) {
            name = 'Samsung Browser';
            const match = ua.match(/samsungbrowser\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // UC Browser
        else if (ua.includes('ucbrowser') || ua.includes('ubrowser')) {
            name = 'UC Browser';
            const match = ua.match(/(?:ucbrowser|ubrowser)\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'U3';
        }
        // DuckDuckGo
        else if (ua.includes('duckduckgo')) {
            name = 'DuckDuckGo';
            const match = ua.match(/duckduckgo\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'WebKit';
        }
        // Yandex
        else if (ua.includes('yabrowser')) {
            name = 'Yandex';
            const match = ua.match(/yabrowser\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Firefox (and variants)
        else if (ua.includes('firefox') || ua.includes('fxios')) {
            if (ua.includes('fxios')) {
                name = 'Firefox iOS';
                const match = ua.match(/fxios\/([\d.]+)/);
                version = match ? match[1] : '';
                engine = 'WebKit'; // iOS forces WebKit
            } else {
                name = 'Firefox';
                const match = ua.match(/firefox\/([\d.]+)/);
                version = match ? match[1] : '';
                engine = 'Gecko';
            }
        }
        // Chrome iOS
        else if (ua.includes('crios')) {
            name = 'Chrome iOS';
            const match = ua.match(/crios\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'WebKit';
        }
        // Chrome/Chromium
        else if (ua.includes('chrome') || ua.includes('chromium')) {
            name = ua.includes('chromium') ? 'Chromium' : 'Chrome';
            const match = ua.match(/(?:chrome|chromium)\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Blink';
        }
        // Safari (must be after Chrome check)
        else if (ua.includes('safari') && !ua.includes('chrome')) {
            if (ua.includes('mobile')) {
                name = 'Safari Mobile';
            } else {
                name = 'Safari';
            }
            const match = ua.match(/version\/([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'WebKit';
        }
        // Internet Explorer
        else if (ua.includes('msie') || ua.includes('trident')) {
            name = 'Internet Explorer';
            const match = ua.match(/(?:msie |rv:)([\d.]+)/);
            version = match ? match[1] : '';
            engine = 'Trident';
        }
        // PlayStation Browser
        else if (ua.includes('playstation')) {
            name = 'PlayStation Browser';
            const match = ua.match(/playstation\s(\d)/);
            version = match ? 'PS' + match[1] : '';
            engine = 'WebKit';
        }
        // Xbox Browser
        else if (ua.includes('xbox')) {
            name = 'Xbox Browser';
            version = '';
            engine = 'Edge';
        }
        // Smart TV Browsers
        else if (ua.includes('tizen')) {
            name = 'Samsung TV Browser';
            engine = 'WebKit';
        }
        else if (ua.includes('webos')) {
            name = 'LG TV Browser';
            engine = 'WebKit';
        }
        // Nintendo
        else if (ua.includes('nintendo')) {
            name = 'Nintendo Browser';
            engine = 'WebKit';
        }
        // Facebook In-App Browser
        else if (ua.includes('fban') || ua.includes('fbav')) {
            name = 'Facebook Browser';
            engine = 'WebKit';
        }
        // Instagram In-App Browser
        else if (ua.includes('instagram')) {
            name = 'Instagram Browser';
            engine = 'WebKit';
        }
        // WeChat
        else if (ua.includes('micromessenger')) {
            name = 'WeChat Browser';
            engine = 'WebKit';
        }
        // Tor Browser
        else if (this.isTorBrowser()) {
            name = 'Tor Browser';
            engine = 'Gecko';
        }

        // Get major version
        const majorVersion = version.split('.')[0];

        return {
            name,
            version,
            majorVersion,
            engine,
            fullName: version ? `${name} ${majorVersion}` : name
        };
    }

    detectOS() {
        const ua = this.uaLower;
        const platform = this.platform.toLowerCase();
        let os = 'Unknown';
        let version = '';
        let architecture = '';

        // iOS Detection (iPhone/iPad/iPod)
        if (ua.includes('iphone') || platform === 'iphone') {
            os = 'iOS';
            const match = ua.match(/os ([\d_]+)/);
            version = match ? match[1].replace(/_/g, '.') : '';
            architecture = 'ARM64';
        }
        else if (ua.includes('ipad') || platform === 'ipad') {
            os = 'iPadOS';
            const match = ua.match(/os ([\d_]+)/);
            version = match ? match[1].replace(/_/g, '.') : '';
            architecture = 'ARM64';
        }
        else if (ua.includes('ipod')) {
            os = 'iOS';
            architecture = 'ARM';
        }
        // Android Detection
        else if (ua.includes('android')) {
            os = 'Android';
            const match = ua.match(/android ([\d.]+)/);
            version = match ? match[1] : '';

            // Detect architecture from CPU info
            if (ua.includes('arm64') || ua.includes('aarch64')) {
                architecture = 'ARM64';
            } else if (ua.includes('arm')) {
                architecture = 'ARM';
            } else if (ua.includes('x86_64')) {
                architecture = 'x86_64';
            } else if (ua.includes('x86')) {
                architecture = 'x86';
            } else {
                architecture = 'ARM'; // Most Android devices
            }
        }
        // macOS Detection
        else if (platform.includes('mac') || ua.includes('mac os')) {
            os = 'macOS';

            // Multiple methods to detect ARM vs Intel
            const cores = navigator.hardwareConcurrency || 0;

            // Method 1: High core count (8+) usually means ARM
            if (cores >= 8) {
                architecture = 'ARM';
            }
            // Method 2: Check GPU via WebGL (if available)
            else if (this.detectAppleSilicon()) {
                architecture = 'ARM';
            }
            // Method 3: Performance timing (ARM is significantly faster)
            else if (cores >= 4 && this.checkPerformanceIndicators()) {
                architecture = 'ARM';
            }
            // Method 4: Default based on platform
            else if (platform === 'MacIntel' && cores < 8) {
                architecture = 'Intel';
            }
            else {
                // Best guess based on year (Macs after 2020 are mostly ARM)
                const currentYear = new Date().getFullYear();
                architecture = currentYear >= 2022 ? 'ARM (likely)' : 'Intel (likely)';
            }
        }
        // Windows Detection
        else if (platform.includes('win') || ua.includes('windows')) {
            architecture = platform.includes('64') ? 'x64' : 'x86';

            if (ua.includes('windows nt 10.0')) {
                // Could be Windows 10 or 11
                if (ua.includes('windows nt 10.0; win64; x64')) {
                    // Check for Windows 11 indicators
                    const canvas = document.createElement('canvas');
                    const gl = canvas.getContext('webgl');
                    if (gl) {
                        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                        if (debugInfo) {
                            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                            // Windows 11 typically has newer GPU drivers
                            os = 'Windows 11';
                        } else {
                            os = 'Windows 10';
                        }
                    } else {
                        os = 'Windows 10/11';
                    }
                } else {
                    os = 'Windows 10';
                }
                version = '10.0';
            }
            else if (ua.includes('windows nt 6.3')) {
                os = 'Windows 8.1';
                version = '6.3';
            }
            else if (ua.includes('windows nt 6.2')) {
                os = 'Windows 8';
                version = '6.2';
            }
            else if (ua.includes('windows nt 6.1')) {
                os = 'Windows 7';
                version = '6.1';
            }
            else if (ua.includes('windows nt 6.0')) {
                os = 'Windows Vista';
                version = '6.0';
            }
            else if (ua.includes('windows nt 5.1')) {
                os = 'Windows XP';
                version = '5.1';
            }
            else {
                os = 'Windows';
            }
        }
        // Linux Detection
        else if (platform.includes('linux') || ua.includes('linux')) {
            // Specific distros
            if (ua.includes('ubuntu')) {
                os = 'Ubuntu';
            } else if (ua.includes('fedora')) {
                os = 'Fedora';
            } else if (ua.includes('debian')) {
                os = 'Debian';
            } else if (ua.includes('arch')) {
                os = 'Arch Linux';
            } else if (ua.includes('manjaro')) {
                os = 'Manjaro';
            } else if (ua.includes('mint')) {
                os = 'Linux Mint';
            } else if (ua.includes('suse')) {
                os = 'openSUSE';
            } else if (ua.includes('cros') || ua.includes('chromebook')) {
                os = 'ChromeOS';
            } else {
                os = 'Linux';
            }

            // Architecture
            if (platform.includes('x86_64') || ua.includes('x86_64')) {
                architecture = 'x86_64';
            } else if (platform.includes('i686')) {
                architecture = 'i686';
            } else if (platform.includes('arm')) {
                architecture = 'ARM';
            }
        }
        // BSD variants
        else if (ua.includes('freebsd')) {
            os = 'FreeBSD';
        }
        else if (ua.includes('openbsd')) {
            os = 'OpenBSD';
        }
        // Gaming consoles
        else if (ua.includes('playstation')) {
            const match = ua.match(/playstation\s(\d)/);
            os = match ? `PlayStation ${match[1]}` : 'PlayStation';
        }
        else if (ua.includes('xbox')) {
            os = 'Xbox';
        }
        else if (ua.includes('nintendo')) {
            os = 'Nintendo Switch';
        }

        return {
            name: os,
            version,
            architecture,
            fullName: version ? `${os} ${version}` : os
        };
    }

    detectDevice() {
        const ua = this.uaLower;
        let type = 'Desktop';
        let model = '';
        let vendor = '';

        // Mobile devices
        if (ua.includes('mobile') || ua.includes('android')) {
            type = 'Mobile';

            // Samsung
            if (ua.includes('samsung')) {
                vendor = 'Samsung';
                const match = ua.match(/samsung\s?([^\/\s;]+)/);
                model = match ? match[1] : 'Galaxy';
            }
            // Xiaomi
            else if (ua.includes('xiaomi') || ua.includes('redmi') || ua.includes('poco')) {
                vendor = 'Xiaomi';
                if (ua.includes('redmi')) model = 'Redmi';
                else if (ua.includes('poco')) model = 'POCO';
                else model = 'Mi';
            }
            // Huawei
            else if (ua.includes('huawei')) {
                vendor = 'Huawei';
            }
            // OnePlus
            else if (ua.includes('oneplus')) {
                vendor = 'OnePlus';
            }
            // Google Pixel
            else if (ua.includes('pixel')) {
                vendor = 'Google';
                model = 'Pixel';
            }
            // iPhone
            else if (ua.includes('iphone')) {
                vendor = 'Apple';
                model = 'iPhone';
                type = 'Mobile';
            }
        }
        // Tablets
        else if (ua.includes('tablet') || ua.includes('ipad') ||
                (ua.includes('android') && !ua.includes('mobile'))) {
            type = 'Tablet';

            if (ua.includes('ipad')) {
                vendor = 'Apple';
                model = 'iPad';
            }
        }
        // Smart TV
        else if (ua.includes('smart-tv') || ua.includes('smarttv') ||
                ua.includes('tizen') || ua.includes('webos')) {
            type = 'Smart TV';

            if (ua.includes('tizen')) {
                vendor = 'Samsung';
            } else if (ua.includes('webos')) {
                vendor = 'LG';
            }
        }
        // Game Console
        else if (ua.includes('playstation') || ua.includes('xbox') ||
                ua.includes('nintendo')) {
            type = 'Game Console';

            if (ua.includes('playstation')) vendor = 'Sony';
            else if (ua.includes('xbox')) vendor = 'Microsoft';
            else if (ua.includes('nintendo')) vendor = 'Nintendo';
        }
        // Wearable
        else if (ua.includes('watch')) {
            type = 'Wearable';

            if (ua.includes('apple')) {
                vendor = 'Apple';
                model = 'Apple Watch';
            }
        }

        // Touch capability
        const hasTouch = 'ontouchstart' in window ||
                        navigator.maxTouchPoints > 0 ||
                        navigator.msMaxTouchPoints > 0;

        return {
            type,
            vendor,
            model,
            hasTouch,
            fullName: vendor && model ? `${vendor} ${model}` : type
        };
    }

    detectSpoofing() {
        const indicators = [];
        const ua = this.uaLower;

        // Check for mismatched platform
        if (this.platform === 'MacIntel' && ua.includes('windows')) {
            indicators.push('Platform/UA mismatch');
        }

        // Check for Chrome on iOS (real iOS uses Safari WebKit)
        if (ua.includes('crios') && this.platform !== 'iPhone' && this.platform !== 'iPad') {
            indicators.push('Chrome iOS on non-iOS platform');
        }

        // Check vendor mismatch
        if (this.vendor === 'Google Inc.' && !ua.includes('chrome') && !ua.includes('chromium')) {
            indicators.push('Google vendor without Chrome');
        }

        // Check for impossible combinations
        if (ua.includes('firefox') && ua.includes('safari')) {
            indicators.push('Multiple browser engines');
        }

        // Check for Tor Browser
        if (this.isTorBrowser()) {
            indicators.push('Tor Browser detected');
        }

        // Check for headless browsers
        if (navigator.webdriver || window.Cypress || window.__SELENIUM_INSPECTOR__) {
            indicators.push('Automated browser detected');
        }

        // User-Agent Switcher detection
        if (ua.includes('user-agent-switcher') || ua.includes('ua-switcher')) {
            indicators.push('UA Switcher extension');
        }

        // Check for missing expected properties
        if (!navigator.plugins || navigator.plugins.length === 0) {
            if (!ua.includes('firefox') && !ua.includes('safari')) {
                indicators.push('No plugins (unusual for this browser)');
            }
        }

        return {
            isSpoofed: indicators.length > 0,
            indicators,
            confidence: indicators.length === 0 ? 'Genuine' :
                       indicators.length === 1 ? 'Possibly Spoofed' :
                       'Likely Spoofed'
        };
    }

    isTorBrowser() {
        // Tor Browser has specific characteristics
        const ua = this.uaLower;
        return ua.includes('firefox') &&
               window.screen.width === 1000 &&
               window.screen.height === 1000 &&
               navigator.plugins.length === 0;
    }

    detectAppleSilicon() {
        // Check GPU for Apple Silicon indicators
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
                    return renderer.toLowerCase().includes('apple');
                }
            }
        } catch {}
        return false;
    }

    checkPerformanceIndicators() {
        // ARM Macs have distinct performance characteristics
        try {
            // Check if we have high-resolution timer
            if (performance && performance.now) {
                // ARM Macs typically have very precise timing
                const start = performance.now();
                for (let i = 0; i < 1000; i++) {
                    Math.sqrt(i);
                }
                const end = performance.now();
                // ARM Macs complete this much faster
                return (end - start) < 0.5;
            }
        } catch {}
        return false;
    }

    getFullAnalysis() {
        return {
            browser: this.browser,
            os: this.os,
            device: this.device,
            spoofing: this.spoofing,
            raw: {
                userAgent: this.ua,
                platform: this.platform,
                vendor: this.vendor
            }
        };
    }

    getSummary() {
        let summary = `${this.browser.fullName} on ${this.os.fullName}`;

        if (this.device.type !== 'Desktop') {
            summary += ` (${this.device.fullName})`;
        }

        if (this.spoofing.isSpoofed) {
            summary += ` [${this.spoofing.confidence}]`;
        }

        return summary;
    }
}

// Export for use
window.UserAgentParser = UserAgentParser;