class BrowserFingerprint {
    constructor() {
        this.fingerprint = {};
        this.dataPoints = 0;
    }

    async collectAll() {
        this.collectBasicInfo();
        this.collectScreenInfo();
        this.collectBrowserFeatures();
        await this.collectCanvasFingerprint();
        this.collectWebGL();
        this.collectAudio();
        this.collectPlugins();
        this.collectFonts();
        this.collectHardware();

        return this.fingerprint;
    }

    collectBasicInfo() {
        const nav = navigator;
        this.fingerprint.userAgent = nav.userAgent;
        this.fingerprint.platform = nav.platform;
        this.fingerprint.language = nav.language;
        this.fingerprint.languages = nav.languages || [];
        this.fingerprint.hardwareConcurrency = nav.hardwareConcurrency || 0;
        this.fingerprint.deviceMemory = nav.deviceMemory || 0;
        this.dataPoints += 6;
    }

    collectScreenInfo() {
        const screen = window.screen;
        this.fingerprint.screenResolution = `${screen.width}x${screen.height}`;
        this.fingerprint.availableResolution = `${screen.availWidth}x${screen.availHeight}`;
        this.fingerprint.colorDepth = screen.colorDepth;
        this.fingerprint.pixelRatio = window.devicePixelRatio || 1;
        this.fingerprint.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.dataPoints += 5;
    }

    collectBrowserFeatures() {
        this.fingerprint.cookiesEnabled = navigator.cookieEnabled;
        this.fingerprint.doNotTrack = navigator.doNotTrack;
        this.fingerprint.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.fingerprint.timezoneOffset = new Date().getTimezoneOffset();

        try {
            sessionStorage.setItem('test', '1');
            sessionStorage.removeItem('test');
            this.fingerprint.sessionStorage = true;
        } catch {
            this.fingerprint.sessionStorage = false;
        }

        try {
            localStorage.setItem('test', '1');
            localStorage.removeItem('test');
            this.fingerprint.localStorage = true;
        } catch {
            this.fingerprint.localStorage = false;
        }

        this.fingerprint.indexedDB = !!window.indexedDB;
        this.dataPoints += 7;
    }

    async collectCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        canvas.width = 280;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = 'top';
        ctx.font = '14px "Arial"';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);

        ctx.fillStyle = '#069';
        ctx.fillText('BrowserLeaks,com <canvas> 1.0', 2, 15);

        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('BrowserLeaks,com <canvas> 1.0', 4, 17);

        const dataURL = canvas.toDataURL();
        this.fingerprint.canvasData = await this.sha256(dataURL);
        this.dataPoints++;
    }

    collectWebGL() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                this.fingerprint.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                this.fingerprint.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                this.dataPoints += 2;
            }
        }
    }

    collectAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const context = new AudioContext();
                this.fingerprint.audioSampleRate = context.sampleRate;
                context.close();
                this.dataPoints++;
            }
        } catch {}
    }

    collectPlugins() {
        const plugins = [];
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                plugins.push(navigator.plugins[i].name);
            }
        }
        this.fingerprint.plugins = plugins;
        this.dataPoints++;
    }

    collectFonts() {
        const fonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
            'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS'
        ];

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const text = 'mmmmmmmmmmlli';
        const baseFont = 'monospace';

        ctx.font = '72px ' + baseFont;
        const baseWidth = ctx.measureText(text).width;

        const detectedFonts = [];
        for (const font of fonts) {
            ctx.font = `72px '${font}', ${baseFont}`;
            if (ctx.measureText(text).width !== baseWidth) {
                detectedFonts.push(font);
            }
        }

        this.fingerprint.fonts = detectedFonts.length;
        this.dataPoints++;
    }

    collectHardware() {
        this.fingerprint.maxTouchPoints = navigator.maxTouchPoints || 0;
        this.fingerprint.vendor = navigator.vendor;
        this.fingerprint.appCodeName = navigator.appCodeName;
        this.fingerprint.product = navigator.product;
        this.dataPoints += 4;
    }

    async sha256(message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async generateRealFingerprint() {
        const fingerprintString = JSON.stringify(this.fingerprint, Object.keys(this.fingerprint).sort());
        const hash = await this.sha256(fingerprintString);
        return hash;
    }
}

function createRadarChart(fp) {
    const svg = document.getElementById('radarChart');
    const width = 400;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = 150;

    // Use real statistics-based calculations
    const categories = [
        { label: 'Browser', value: calculateRealBrowserScore(fp), icon: '🌐' },
        { label: 'OS', value: calculateRealSystemScore(fp), icon: '💻' },
        { label: 'Screen', value: calculateRealScreenScore(fp), icon: '📱' },
        { label: 'Canvas', value: calculateRealCanvasScore(fp), icon: '🎨' },
        { label: 'WebGL', value: calculateRealWebGLScore(fp), icon: '🎮' },
        { label: 'Audio', value: calculateRealAudioScore(fp), icon: '🔊' },
        { label: 'Hardware', value: calculateRealHardwareScore(fp), icon: '🔧' },
        { label: 'Plugins', value: calculateRealPluginsScore(fp), icon: '🔌' }
    ];

    const angleStep = (Math.PI * 2) / categories.length;

    // Clear SVG
    svg.innerHTML = '';

    // Create background group
    const bgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bgGroup.setAttribute('class', 'radar-background');

    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', (maxRadius * i) / 5);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(139, 146, 185, 0.2)');
        circle.setAttribute('stroke-width', '1');
        bgGroup.appendChild(circle);

        // Add percentage labels
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx + 5);
        text.setAttribute('y', cy - (maxRadius * i) / 5 + 5);
        text.setAttribute('fill', 'rgba(139, 146, 185, 0.5)');
        text.setAttribute('font-size', '10');
        text.textContent = (i * 20) + '%';
        bgGroup.appendChild(text);
    }

    // Draw axes
    categories.forEach((cat, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * maxRadius;
        const y = cy + Math.sin(angle) * maxRadius;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx);
        line.setAttribute('y1', cy);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(139, 146, 185, 0.3)');
        line.setAttribute('stroke-width', '1');
        bgGroup.appendChild(line);

        // Add labels
        const labelX = cx + Math.cos(angle) * (maxRadius + 25);
        const labelY = cy + Math.sin(angle) * (maxRadius + 25);

        const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        icon.setAttribute('x', labelX);
        icon.setAttribute('y', labelY - 5);
        icon.setAttribute('text-anchor', 'middle');
        icon.setAttribute('font-size', '16');
        icon.textContent = cat.icon;

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY + 10);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#8b92b9');
        label.setAttribute('font-size', '11');
        label.textContent = cat.label;

        labelGroup.appendChild(icon);
        labelGroup.appendChild(label);
        bgGroup.appendChild(labelGroup);
    });

    svg.appendChild(bgGroup);

    // Draw average polygon (50% line)
    const avgPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const avgPoints = categories.map((cat, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = maxRadius * 0.5; // 50% average
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return `${x},${y}`;
    }).join(' ');

    avgPolygon.setAttribute('points', avgPoints);
    avgPolygon.setAttribute('fill', 'rgba(139, 146, 185, 0.1)');
    avgPolygon.setAttribute('stroke', 'rgba(139, 146, 185, 0.5)');
    avgPolygon.setAttribute('stroke-width', '2');
    avgPolygon.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(avgPolygon);

    // Draw user polygon
    const userPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const userPoints = categories.map((cat, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (maxRadius * cat.value) / 100;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return `${x},${y}`;
    }).join(' ');

    userPolygon.setAttribute('points', userPoints);
    userPolygon.setAttribute('fill', 'rgba(0, 212, 255, 0.2)');
    userPolygon.setAttribute('stroke', '#00d4ff');
    userPolygon.setAttribute('stroke-width', '2');
    userPolygon.setAttribute('class', 'user-polygon');
    svg.appendChild(userPolygon);

    // Draw data points with tooltips
    categories.forEach((cat, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (maxRadius * cat.value) / 100;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'data-point');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#00d4ff');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1');

        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('class', 'tooltip');
        tooltip.style.display = 'none';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 30);
        rect.setAttribute('y', y - 25);
        rect.setAttribute('width', '60');
        rect.setAttribute('height', '20');
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 10);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '12');
        text.textContent = `${cat.value}%`;

        tooltip.appendChild(rect);
        tooltip.appendChild(text);

        g.appendChild(circle);
        g.appendChild(tooltip);

        // Mouse events
        circle.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            circle.setAttribute('r', '6');
        });

        circle.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
            circle.setAttribute('r', '4');
        });

        svg.appendChild(g);
    });

    // Add animation
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .user-polygon {
            animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.8);
                transform-origin: center;
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .data-point circle {
            cursor: pointer;
            transition: all 0.2s;
        }
    `;
    svg.appendChild(style);

    // Calculate overall uniqueness
    const avgScore = categories.reduce((sum, cat) => sum + cat.value, 0) / categories.length;
    return avgScore;
}

// These functions are now in fingerprint-scores.js
// Removed duplicate implementations

function displayKeyInfo(fp) {
    const keyInfoDiv = document.getElementById('keyInfo');

    // Better OS detection using UserAgent + Platform
    const realOS = detectRealOS(fp.userAgent, fp.platform, fp.hardwareConcurrency);

    const keyData = [
        {
            icon: '💻',
            label: 'System',
            value: realOS,
            protection: realOS.includes('Windows') ? '✅ Common' : '⚠️ Use Windows to blend in'
        },
        {
            icon: '🌐',
            label: 'Browser',
            value: getBrowserName(fp.userAgent),
            protection: getBrowserName(fp.userAgent).toLowerCase().includes('chrome') ? '✅ Common' : '⚠️ Chrome = 66% of users'
        },
        {
            icon: '📱',
            label: 'Screen',
            value: fp.screenResolution,
            protection: fp.screenResolution === '1920x1080' ? '✅ Common resolution' : '⚠️ Resize to 1920x1080'
        },
        {
            icon: '🌍',
            label: 'Timezone',
            value: fp.timezone,
            protection: '💡 Align with your VPN if used'
        },
        {
            icon: '🎨',
            label: 'GPU',
            value: detectGPUType(fp.webglRenderer),
            protection: fp.webglRenderer ? '⚠️ WebGL reveals your GPU' : '✅ Hidden'
        },
        {
            icon: '🔋',
            label: 'CPU Cores',
            value: fp.hardwareConcurrency + ' threads',
            protection: '❌ Cannot be effectively hidden'
        }
    ];

    keyInfoDiv.innerHTML = keyData.map(item => `
        <div class="key-item">
            <span class="key-icon">${item.icon}</span>
            <div class="key-details">
                <span class="key-label">${item.label}</span>
                <span class="key-value">${item.value}</span>
                <span class="key-protection">${item.protection}</span>
            </div>
        </div>
    `).join('');
}

function detectRealOS(userAgent, platform, cores) {
    // Use the new parser
    const parser = new UserAgentParser(userAgent, platform, navigator.vendor);
    const analysis = parser.getFullAnalysis();

    // Simple format: OS + Architecture
    if (analysis.os.architecture) {
        return `${analysis.os.name} ${analysis.os.architecture}`;
    }

    // Add spoofing indicator if detected
    if (analysis.spoofing.isSpoofed) {
        return `${analysis.os.name} [Spoofed]`;
    }

    return analysis.os.name;
}

function getBrowserName(userAgent) {
    // Use the new parser
    const parser = new UserAgentParser(userAgent, navigator.platform, navigator.vendor);
    const analysis = parser.getFullAnalysis();

    // Return detailed browser with version
    let browserName = analysis.browser.fullName;

    // Add device type if not desktop
    if (analysis.device.type !== 'Desktop') {
        browserName += ` (${analysis.device.type})`;
    }

    // Add spoofing warning if detected
    if (analysis.spoofing.isSpoofed) {
        browserName += ' ⚠️';
    }

    return browserName;
}

function detectGPUType(renderer) {
    if (!renderer) return 'Masqué';

    // Check for Apple GPU (M1/M2/M3)
    if (renderer.includes('Apple')) {
        if (renderer.includes('M1')) return 'Apple M1 GPU';
        if (renderer.includes('M2')) return 'Apple M2 GPU';
        if (renderer.includes('M3')) return 'Apple M3 GPU';
        return 'Apple Silicon GPU';
    }

    // Check for other GPUs
    if (renderer.includes('Intel')) return 'Intel Graphics';
    if (renderer.includes('AMD')) return 'AMD GPU';
    if (renderer.includes('NVIDIA')) return 'NVIDIA GPU';

    return 'Détecté';
}

function calculatePrivacyScore(fp) {
    let score = 100;

    if (fp.cookiesEnabled) score -= 10;
    if (fp.localStorage) score -= 10;
    if (fp.webglRenderer) score -= 15;
    if (fp.plugins.length > 0) score -= 10;
    if (!fp.doNotTrack || fp.doNotTrack === 'unspecified') score -= 10;
    if (fp.fonts > 5) score -= 10;
    if (fp.touchSupport && fp.platform.includes('Mac')) score -= 5;

    score = Math.max(0, score);

    const scoreBar = document.getElementById('privacyScore');
    const scoreText = document.getElementById('privacyText');

    scoreBar.style.width = score + '%';

    if (score >= 70) {
        scoreBar.style.background = 'var(--success)';
        scoreText.textContent = 'High protection';
        scoreText.style.color = 'var(--success)';
    } else if (score >= 40) {
        scoreBar.style.background = 'var(--warning)';
        scoreText.textContent = 'Medium protection';
        scoreText.style.color = 'var(--warning)';
    } else {
        scoreBar.style.background = 'var(--danger)';
        scoreText.textContent = 'Low protection';
        scoreText.style.color = 'var(--danger)';
    }

    return score;
}

function populateTechnicalDetails(fp) {
    // Parse and display detailed user agent
    const parser = new UserAgentParser(fp.userAgent, fp.platform, navigator.vendor);
    const analysis = parser.getFullAnalysis();

    // Helper function to add protection tips
    function addProtectionTip(elementId, value, tip) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `${value}<br><small class="protection-tip">${tip}</small>`;
        }
    }

    // Show parsed info with protection tips
    addProtectionTip('userAgent', parser.getSummary(),
        '💡 User-Agent Switcher pour simuler Chrome');

    addProtectionTip('platform', `${fp.platform} (${analysis.os.architecture || 'Unknown arch'})`,
        '⚠️ Hard to hide, use a VM');

    addProtectionTip('language', fp.language,
        fp.language === 'en-US' ? '✅ Common language' : '💡 Change to en-US in settings');

    addProtectionTip('languages', fp.languages.join(', ') || 'N/A',
        '💡 about:config → intl.accept_languages');

    addProtectionTip('hardwareConcurrency', fp.hardwareConcurrency + ' cores',
        '❌ Cannot hide, accept this value');

    addProtectionTip('deviceMemory', fp.deviceMemory ? fp.deviceMemory + ' GB' : 'N/A',
        '❌ Hardware direct, non modifiable');

    addProtectionTip('screenResolution', fp.screenResolution,
        fp.screenResolution === '1920x1080' ? '✅ Common resolution' : '💡 Press F11 to exit fullscreen, resize window');

    addProtectionTip('availableResolution', fp.availableResolution,
        '💡 Ne maximisez jamais votre fenêtre');

    addProtectionTip('colorDepth', fp.colorDepth + ' bits',
        '✅ Standard for most screens');

    addProtectionTip('pixelRatio', fp.pixelRatio + 'x',
        fp.pixelRatio === 1 ? '✅ Standard' : '💡 100% zoom recommended');

    addProtectionTip('touchSupport', fp.touchSupport ? 'Oui' : 'Non',
        '💡 Touch on desktop = rare and identifying');

    addProtectionTip('cookiesEnabled', fp.cookiesEnabled ? 'Yes' : 'No',
        fp.cookiesEnabled ? '⚠️ Necessary but trackable' : '✅ Protection but broken sites');

    addProtectionTip('doNotTrack', fp.doNotTrack || 'Not set',
        '💡 DNT = paradoxically more unique!');

    addProtectionTip('timezone', fp.timezone,
        '💡 Change system timezone if VPN used');

    addProtectionTip('timezoneOffset', fp.timezoneOffset + ' minutes',
        '💡 Must match your apparent IP location');

    addProtectionTip('sessionStorage', fp.sessionStorage ? 'Available' : 'Blocked',
        '⚠️ Bloquer = sites modernes cassés');

    addProtectionTip('localStorage', fp.localStorage ? 'Available' : 'Blocked',
        '⚠️ Blocking = loss of site preferences');

    addProtectionTip('indexedDB', fp.indexedDB ? 'Available' : 'Not available',
        '💡 Can be disabled without much impact');

    const canvasEl = document.getElementById('fingerprintCanvas');
    if (canvasEl) {
        const ctx = canvasEl.getContext('2d');
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Canvas Fingerprint Test', 2, 15);
    }

    addProtectionTip('canvasHash', fp.canvasData ? fp.canvasData.substring(0, 16) + '...' : 'N/A',
        fp.canvasData ? '⚠️ 99.5% unique! Canvas Blocker or Firefox RFP' : '✅ Canvas blocked but you are rare!');

    addProtectionTip('webglVendor', fp.webglVendor || 'Hidden',
        fp.webglVendor ? '💡 webgl.disabled=true in about:config' : '✅ WebGL hidden');

    addProtectionTip('webglRenderer', fp.webglRenderer ? fp.webglRenderer.substring(0, 30) + '...' : 'Hidden',
        fp.webglRenderer ? '⚠️ Reveals your exact GPU' : '✅ GPU hidden');

    addProtectionTip('audioContext', fp.audioSampleRate ? `${fp.audioSampleRate} Hz` : 'Not supported',
        fp.audioSampleRate === 44100 ? '✅ Common rate' : '💡 Hard to change without breaking audio');

    addProtectionTip('plugins', fp.plugins.length > 0 ? fp.plugins.length + ' plugin(s)' : 'None',
        fp.plugins.length === 0 ? '✅ No plugins = normal in 2024' : '⚠️ Plugins = red flag, uninstall!');

    addProtectionTip('fonts', fp.fonts + ' fonts detected',
        fp.fonts > 10 ? '⚠️ Uninstall custom fonts' : '✅ Few fonts = less identifiable');
}

async function initFingerprinting() {
    console.log('Starting fingerprinting...');

    // Check for Firefox resistFingerprinting
    const isFirefoxRFP = navigator.userAgent.includes('Firefox') &&
                         window.innerWidth === window.outerWidth &&
                         window.innerHeight === window.outerHeight &&
                         new Date().getTimezoneOffset() === 0;

    if (isFirefoxRFP) {
        console.log('Firefox resistFingerprinting detected!');
        document.getElementById('error-indicator').style.display = 'block';
        document.getElementById('error-indicator').innerHTML =
            '🦊 <strong>Firefox Enhanced Protection Detected!</strong><br>' +
            'Firefox\'s resistFingerprinting is active.<br>' +
            'Your fingerprint is generic like all Firefox RFP users.';
    }

    try {
        // Test if basic APIs work
        if (typeof navigator === 'undefined' || !navigator.userAgent) {
            throw new Error('Navigator API blocked');
        }

        const fp = new BrowserFingerprint();
        const data = await fp.collectAll();

        console.log('Collected data:', data);
        console.log('Canvas data:', data.canvasData);
        console.log('WebGL:', data.webglRenderer);
        console.log('Plugins:', data.plugins);
        console.log('Fonts:', data.fonts);
        console.log('Audio:', data.audioSampleRate);

        // Count how many features are blocked
        let blockedCount = 0;
        if (!data.canvasData) blockedCount++;
        if (!data.webglRenderer) blockedCount++;
        if (!data.plugins || data.plugins.length === 0) blockedCount++;
        if (data.fonts === 0) blockedCount++;
        if (!data.audioSampleRate) blockedCount++;

        console.log('Blocked features count:', blockedCount);

        // If 3 or more features are blocked, show warning
        if (blockedCount >= 3) {
            console.log('Many features blocked, showing warning');
            document.getElementById('error-indicator').style.display = 'block';
            document.getElementById('error-indicator').innerHTML =
                '⚠️ <strong>Partial Fingerprinting Block Detected!</strong><br>' +
                blockedCount + ' out of 5 tracking features are blocked by your browser.<br>' +
                'Some data may be incomplete.';
        }

        const hash = await fp.generateRealFingerprint();

        // Check if fingerprinting is being blocked
        if (!hash || hash === 'undefined' || Object.keys(data).length < 5) {
            throw new Error('Fingerprinting appears to be blocked');
        }

        document.getElementById('fingerprintHash').textContent = hash.substring(0, 16) + '...' + hash.substring(hash.length - 16);

        // Hide error indicator if everything works
        document.getElementById('error-indicator').style.display = 'none';

        // Create radar chart
        const avgScore = createRadarChart(data);
    const allScores = [
        calculateRealBrowserScore(data),
        calculateRealSystemScore(data),
        calculateRealScreenScore(data),
        calculateRealCanvasScore(data),
        calculateRealWebGLScore(data),
        calculateRealAudioScore(data),
        calculateRealHardwareScore(data),
        calculateRealLanguageScore(data),
        calculateRealTimezoneScore(data),
        calculateRealPluginsScore(data),
        calculateRealFontsScore(data),
        calculateRealStorageScore(data)
    ];

    const entropyBits = calculateOverallEntropy(allScores);
    const uniquenessText = `${entropyBits} bits of entropy • 1 in ${Math.pow(2, entropyBits).toExponential(1)} chance of being identical`;
    document.getElementById('uniqueness').textContent = uniquenessText;

    displayKeyInfo(data);
    calculatePrivacyScore(data);
    populateTechnicalDetails(data);

    return data;
    } catch (error) {
        console.error('Fingerprinting error:', error);

        // Show error indicator
        document.getElementById('error-indicator').style.display = 'block';
        document.getElementById('fingerprintHash').textContent = 'BLOCKED';
        document.getElementById('uniqueness').textContent = 'Privacy protection active';

        // Set default values for UI
        document.getElementById('privacyScore').style.width = '100%';
        document.getElementById('privacyScore').style.background = 'var(--success)';
        document.getElementById('privacyText').textContent = 'Maximum protection (blocked)';

        return {};
    }
}

function populateTechnicalDetails(data) {
    // System Info
    document.getElementById('userAgent').textContent = data.userAgent || '-';
    document.getElementById('platform').textContent = data.platform || '-';
    document.getElementById('language').textContent = data.language || '-';
    document.getElementById('languages').textContent = data.languages.join(', ') || '-';
    document.getElementById('hardwareConcurrency').textContent = data.hardwareConcurrency + ' cores' || '-';
    document.getElementById('deviceMemory').textContent = data.deviceMemory ? data.deviceMemory + ' GB' : '-';

    // Screen Info
    document.getElementById('screenResolution').textContent = data.screenResolution || '-';
    document.getElementById('availableResolution').textContent = data.availableResolution || '-';
    document.getElementById('colorDepth').textContent = data.colorDepth + ' bits' || '-';
    document.getElementById('pixelRatio').textContent = data.pixelRatio || '-';
    document.getElementById('touchSupport').textContent = data.touchSupport ? 'Yes' : 'No';

    // Browser Info
    document.getElementById('cookiesEnabled').textContent = data.cookiesEnabled ? 'Yes' : 'No';
    document.getElementById('doNotTrack').textContent = data.doNotTrack || 'Not set';
    document.getElementById('timezone').textContent = data.timezone || '-';
    document.getElementById('timezoneOffset').textContent = data.timezoneOffset + ' minutes' || '-';
    document.getElementById('sessionStorage').textContent = data.sessionStorage ? 'Enabled' : 'Disabled';
    document.getElementById('localStorage').textContent = data.localStorage ? 'Enabled' : 'Disabled';
    document.getElementById('indexedDB').textContent = data.indexedDB ? 'Enabled' : 'Disabled';

    // Canvas
    document.getElementById('canvasHash').textContent = data.canvasData ? data.canvasData.substring(0, 16) + '...' : 'Blocked';

    // WebGL & Audio
    document.getElementById('webglVendor').textContent = data.webglVendor || 'Not available';
    document.getElementById('webglRenderer').textContent = data.webglRenderer || 'Not available';
    document.getElementById('audioContext').textContent = data.audioSampleRate ? data.audioSampleRate + ' Hz' : 'Not available';

    // Plugins & Fonts
    document.getElementById('plugins').textContent = data.plugins.length + ' detected';
    document.getElementById('fonts').textContent = data.fonts || 'Detection blocked';

    // Draw canvas fingerprint
    const canvas = document.getElementById('fingerprintCanvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Canvas Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas Fingerprint', 4, 17);
}

function checkPrivacy() {
    const tips = [
        "AdsPower or Multilogin: Pro anti-detection browsers with multi-profiles",
        "Firefox about:config: privacy.resistFingerprinting = true",
        "Canvas Defender: Poison > Block (add noise, don't block)",
        "WebGL disabled + WebRTC disabled = IP and GPU leaks blocked",
        "VM with QEMU/KVM + GPU passthrough for native Canvas",
        "Chain: Tails/Whonix → VPN multi-hop → SOCKS5 → Tor",
        "AudioContext Fingerprint Defender for audio scrambling",
        "Never custom fonts, only standard web fonts",
        "New identity/session/profile for each site"
    ];

    const modal = document.createElement('div');
    modal.className = 'privacy-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🔒 Protection Hardcore</h3>
            <ul class="privacy-tips">
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// Fonction pour copier les configs
function copyConfig(element) {
    const code = element.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        // Feedback visuel
        const original = element.style.background;
        element.style.background = 'rgba(0, 212, 255, 0.2)';
        setTimeout(() => {
            element.style.background = original;
        }, 200);
    });
}

document.addEventListener('DOMContentLoaded', initFingerprinting);