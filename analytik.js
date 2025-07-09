/**
 * Analytik - Advanced Auto-Tracking Library
 * Features: Persistent device fingerprinting, comprehensive tracking, Discord webhook integration
 * Version: 1.0.0
 * License: MIT
 */

(function(window, document) {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        // Discord Settings
        webhook: null,
        discordBotName: "Analytics Bot",
        discordBotAvatar: "https://cdn.discordapp.com/embed/avatars/0.png",
        discordEmbedColor: 0x00d4aa,
        
        // Tracking Controls
        trackPageViews: true,
        trackClicks: true,
        trackScrolling: true,
        trackMouse: false,
        trackForms: true,
        trackGeolocation: false,
        trackPerformance: true,
        trackErrors: true,
        trackUserBehavior: true,
        trackContent: true,
        trackSearch: true,
        trackEcommerce: false,
        trackMedia: true,
        trackDownloads: true,
        trackPrint: false,
        trackClipboard: false,
        
        // Fingerprinting Settings
        enableFingerprinting: true,
        fingerprintPersistence: true,
        fingerprintComponents: {
            hardware: true,
            browser: true,
            network: true,
            behavioral: true,
            canvas: true,
            webgl: true,
            audio: true,
            fonts: true
        },
        
        // Geolocation Settings
        geolocationAccuracy: "high",
        geolocationTimeout: 10000,
        geolocationMaxAge: 600000,
        includeMapLinks: true,
        
        // Privacy & Compliance
        respectDNT: true,
        anonymizeIP: true,
        maskPII: true,
        requireConsent: false,
        consentCookieName: "analytics_consent",
        
        // Performance & Behavior
        samplingRate: 1.0,
        batchSize: 10,
        maxRetries: 3,
        offlineStorage: true,
        compressionEnabled: true,
        
        // Advanced Features
        enableSessionReplay: false,
        enableABTesting: true,
        enableFunnelTracking: true,
        enableBotDetection: true,
        enableFraudDetection: true,
        
        // Discord Message Settings
        embedStyle: "rich",
        includeTimestamps: true,
        includeUserAgent: true,
        includeReferrer: true,
        maxMessageLength: 2000,
        
        // Filtering & Exclusions
        excludeElements: ['.sensitive', '#password', '.private'],
        excludePages: ['/admin', '/private'],
        excludeUsers: ['bot', 'crawler'],
        includeTestTraffic: false,
        
        // Alert Thresholds
        alertOnErrors: true,
        alertOnHighTraffic: 1000,
        alertOnSuspiciousActivity: true,
        
        // Debugging
        debug: false,
        verbose: false,
        console: false
    };

    // Word lists for fingerprint labels
    const ADJECTIVES = [
        'Super', 'Quick', 'Silent', 'Wild', 'Dark', 'Bright', 'Strong', 'Fast', 'Cool', 'Smart',
        'Bold', 'Swift', 'Stealth', 'Mystic', 'Noble', 'Fierce', 'Wise', 'Sharp', 'Brave', 'Calm'
    ];

    const ANIMALS = [
        'Lion', 'Eagle', 'Wolf', 'Tiger', 'Bear', 'Fox', 'Hawk', 'Shark', 'Dragon', 'Panther',
        'Falcon', 'Lynx', 'Raven', 'Cobra', 'Viper', 'Jaguar', 'Puma', 'Cheetah', 'Leopard', 'Rhino'
    ];

    class DiscordAnalytics {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.fingerprint = null;
            this.fingerprintLabel = null;
            this.eventQueue = [];
            this.isOnline = navigator.onLine;
            this.sessionId = this.generateSessionId();
            this.sessionStart = Date.now();
            this.pageLoadTime = Date.now();
            this.userLocation = null;
            this.behaviorData = {
                clicks: 0,
                scrollDepth: 0,
                timeSpent: 0,
                interactions: []
            };
            
            // Advanced features state
            this.abTests = new Map();
            this.funnels = new Map();
            this.botScore = 0;
            this.fraudScore = 0;
            this.searchData = [];
            this.contentEngagement = new Map();
            this.networkProfile = {};
            this.behaviorProfile = {
                typingPatterns: [],
                mousePatterns: [],
                clickPatterns: []
            };
            this.userJourney = [];
            this.sessionReplayData = [];

            this.init();
        }

        init() {
            if (!this.config.webhook) {
                this.log('Discord webhook URL is required', 'error');
                return;
            }

            if (this.config.respectDNT && navigator.doNotTrack === '1') {
                this.log('Do Not Track is enabled, analytics disabled');
                return;
            }

            if (this.config.requireConsent && !this.hasConsent()) {
                this.log('User consent required but not given');
                return;
            }

            this.generateFingerprint().then(() => {
            this.setupEventListeners();
                this.startTracking();
                this.requestGeolocation();
                
                // Initialize advanced features
                this.initBotDetection();
                this.initFraudDetection();
                this.setupSearchTracking();
                this.setupContentTracking();
                this.initNetworkFingerprinting();
                this.initBehavioralFingerprinting();
                this.initUserJourney();
                this.initSessionReplay();
                this.initABTesting();
                this.initFunnelTracking();
            });
        }

        // Fingerprinting System
        async generateFingerprint() {
            if (!this.config.enableFingerprinting) return;

            const components = {};

            if (this.config.fingerprintComponents.hardware) {
                components.hardware = await this.getHardwareFingerprint();
            }

            if (this.config.fingerprintComponents.browser) {
                components.browser = this.getBrowserFingerprint();
            }

            if (this.config.fingerprintComponents.canvas) {
                components.canvas = this.getCanvasFingerprint();
            }

            if (this.config.fingerprintComponents.webgl) {
                components.webgl = this.getWebGLFingerprint();
            }

            if (this.config.fingerprintComponents.audio) {
                components.audio = await this.getAudioFingerprint();
            }

            if (this.config.fingerprintComponents.fonts) {
                components.fonts = this.getFontFingerprint();
            }

            // Combine all components into a hash
            const fingerprintString = JSON.stringify(components);
            this.fingerprint = await this.hashString(fingerprintString);
            
            // Generate or retrieve fingerprint label
            this.fingerprintLabel = this.getFingerprintLabel(this.fingerprint);
            
            // Store fingerprint persistently
            if (this.config.fingerprintPersistence) {
                this.storeFingerprintPersistently();
            }

            this.log(`Device fingerprint generated: ${this.fingerprintLabel} (${this.fingerprint.substring(0, 8)}...)`);
        }

        async getHardwareFingerprint() {
            const hardware = {
                screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                platform: navigator.platform,
                hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
                deviceMemory: navigator.deviceMemory || 'unknown',
                maxTouchPoints: navigator.maxTouchPoints || 0
            };

            // Battery API if available
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    hardware.battery = {
                        charging: battery.charging,
                        level: Math.round(battery.level * 100)
                    };
                } catch (e) {
                    // Battery API not available
                }
            }

            return hardware;
        }

        getBrowserFingerprint() {
            return {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                plugins: Array.from(navigator.plugins).map(p => p.name).sort(),
                mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type).sort()
            };
        }

        getCanvasFingerprint() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 50;

                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = '#069';
                ctx.fillText('Discord Analytics 🔥', 2, 15);
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.fillText('Fingerprint Test', 4, 35);

                return canvas.toDataURL();
            } catch (e) {
                return 'canvas_error';
            }
        }

        getWebGLFingerprint() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) return 'no_webgl';

                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return {
                    vendor: gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL || gl.VENDOR),
                    renderer: gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER),
                    version: gl.getParameter(gl.VERSION),
                    shaderVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                };
            } catch (e) {
                return 'webgl_error';
            }
        }

        async getAudioFingerprint() {
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = context.createOscillator();
                const analyser = context.createAnalyser();
                const gainNode = context.createGain();
                
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(10000, context.currentTime);
                
                gainNode.gain.setValueAtTime(0, context.currentTime);
                oscillator.connect(analyser);
                analyser.connect(gainNode);
                gainNode.connect(context.destination);
                
                oscillator.start(0);
                
                const samples = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(samples);
                
                oscillator.stop();
                context.close();
                
                return Array.from(samples).slice(0, 50).join(',');
            } catch (e) {
                return 'audio_error';
            }
        }

        getFontFingerprint() {
            const testFonts = [
                'Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Palatino',
                'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
            ];

            const baseFonts = ['monospace', 'sans-serif', 'serif'];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const testString = 'mmmmmmmmmmlli';
            const testSize = '72px';
            const h = {};

            const defaultWidth = {};
            const defaultHeight = {};

            baseFonts.forEach(baseFont => {
                ctx.font = testSize + ' ' + baseFont;
                defaultWidth[baseFont] = ctx.measureText(testString).width;
                defaultHeight[baseFont] = ctx.measureText(testString).actualBoundingBoxHeight || 0;
            });

            return testFonts.filter(font => {
                return baseFonts.some(baseFont => {
                    ctx.font = testSize + ' ' + font + ',' + baseFont;
                    const matched = ctx.measureText(testString).width !== defaultWidth[baseFont] ||
                                   (ctx.measureText(testString).actualBoundingBoxHeight || 0) !== defaultHeight[baseFont];
                    return matched;
                });
            });
        }

        async hashString(str) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        getFingerprintLabel(fingerprint) {
            // Check if we already have a label for this fingerprint
            const stored = this.getStoredFingerprintLabel(fingerprint);
            if (stored) return stored;

            // Generate new label
            let attempts = 0;
            let label;
            
            do {
                const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
                const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
                const number = Math.floor(Math.random() * 9000) + 1000;
                label = `${adjective}${animal}${number}`;
                attempts++;
            } while (this.isLabelInUse(label) && attempts < 10);

            this.storeFingerprintLabel(fingerprint, label);
            return label;
        }

        storeFingerprintPersistently() {
            const data = {
                fingerprint: this.fingerprint,
                label: this.fingerprintLabel,
                timestamp: Date.now()
            };

            // Store in multiple locations for persistence
            try {
                localStorage.setItem('da_fp', JSON.stringify(data));
                sessionStorage.setItem('da_fp', JSON.stringify(data));
                
                // IndexedDB storage
                this.storeInIndexedDB(data);
                
                // Cookie storage
                document.cookie = `da_fp=${encodeURIComponent(JSON.stringify(data))}; expires=${new Date(Date.now() + 365*24*60*60*1000).toUTCString()}; path=/`;
            } catch (e) {
                this.log('Failed to store fingerprint persistently', 'error');
            }
        }

        async storeInIndexedDB(data) {
            try {
                const request = indexedDB.open('DiscordAnalytics', 1);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('fingerprints')) {
                        db.createObjectStore('fingerprints', { keyPath: 'fingerprint' });
                    }
                };

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['fingerprints'], 'readwrite');
                    const store = transaction.objectStore('fingerprints');
                    store.put(data);
                };
            } catch (e) {
                // IndexedDB not available
            }
        }

        getStoredFingerprintLabel(fingerprint) {
            try {
                // Try localStorage first
                const stored = localStorage.getItem('da_fp');
                if (stored) {
                    const data = JSON.parse(stored);
                    if (data.fingerprint === fingerprint) {
                        return data.label;
                    }
                }
            } catch (e) {
                // Continue to other storage methods
            }
            
            return null;
        }

        storeFingerprintLabel(fingerprint, label) {
            try {
                const labels = JSON.parse(localStorage.getItem('da_labels') || '{}');
                labels[fingerprint] = label;
                localStorage.setItem('da_labels', JSON.stringify(labels));
            } catch (e) {
                // Storage not available
            }
        }

        isLabelInUse(label) {
            try {
                const labels = JSON.parse(localStorage.getItem('da_labels') || '{}');
                return Object.values(labels).includes(label);
            } catch (e) {
                return false;
            }
        }

        // Geolocation
        requestGeolocation() {
            if (!this.config.trackGeolocation || !navigator.geolocation) return;

            const options = {
                enableHighAccuracy: this.config.geolocationAccuracy === 'high',
                timeout: this.config.geolocationTimeout,
                maximumAge: this.config.geolocationMaxAge
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    this.log(`Location obtained: ${this.userLocation.latitude}, ${this.userLocation.longitude}`);
                },
                (error) => {
                    this.log(`Geolocation error: ${error.message}`, 'warn');
                },
                options
            );
        }

        // Event Tracking Setup
        setupEventListeners() {
            // Page visibility
            document.addEventListener('visibilitychange', () => {
                this.trackPageVisibility();
            });

            // Page unload
            window.addEventListener('beforeunload', () => {
                this.endSession();
                this.trackPageExit();
            });

            // Online/offline status
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.flushOfflineEvents();
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
            });

            // Click tracking
            if (this.config.trackClicks) {
                document.addEventListener('click', (e) => {
                    this.trackClick(e);
                });
            }

            // Scroll tracking
            if (this.config.trackScrolling) {
                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.trackScroll();
                    }, 100);
                });
            }

            // Form tracking
            if (this.config.trackForms) {
                document.addEventListener('submit', (e) => {
                    this.trackFormSubmission(e);
                });

                document.addEventListener('input', (e) => {
                    if (e.target.matches('input, textarea, select')) {
                        this.trackFormInteraction(e);
                    }
                });
            }

            // Error tracking
            if (this.config.trackErrors) {
                window.addEventListener('error', (e) => {
                    this.trackError(e);
                });

                window.addEventListener('unhandledrejection', (e) => {
                    this.trackPromiseRejection(e);
                });
            }

            // Performance tracking
            if (this.config.trackPerformance) {
                window.addEventListener('load', () => {
                    this.trackPerformance();
                });
            }

            // Media tracking
            if (this.config.trackMedia) {
                this.setupMediaTracking();
            }

            // Download tracking
            if (this.config.trackDownloads) {
                this.setupDownloadTracking();
            }

            // Mouse tracking
            if (this.config.trackMouse) {
                this.setupMouseTracking();
            }

            // Print tracking
            if (this.config.trackPrint) {
                window.addEventListener('beforeprint', () => {
                    this.trackPrint();
                });
            }

            // Clipboard tracking
            if (this.config.trackClipboard) {
                document.addEventListener('copy', (e) => {
                    this.trackClipboard('copy', e);
                });

                document.addEventListener('paste', (e) => {
                    this.trackClipboard('paste', e);
                });
            }
        }

        startTracking() {
            // Track initial page view
            if (this.config.trackPageViews) {
                this.trackPageView();
            }

            // Start behavior tracking
            if (this.config.trackUserBehavior) {
                this.startBehaviorTracking();
            }
        }

        // Tracking Methods
        trackPageView() {
            const event = {
                type: 'page_view',
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                location: this.userLocation
            };

            this.sendEvent(event);
        }

        trackClick(event) {
            if (this.isExcludedElement(event.target)) return;

            const element = event.target;
            const rect = element.getBoundingClientRect();
            
            const clickData = {
                type: 'click',
                element: {
                    tag: element.tagName.toLowerCase(),
                    id: element.id,
                    className: element.className,
                    text: element.textContent?.substring(0, 100),
                    href: element.href,
                    position: {
                        x: Math.round(rect.left + rect.width / 2),
                        y: Math.round(rect.top + rect.height / 2)
                    }
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname,
                location: this.userLocation
            };

            this.behaviorData.clicks++;
            this.sendEvent(clickData);
        }

        trackScroll() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > this.behaviorData.scrollDepth) {
                this.behaviorData.scrollDepth = scrollPercent;

                const event = {
                    type: 'scroll',
                    depth: scrollPercent,
                    timestamp: Date.now(),
                    fingerprint: this.fingerprintLabel,
                    sessionId: this.sessionId,
                    page: window.location.pathname
                };

                this.sendEvent(event);
            }
        }

        trackFormSubmission(event) {
            if (this.isExcludedElement(event.target)) return;

            const form = event.target;
            const formData = new FormData(form);
            const fields = {};

            for (let [key, value] of formData.entries()) {
                if (!this.config.maskPII || !this.isPII(key)) {
                    fields[key] = typeof value === 'string' ? value.substring(0, 100) : '[file]';
                }
            }

            const event_data = {
                type: 'form_submission',
                form: {
                    id: form.id,
                    className: form.className,
                    action: form.action,
                    method: form.method,
                    fieldCount: form.elements.length,
                    fields: this.config.maskPII ? Object.keys(fields) : fields
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname,
                location: this.userLocation
            };

            this.sendEvent(event_data);
        }

        trackError(event) {
            const errorData = {
                type: 'javascript_error',
                error: {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error?.stack?.substring(0, 500)
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname,
                userAgent: navigator.userAgent
            };

            this.sendEvent(errorData, true); // High priority
        }

        trackPerformance() {
            if (!performance.timing) return;

            const timing = performance.timing;
            const navigation = performance.getEntriesByType('navigation')[0];

            const performanceData = {
                type: 'performance',
                metrics: {
                    loadTime: timing.loadEventEnd - timing.navigationStart,
                    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstByte: timing.responseStart - timing.navigationStart,
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp: timing.connectEnd - timing.connectStart,
                    ssl: timing.secureConnectionStart ? timing.connectEnd - timing.secureConnectionStart : 0
                },
                navigation: navigation ? {
                    type: navigation.type,
                    redirectCount: navigation.redirectCount
                } : null,
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            // Core Web Vitals if available
            if (window.PerformanceObserver) {
                try {
                    new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.entryType === 'largest-contentful-paint') {
                                performanceData.metrics.lcp = entry.startTime;
                            }
                            if (entry.entryType === 'first-input') {
                                performanceData.metrics.fid = entry.processingStart - entry.startTime;
                            }
                            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                                performanceData.metrics.cls = (performanceData.metrics.cls || 0) + entry.value;
                            }
                        }
                    }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
                } catch (e) {
                    // Performance Observer not supported
                }
            }

            this.sendEvent(performanceData);
        }

        // Discord Integration
        async sendEvent(eventData, priority = false) {
            if (!this.shouldSendEvent(eventData)) return;

            const embed = this.createDiscordEmbed(eventData);
            
            if (priority || this.isOnline) {
                await this.sendToDiscord(embed);
            } else {
                this.queueEvent(embed);
            }
        }

        createDiscordEmbed(eventData) {
            const embed = {
                title: this.getEventTitle(eventData),
                color: this.getEventColor(eventData),
                timestamp: new Date(eventData.timestamp).toISOString(),
                fields: this.getEventFields(eventData),
                footer: {
                    text: `${this.config.discordBotName} • ${eventData.fingerprint}`
                }
            };

            if (eventData.location && this.config.includeMapLinks) {
                embed.fields.unshift({
                    name: "Location",
                    value: `[View on Map](https://www.google.com/maps?q=${eventData.location.latitude},${eventData.location.longitude})`,
                    inline: true
                });
            }

            return embed;
        }

        getEventTitle(eventData) {
            const titles = {
                'page_view': '# PAGE VIEW',
                'click': '# CLICK EVENT',
                'scroll': '# SCROLL EVENT',
                'form_submission': '# FORM SUBMISSION',
                'javascript_error': '# ERROR EVENT',
                'performance': '# PERFORMANCE',
                'session_start': '# SESSION STARTED',
                'session_end': '# SESSION ENDED',
                'ab_test_created': '# A/B TEST CREATED',
                'ab_test_conversion': '# A/B TEST CONVERSION',
                'funnel_created': '# FUNNEL CREATED',
                'funnel_step': '# FUNNEL STEP',
                'funnel_completed': '# FUNNEL COMPLETED',
                'bot_detected': '# BOT DETECTED',
                'fraud_detected': '# FRAUD DETECTED',
                'search_input': '# SEARCH INPUT',
                'search_submission': '# SEARCH SUBMISSION',
                'content_view': '# CONTENT VIEW',
                'reading_progress': '# READING PROGRESS',
                'content_engagement': '# CONTENT ENGAGEMENT',
                'network_profile': '# NETWORK PROFILE',
                'journey_step': '# JOURNEY STEP',
                'session_replay': '# SESSION REPLAY'
            };

            const title = titles[eventData.type] || `# ${eventData.type.toUpperCase()}`;
            return `${title}, **${eventData.fingerprint}**`;
        }

        getButtonStyle(style) {
            const styleMap = {
                primary: 1,   // Blue
                secondary: 2, // Grey
                success: 3,   // Green
                danger: 4,    // Red
                link: 5       // Link
            };
            return styleMap[style] || 2;
        }

        getEventColor(eventData) {
            const colors = {
                'page_view': 0x3498db,
                'click': 0x2ecc71,
                'scroll': 0x9b59b6,
                'form_submission': 0xe67e22,
                'javascript_error': 0xe74c3c,
                'performance': 0xf39c12,
                'session_start': 0x1abc9c,
                'session_end': 0x95a5a6
            };

            return colors[eventData.type] || this.config.discordEmbedColor;
        }

        getEventFields(eventData) {
            const fields = [];

            switch (eventData.type) {
                case 'page_view':
                    fields.push(
                        { name: "🌐 URL", value: eventData.url, inline: false },
                        { name: "📄 Title", value: eventData.title || 'No title', inline: true },
                        { name: "🔗 Referrer", value: eventData.referrer || 'Direct', inline: true },
                        { name: "📱 Viewport", value: eventData.viewport, inline: true }
                    );
                    break;

                case 'click':
                    fields.push(
                        { name: "🎯 Element", value: `${eventData.element.tag}${eventData.element.id ? '#' + eventData.element.id : ''}`, inline: true },
                        { name: "📝 Text", value: eventData.element.text?.substring(0, 100) || 'No text', inline: true },
                        { name: "📍 Position", value: `${eventData.element.position.x}, ${eventData.element.position.y}`, inline: true }
                    );
                    if (eventData.element.href) {
                        fields.push({ name: "🔗 Link", value: eventData.element.href, inline: false });
                    }
                    break;

                case 'scroll':
                    fields.push(
                        { name: "📊 Depth", value: `${eventData.depth}%`, inline: true },
                        { name: "📄 Page", value: eventData.page, inline: true }
                    );
                    break;

                case 'form_submission':
                    fields.push(
                        { name: "📝 Form ID", value: eventData.form.id || 'No ID', inline: true },
                        { name: "🔢 Fields", value: eventData.form.fieldCount.toString(), inline: true },
                        { name: "🎯 Action", value: eventData.form.action || 'No action', inline: true }
                    );
                    break;

                case 'javascript_error':
                    fields.push(
                        { name: "❌ Message", value: eventData.error.message.substring(0, 100), inline: false },
                        { name: "📁 File", value: eventData.error.filename || 'Unknown', inline: true },
                        { name: "📍 Line", value: `${eventData.error.lineno}:${eventData.error.colno}`, inline: true }
                    );
                    break;

                case 'performance':
                    fields.push(
                        { name: "⚡ Load Time", value: `${eventData.metrics.loadTime}ms`, inline: true },
                        { name: "🏠 DOM Ready", value: `${eventData.metrics.domReady}ms`, inline: true },
                        { name: "🌐 First Byte", value: `${eventData.metrics.firstByte}ms`, inline: true }
                    );
                    if (eventData.metrics.lcp) {
                        fields.push({ name: "🎨 LCP", value: `${Math.round(eventData.metrics.lcp)}ms`, inline: true });
                    }
                    break;
            }

            return fields;
        }

        async sendToDiscord(embed) {
            const payload = {
                username: this.config.discordBotName,
                avatar_url: this.config.discordBotAvatar,
                embeds: [embed]
            };

            // Add action buttons if enabled
            if (this.config.enableEmbedButtons && this.config.embedButtons) {
                payload.components = [{
                    type: 1, // Action Row
                    components: this.config.embedButtons.map(button => ({
                        type: 2, // Button
                        style: this.getButtonStyle(button.style),
                        label: button.label,
                        url: button.url.replace('{fingerprint}', this.fingerprintLabel)
                    }))
                }];
            }

            try {
                const response = await fetch(this.config.webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Discord API error: ${response.status}`);
                }

                this.log('Event sent to Discord successfully');
            } catch (error) {
                this.log(`Failed to send to Discord: ${error.message}`, 'error');
                
                // Queue for retry if online
                if (this.isOnline) {
                    this.queueEvent(embed);
                }
            }
        }

        queueEvent(embed) {
            this.eventQueue.push(embed);
            
            if (this.eventQueue.length >= this.config.batchSize) {
                this.flushEventQueue();
            }
        }

        async flushEventQueue() {
            if (this.eventQueue.length === 0) return;

            const events = this.eventQueue.splice(0, this.config.batchSize);
            
            for (const embed of events) {
                await this.sendToDiscord(embed);
                await this.delay(100); // Rate limiting
            }
        }

        flushOfflineEvents() {
            if (this.eventQueue.length > 0) {
                this.log(`Flushing ${this.eventQueue.length} offline events`);
                this.flushEventQueue();
            }
        }

        // Utility Methods
        shouldSendEvent(eventData) {
            // Sampling
            if (Math.random() > this.config.samplingRate) return false;

            // Page exclusions
            if (this.config.excludePages.some(page => window.location.pathname.includes(page))) {
                return false;
            }

            // User agent exclusions
            if (this.config.excludeUsers.some(user => navigator.userAgent.toLowerCase().includes(user))) {
                return false;
            }

            return true;
        }

        isExcludedElement(element) {
            return this.config.excludeElements.some(selector => {
                try {
                    return element.matches(selector);
                } catch (e) {
                    return false;
                }
            });
        }

        isPII(fieldName) {
            const piiFields = ['password', 'email', 'phone', 'ssn', 'creditcard', 'credit-card', 'cc'];
            return piiFields.some(field => fieldName.toLowerCase().includes(field));
        }

        hasConsent() {
            if (!this.config.requireConsent) return true;
            
            const consent = this.getCookie(this.config.consentCookieName);
            return consent === 'true' || consent === '1';
        }

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        generateSessionId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        log(message, level = 'info') {
            if (!this.config.console && !this.config.debug) return;

            const prefix = '[Discord Analytics]';
            switch (level) {
                case 'error':
                    console.error(prefix, message);
                    break;
                case 'warn':
                    console.warn(prefix, message);
                    break;
                default:
                    console.log(prefix, message);
            }
        }

        // ================== ADVANCED FEATURES ==================

        // A/B Testing System
        createABTest(testName, variants, allocation = null) {
            if (!allocation) {
                allocation = {};
                const variantWeight = 1 / variants.length;
                variants.forEach(variant => {
                    allocation[variant] = variantWeight;
                });
            }

            const test = {
                name: testName,
                variants: variants,
                allocation: allocation,
                startDate: Date.now(),
                active: true
            };

            const existingTests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
            existingTests[testName] = test;
            localStorage.setItem('da_ab_tests', JSON.stringify(existingTests));

            this.log(`A/B Test created: ${testName} with variants: ${variants.join(', ')}`);
            return test;
        }

        getABTestVariant(testName) {
            const tests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
            const test = tests[testName];
            if (!test || !test.active) return null;

            // Check if user already has a variant assigned
            const userVariants = JSON.parse(localStorage.getItem('da_user_variants') || '{}');
            if (userVariants[testName]) {
                return userVariants[testName];
            }

            // Assign variant based on fingerprint hash
            const hash = this.hashFingerprint(this.fingerprint + testName);
            const hashNum = parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF;
            
            let cumulative = 0;
            for (const [variant, weight] of Object.entries(test.allocation)) {
                cumulative += weight;
                if (hashNum <= cumulative) {
                    userVariants[testName] = variant;
                    localStorage.setItem('da_user_variants', JSON.stringify(userVariants));
                    
                    this.trackABTest(testName, variant, 'assigned');
                    return variant;
                }
            }

            return test.variants[0]; // fallback
        }

        trackABTest(testName, variant, action = 'viewed') {
            const event = {
                type: 'ab_test',
                test: {
                    name: testName,
                    variant: variant,
                    action: action
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        // Funnel Analytics System
        createFunnel(funnelName, steps) {
            const funnel = {
                name: funnelName,
                steps: steps,
                createdAt: Date.now()
            };

            const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
            funnels[funnelName] = funnel;
            localStorage.setItem('da_funnels', JSON.stringify(funnels));

            this.log(`Funnel created: ${funnelName} with steps: ${steps.join(' → ')}`);
            return funnel;
        }

        trackFunnelStep(funnelName, stepName, properties = {}) {
            const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
            const funnel = funnels[funnelName];
            
            if (!funnel) {
                this.log(`Funnel not found: ${funnelName}`, 'warn');
                return;
            }

            const stepIndex = funnel.steps.indexOf(stepName);
            if (stepIndex === -1) {
                this.log(`Step not found in funnel ${funnelName}: ${stepName}`, 'warn');
                return;
            }

            // Track user's funnel progress
            const userFunnels = JSON.parse(localStorage.getItem('da_user_funnels') || '{}');
            const userKey = `${this.fingerprintLabel}_${funnelName}`;
            
            if (!userFunnels[userKey]) {
                userFunnels[userKey] = {
                    startedAt: Date.now(),
                    steps: []
                };
            }

            userFunnels[userKey].steps.push({
                step: stepName,
                timestamp: Date.now(),
                properties: properties
            });

            localStorage.setItem('da_user_funnels', JSON.stringify(userFunnels));

            const event = {
                type: 'funnel_step',
                funnel: {
                    name: funnelName,
                    step: stepName,
                    stepIndex: stepIndex,
                    totalSteps: funnel.steps.length,
                    properties: properties
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        // Bot Detection System
        initBotDetection() {
            this.botScores = {
                userAgent: 0,
                behavior: 0,
                timing: 0,
                interaction: 0,
                total: 0
            };

            this.detectBotUserAgent();
            this.detectBotBehavior();
            this.detectBotTiming();
        }

        detectBotUserAgent() {
            const botPatterns = [
                /bot/i, /crawl/i, /spider/i, /scrape/i, /headless/i,
                /phantom/i, /selenium/i, /automated/i, /puppeteer/i
            ];

            const userAgent = navigator.userAgent;
            if (botPatterns.some(pattern => pattern.test(userAgent))) {
                this.botScores.userAgent = 0.8;
            }

            // Check for missing expected properties
            if (!navigator.plugins.length && !navigator.mimeTypes.length) {
                this.botScores.userAgent += 0.3;
            }

            if (navigator.webdriver) {
                this.botScores.userAgent = 1.0;
            }
        }

        detectBotBehavior() {
            let interactionCount = 0;
            let rapidClicks = 0;
            let lastClickTime = 0;

            document.addEventListener('click', () => {
                interactionCount++;
                const now = Date.now();
                if (now - lastClickTime < 100) {
                    rapidClicks++;
                }
                lastClickTime = now;

                // Update behavior score
                if (rapidClicks > 5) {
                    this.botScores.behavior = Math.min(this.botScores.behavior + 0.2, 1.0);
                }
            });

            document.addEventListener('mousemove', () => {
                interactionCount++;
            });

            // Check after 10 seconds
            setTimeout(() => {
                if (interactionCount === 0) {
                    this.botScores.behavior = 0.7;
                }
            }, 10000);
        }

        detectBotTiming() {
            const loadTime = Date.now() - this.pageLoadTime;
            if (loadTime < 100) { // Too fast
                this.botScores.timing = 0.6;
            }

            // Check for automation timing patterns
            let lastEventTime = Date.now();
            let consistentTiming = 0;

            ['click', 'keydown', 'scroll'].forEach(eventType => {
                document.addEventListener(eventType, () => {
                    const now = Date.now();
                    const timeDiff = now - lastEventTime;
                    
                    if (timeDiff > 95 && timeDiff < 105) { // Too consistent (100ms intervals)
                        consistentTiming++;
                        if (consistentTiming > 3) {
                            this.botScores.timing = Math.min(this.botScores.timing + 0.3, 1.0);
                        }
                    }
                    lastEventTime = now;
                });
            });
        }

        calculateBotScore() {
            this.botScores.total = Math.min(
                this.botScores.userAgent + 
                this.botScores.behavior + 
                this.botScores.timing + 
                this.botScores.interaction, 
                1.0
            );

            return {
                isBot: this.botScores.total > 0.7,
                confidence: this.botScores.total,
                details: this.botScores
            };
        }

        // Fraud Detection System
        initFraudDetection() {
            this.fraudMetrics = {
                rapidSubmissions: 0,
                suspiciousPatterns: 0,
                locationChanges: 0,
                deviceChanges: 0
            };

            this.setupFraudMonitoring();
        }

        setupFraudMonitoring() {
            let formSubmissionTimes = [];
            
            document.addEventListener('submit', () => {
                const now = Date.now();
                formSubmissionTimes.push(now);
                
                // Check for rapid submissions (more than 3 in 10 seconds)
                const recentSubmissions = formSubmissionTimes.filter(time => now - time < 10000);
                if (recentSubmissions.length > 3) {
                    this.fraudMetrics.rapidSubmissions++;
                    this.trackSuspiciousActivity('rapid_form_submissions', {
                        count: recentSubmissions.length,
                        timeWindow: '10s'
                    });
                }
            });

            // Monitor for location jumping
            if (this.config.trackGeolocation) {
                this.monitorLocationChanges();
            }

            // Monitor device fingerprint changes
            this.monitorDeviceChanges();
        }

        monitorLocationChanges() {
            const lastLocation = JSON.parse(localStorage.getItem('da_last_location') || 'null');
            
            if (lastLocation && this.userLocation) {
                const distance = this.calculateDistance(
                    lastLocation.latitude, lastLocation.longitude,
                    this.userLocation.latitude, this.userLocation.longitude
                );
                
                const timeDiff = Date.now() - lastLocation.timestamp;
                const maxSpeed = 1000; // km/h (impossible for humans)
                const calculatedSpeed = (distance / (timeDiff / 3600000)); // km/h
                
                if (calculatedSpeed > maxSpeed) {
                    this.fraudMetrics.locationChanges++;
                    this.trackSuspiciousActivity('impossible_location_change', {
                        distance: distance,
                        time: timeDiff,
                        speed: calculatedSpeed
                    });
                }
            }

            if (this.userLocation) {
                localStorage.setItem('da_last_location', JSON.stringify({
                    ...this.userLocation,
                    timestamp: Date.now()
                }));
            }
        }

        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                     Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        monitorDeviceChanges() {
            const lastFingerprint = localStorage.getItem('da_last_fingerprint');
            if (lastFingerprint && lastFingerprint !== this.fingerprint) {
                this.fraudMetrics.deviceChanges++;
                this.trackSuspiciousActivity('device_fingerprint_change', {
                    oldFingerprint: lastFingerprint.substring(0, 8),
                    newFingerprint: this.fingerprint.substring(0, 8)
                });
            }
            localStorage.setItem('da_last_fingerprint', this.fingerprint);
        }

        trackSuspiciousActivity(activityType, details = {}) {
            const event = {
                type: 'suspicious_activity',
                activity: {
                    type: activityType,
                    details: details,
                    fraudScore: this.calculateFraudScore()
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event, true); // High priority
        }

        calculateFraudScore() {
            const weights = {
                rapidSubmissions: 0.3,
                suspiciousPatterns: 0.25,
                locationChanges: 0.25,
                deviceChanges: 0.2
            };

            let score = 0;
            Object.entries(this.fraudMetrics).forEach(([key, value]) => {
                score += (value * weights[key]) || 0;
            });

            return Math.min(score, 1.0);
        }

        // Enhanced Search Tracking
        setupSearchTracking() {
            const searchInputs = document.querySelectorAll('input[type="search"], .search-input, [placeholder*="search" i]');
            
            searchInputs.forEach(input => {
                this.setupSearchInput(input);
            });

            // Monitor for dynamically added search inputs
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const searchInputs = node.querySelectorAll('input[type="search"], .search-input, [placeholder*="search" i]');
                            searchInputs.forEach(input => this.setupSearchInput(input));
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        setupSearchInput(input) {
            let searchSession = {
                query: '',
                suggestions: [],
                startTime: Date.now(),
                keystrokes: 0
            };

            input.addEventListener('input', (e) => {
                searchSession.query = e.target.value;
                searchSession.keystrokes++;

                // Track autocomplete suggestions if available
                const suggestionContainer = document.querySelector('.search-suggestions, .autocomplete, [role="listbox"]');
                if (suggestionContainer) {
                    const suggestions = Array.from(suggestionContainer.children).map(item => item.textContent);
                    searchSession.suggestions = suggestions;
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.trackSearchQuery(searchSession);
                }
            });

            // Track search abandonment
            input.addEventListener('blur', () => {
                if (searchSession.query && searchSession.keystrokes > 2) {
                    setTimeout(() => {
                        if (searchSession.query === input.value) {
                            this.trackSearchAbandonment(searchSession);
                        }
                    }, 1000);
                }
            });
        }

        trackSearchQuery(searchSession) {
            const event = {
                type: 'search_query',
                search: {
                    query: searchSession.query,
                    suggestions: searchSession.suggestions,
                    keystrokes: searchSession.keystrokes,
                    duration: Date.now() - searchSession.startTime
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        trackSearchAbandonment(searchSession) {
            const event = {
                type: 'search_abandonment',
                search: {
                    query: searchSession.query,
                    keystrokes: searchSession.keystrokes,
                    duration: Date.now() - searchSession.startTime
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        // Content Engagement Tracking
        setupContentTracking() {
            this.contentMetrics = {
                readingProgress: 0,
                timeOnContent: 0,
                engagementScore: 0
            };

            this.trackReadingProgress();
            this.trackContentTime();
            this.trackContentEngagement();
        }

        trackReadingProgress() {
            const contentElements = document.querySelectorAll('article, .content, .post, main, [role="main"]');
            
            contentElements.forEach(element => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const scrollProgress = this.calculateScrollProgress(element);
                            this.contentMetrics.readingProgress = Math.max(this.contentMetrics.readingProgress, scrollProgress);
                            
                            // Track milestone progress
                            const milestones = [25, 50, 75, 90, 100];
                            milestones.forEach(milestone => {
                                if (scrollProgress >= milestone && !this.hasReachedMilestone(milestone)) {
                                    this.trackContentMilestone(milestone, element);
                                    this.markMilestone(milestone);
                                }
                            });
                        }
                    });
                }, { threshold: [0.1, 0.25, 0.5, 0.75, 0.9] });

                observer.observe(element);
            });
        }

        calculateScrollProgress(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;
            
            const visibleTop = Math.max(0, -rect.top);
            const visibleBottom = Math.min(elementHeight, windowHeight - rect.top);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            return Math.round((visibleHeight / elementHeight) * 100);
        }

        hasReachedMilestone(milestone) {
            const milestones = JSON.parse(sessionStorage.getItem('da_content_milestones') || '[]');
            return milestones.includes(milestone);
        }

        markMilestone(milestone) {
            const milestones = JSON.parse(sessionStorage.getItem('da_content_milestones') || '[]');
            milestones.push(milestone);
            sessionStorage.setItem('da_content_milestones', JSON.stringify(milestones));
        }

        trackContentMilestone(milestone, element) {
            const event = {
                type: 'content_engagement',
                content: {
                    milestone: milestone === 100 ? 'final' : `${milestone}%`,
                    time: this.contentMetrics.timeOnContent / 1000 + 's',
                    element: element.tagName.toLowerCase(),
                    title: document.title
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        trackContentTime() {
            let contentStartTime = Date.now();
            let isOnContent = false;

            const contentElements = document.querySelectorAll('article, .content, .post, main, [role="main"]');
            
            contentElements.forEach(element => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !isOnContent) {
                            isOnContent = true;
                            contentStartTime = Date.now();
                        } else if (!entry.isIntersecting && isOnContent) {
                            isOnContent = false;
                            this.contentMetrics.timeOnContent += Date.now() - contentStartTime;
                        }
                    });
                });

                observer.observe(element);
            });

            // Track engagement milestones
            const milestones = [30, 60, 120, 300]; // seconds
            milestones.forEach(milestone => {
                setTimeout(() => {
                    if (isOnContent) {
                        this.trackContentMilestone(milestone + 's', null);
                    }
                }, milestone * 1000);
            });
        }

        trackContentEngagement() {
            let engagementEvents = 0;
            
            ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
                document.addEventListener(eventType, () => {
                    engagementEvents++;
                    this.contentMetrics.engagementScore = Math.min(engagementEvents / 100, 1.0);
                });
            });
        }

        // Network Fingerprinting
        async initNetworkFingerprinting() {
            if (!this.config.fingerprintComponents.network) return;

            this.networkFingerprint = {
                connectionType: this.getConnectionType(),
                downlink: this.getDownlink(),
                rtt: this.getRTT(),
                dnsResolution: await this.measureDNSResolution(),
                connectionSpeed: await this.measureConnectionSpeed()
            };

            this.log('Network fingerprint generated', 'info');
        }

        getConnectionType() {
            return navigator.connection?.effectiveType || 'unknown';
        }

        getDownlink() {
            return navigator.connection?.downlink || 'unknown';
        }

        getRTT() {
            return navigator.connection?.rtt || 'unknown';
        }

        async measureDNSResolution() {
            const domains = ['google.com', 'cloudflare.com', 'amazonaws.com'];
            const measurements = [];

            for (const domain of domains) {
                try {
                    const start = performance.now();
                    await fetch(`https://${domain}/favicon.ico`, { mode: 'no-cors' });
                    const end = performance.now();
                    measurements.push(end - start);
                } catch (e) {
                    measurements.push(-1);
                }
            }

            return {
                domains: domains,
                times: measurements,
                average: measurements.filter(t => t > 0).reduce((a, b) => a + b, 0) / measurements.filter(t => t > 0).length
            };
        }

        async measureConnectionSpeed() {
            try {
                const start = performance.now();
                const response = await fetch(window.location.origin + '/favicon.ico?t=' + Date.now());
                const end = performance.now();
                
                const bytes = response.headers.get('content-length') || 1024;
                const duration = (end - start) / 1000; // seconds
                const speed = (bytes * 8) / duration; // bits per second

                return {
                    bytes: parseInt(bytes),
                    duration: duration,
                    speed: speed,
                    speedFormatted: this.formatSpeed(speed)
                };
            } catch (e) {
                return { error: 'Unable to measure speed' };
            }
        }

        formatSpeed(bps) {
            if (bps > 1000000) return (bps / 1000000).toFixed(2) + ' Mbps';
            if (bps > 1000) return (bps / 1000).toFixed(2) + ' Kbps';
            return bps.toFixed(2) + ' bps';
        }

        // Behavioral Fingerprinting
        initBehavioralFingerprinting() {
            if (!this.config.fingerprintComponents.behavioral) return;

            this.behavioralFingerprint = {
                typingPattern: this.analyzeTypingPattern(),
                mousePattern: this.analyzeMousePattern(),
                scrollPattern: this.analyzeScrollPattern(),
                clickPattern: this.analyzeClickPattern()
            };

            this.log('Behavioral fingerprinting initialized');
        }

        analyzeTypingPattern() {
            const typingData = {
                keystrokes: [],
                averageInterval: 0,
                rhythm: []
            };

            let lastKeyTime = 0;
            
            document.addEventListener('keydown', (e) => {
                const now = Date.now();
                const interval = lastKeyTime ? now - lastKeyTime : 0;
                
                typingData.keystrokes.push({
                    key: e.code,
                    timestamp: now,
                    interval: interval
                });

                if (typingData.keystrokes.length > 100) {
                    typingData.keystrokes.shift(); // Keep only last 100
                }

                // Calculate rhythm (intervals between keystrokes)
                if (interval > 0) {
                    typingData.rhythm.push(interval);
                    if (typingData.rhythm.length > 50) {
                        typingData.rhythm.shift();
                    }
                    
                    typingData.averageInterval = typingData.rhythm.reduce((a, b) => a + b, 0) / typingData.rhythm.length;
                }

                lastKeyTime = now;
            });

            return typingData;
        }

        analyzeMousePattern() {
            const mouseData = {
                movements: [],
                velocity: [],
                acceleration: [],
                clickTiming: []
            };

            let lastMoveTime = 0;
            let lastPosition = { x: 0, y: 0 };
            let lastVelocity = 0;

            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                const deltaTime = now - lastMoveTime;
                
                if (deltaTime > 0) {
                    const deltaX = e.clientX - lastPosition.x;
                    const deltaY = e.clientY - lastPosition.y;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const velocity = distance / deltaTime;
                    const acceleration = Math.abs(velocity - lastVelocity) / deltaTime;

                    mouseData.movements.push({ x: e.clientX, y: e.clientY, timestamp: now });
                    mouseData.velocity.push(velocity);
                    mouseData.acceleration.push(acceleration);

                    // Keep only recent data
                    if (mouseData.movements.length > 200) {
                        mouseData.movements.shift();
                        mouseData.velocity.shift();
                        mouseData.acceleration.shift();
                    }

                    lastVelocity = velocity;
                }

                lastMoveTime = now;
                lastPosition = { x: e.clientX, y: e.clientY };
            });

            let lastClickTime = 0;
            document.addEventListener('click', () => {
                const now = Date.now();
                if (lastClickTime) {
                    mouseData.clickTiming.push(now - lastClickTime);
                    if (mouseData.clickTiming.length > 20) {
                        mouseData.clickTiming.shift();
                    }
                }
                lastClickTime = now;
            });

            return mouseData;
        }

        analyzeScrollPattern() {
            const scrollData = {
                patterns: [],
                velocity: [],
                direction: []
            };

            let lastScrollTime = 0;
            let lastScrollY = window.scrollY;

            document.addEventListener('scroll', () => {
                const now = Date.now();
                const currentScrollY = window.scrollY;
                const deltaTime = now - lastScrollTime;
                const deltaY = currentScrollY - lastScrollY;

                if (deltaTime > 0) {
                    const velocity = Math.abs(deltaY) / deltaTime;
                    const direction = deltaY > 0 ? 'down' : 'up';

                    scrollData.patterns.push({ timestamp: now, position: currentScrollY, delta: deltaY });
                    scrollData.velocity.push(velocity);
                    scrollData.direction.push(direction);

                    // Keep only recent data
                    if (scrollData.patterns.length > 100) {
                        scrollData.patterns.shift();
                        scrollData.velocity.shift();
                        scrollData.direction.shift();
                    }
                }

                lastScrollTime = now;
                lastScrollY = currentScrollY;
            });

            return scrollData;
        }

        analyzeClickPattern() {
            const clickData = {
                positions: [],
                intervals: [],
                pressure: [],
                sequence: []
            };

            let lastClickTime = 0;

            document.addEventListener('click', (e) => {
                const now = Date.now();
                const interval = lastClickTime ? now - lastClickTime : 0;

                clickData.positions.push({ x: e.clientX, y: e.clientY });
                clickData.intervals.push(interval);
                clickData.pressure.push(e.pressure || 0);
                clickData.sequence.push({
                    timestamp: now,
                    button: e.button,
                    target: e.target.tagName
                });

                // Keep only recent data
                if (clickData.positions.length > 50) {
                    clickData.positions.shift();
                    clickData.intervals.shift();
                    clickData.pressure.shift();
                    clickData.sequence.shift();
                }

                lastClickTime = now;
            });

            return clickData;
        }

        // User Journey Mapping
        initUserJourney() {
            this.userJourney = {
                sessions: [],
                currentSession: {
                    startTime: Date.now(),
                    pages: [],
                    events: [],
                    fingerprint: this.fingerprintLabel
                }
            };

            this.loadPreviousJourneys();
            this.trackPageInJourney();
            this.trackEventsInJourney();
        }

        loadPreviousJourneys() {
            try {
                const stored = localStorage.getItem('da_user_journey');
                if (stored) {
                    const data = JSON.parse(stored);
                    if (data.fingerprint === this.fingerprintLabel) {
                        this.userJourney.sessions = data.sessions || [];
                    }
                }
            } catch (e) {
                this.log('Failed to load user journey data', 'warn');
            }
        }

        trackPageInJourney() {
            const pageData = {
                url: window.location.href,
                title: document.title,
                timestamp: Date.now(),
                referrer: document.referrer
            };

            this.userJourney.currentSession.pages.push(pageData);
            this.saveUserJourney();
        }

        trackEventsInJourney() {
            ['click', 'scroll', 'submit'].forEach(eventType => {
                document.addEventListener(eventType, (e) => {
                    const eventData = {
                        type: eventType,
                        timestamp: Date.now(),
                        target: e.target.tagName,
                        page: window.location.pathname
                    };

                    this.userJourney.currentSession.events.push(eventData);
                    
                    // Limit events to prevent excessive storage
                    if (this.userJourney.currentSession.events.length > 1000) {
                        this.userJourney.currentSession.events = this.userJourney.currentSession.events.slice(-500);
                    }

                    this.saveUserJourney();
                });
            });
        }

        saveUserJourney() {
            try {
                const journeyData = {
                    fingerprint: this.fingerprintLabel,
                    sessions: this.userJourney.sessions,
                    currentSession: this.userJourney.currentSession
                };

                localStorage.setItem('da_user_journey', JSON.stringify(journeyData));
            } catch (e) {
                this.log('Failed to save user journey data', 'warn');
            }
        }

        endSession() {
            this.userJourney.currentSession.endTime = Date.now();
            this.userJourney.currentSession.duration = this.userJourney.currentSession.endTime - this.userJourney.currentSession.startTime;
            
            this.userJourney.sessions.push(this.userJourney.currentSession);
            
            // Keep only last 50 sessions
            if (this.userJourney.sessions.length > 50) {
                this.userJourney.sessions = this.userJourney.sessions.slice(-50);
            }

            this.saveUserJourney();
        }

        // Session Replay System
        initSessionReplay() {
            if (!this.config.enableSessionReplay) return;

            this.sessionReplay = {
                events: [],
                startTime: Date.now(),
                maxEvents: 10000,
                active: true
            };

            this.setupReplayRecording();
        }

        setupReplayRecording() {
            // Record DOM mutations
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    this.recordReplayEvent('mutation', {
                        type: mutation.type,
                        target: this.getElementPath(mutation.target),
                        timestamp: Date.now() - this.sessionReplay.startTime
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true,
                characterData: true,
                characterDataOldValue: true
            });

            // Record user interactions
            ['click', 'mousemove', 'scroll', 'keydown', 'input'].forEach(eventType => {
                document.addEventListener(eventType, (e) => {
                    this.recordReplayEvent(eventType, {
                        x: e.clientX,
                        y: e.clientY,
                        target: this.getElementPath(e.target),
                        key: e.key,
                        timestamp: Date.now() - this.sessionReplay.startTime
                    });
                }, { passive: true });
            });

            // Record viewport changes
            window.addEventListener('resize', () => {
                this.recordReplayEvent('resize', {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    timestamp: Date.now() - this.sessionReplay.startTime
                });
            });
        }

        recordReplayEvent(type, data) {
            if (!this.sessionReplay.active) return;

            this.sessionReplay.events.push({
                type: type,
                data: data
            });

            // Limit events to prevent memory issues
            if (this.sessionReplay.events.length > this.sessionReplay.maxEvents) {
                this.sessionReplay.events = this.sessionReplay.events.slice(-Math.floor(this.sessionReplay.maxEvents * 0.8));
            }
        }

        getElementPath(element) {
            const path = [];
            while (element && element !== document.body) {
                let selector = element.tagName.toLowerCase();
                if (element.id) {
                    selector += '#' + element.id;
                } else if (element.className) {
                    selector += '.' + element.className.split(' ').join('.');
                }
                path.unshift(selector);
                element = element.parentElement;
            }
            return path.join(' > ');
        }

        exportSessionReplay() {
            return {
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                startTime: this.sessionReplay.startTime,
                events: this.sessionReplay.events,
                url: window.location.href,
                userAgent: navigator.userAgent
            };
        }

        // Helper method for fingerprint hashing
        hashFingerprint(input) {
            let hash = 0;
            for (let i = 0; i < input.length; i++) {
                const char = input.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        }

        // Additional tracking methods would continue here...
        setupMediaTracking() {
            document.addEventListener('play', (e) => {
                if (e.target.matches('video, audio')) {
                    this.trackMediaEvent('play', e.target);
                }
            }, true);

            document.addEventListener('pause', (e) => {
                if (e.target.matches('video, audio')) {
                    this.trackMediaEvent('pause', e.target);
                }
            }, true);
        }

        trackMediaEvent(action, element) {
            const event = {
                type: 'media_' + action,
                media: {
                    type: element.tagName.toLowerCase(),
                    src: element.src,
                    currentTime: element.currentTime,
                    duration: element.duration
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        setupDownloadTracking() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;

                const href = link.href;
                const downloadExtensions = ['.pdf', '.doc', '.docx', '.zip', '.rar', '.exe', '.dmg'];
                
                if (downloadExtensions.some(ext => href.toLowerCase().includes(ext))) {
                    this.trackDownload(href, link);
                }
            });
        }

        trackDownload(url, element) {
            const event = {
                type: 'download',
                download: {
                    url: url,
                    text: element.textContent,
                    extension: url.split('.').pop()
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        setupMouseTracking() {
            let mouseData = { moves: 0, clicks: 0, lastMove: 0 };
            
            document.addEventListener('mousemove', (e) => {
                mouseData.moves++;
                mouseData.lastMove = Date.now();
                
                // Sample mouse movements (every 100th move)
                if (mouseData.moves % 100 === 0) {
                    this.trackMouseMovement(e, mouseData);
                }
            });
        }

        trackMouseMovement(event, data) {
            const mouseEvent = {
                type: 'mouse_movement',
                mouse: {
                    x: event.clientX,
                    y: event.clientY,
                    moves: data.moves,
                    viewport: `${window.innerWidth}x${window.innerHeight}`
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(mouseEvent);
        }

        trackFormInteraction(event) {
            const field = event.target;
            const interaction = {
                type: 'form_interaction',
                field: {
                    type: field.type,
                    name: field.name,
                    id: field.id,
                    value: this.config.maskPII && this.isPII(field.name) ? '[masked]' : field.value?.substring(0, 50)
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(interaction);
        }

        trackPromiseRejection(event) {
            const errorData = {
                type: 'promise_rejection',
                error: {
                    reason: event.reason?.toString().substring(0, 200),
                    stack: event.reason?.stack?.substring(0, 500)
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(errorData, true);
        }

        trackPageVisibility() {
            const event = {
                type: 'page_visibility',
                visibility: document.visibilityState,
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        trackPageExit() {
            const sessionDuration = Date.now() - this.sessionStart;
            const event = {
                type: 'session_end',
                session: {
                    duration: sessionDuration,
                    clicks: this.behaviorData.clicks,
                    maxScrollDepth: this.behaviorData.scrollDepth
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            // Use sendBeacon for reliable delivery on page unload
            if (navigator.sendBeacon && this.config.webhook) {
                const embed = this.createDiscordEmbed(event);
                const payload = {
                    username: this.config.discordBotName,
                    embeds: [embed]
                };
                
                navigator.sendBeacon(this.config.webhook, JSON.stringify(payload));
            }
        }

        startBehaviorTracking() {
            // Track time spent on page
            setInterval(() => {
                this.behaviorData.timeSpent += 1000;
            }, 1000);

            // Track idle time
            let idleTime = 0;
            let activeTime = 0;
            let lastActivity = Date.now();

            const resetActivity = () => {
                if (idleTime > 5000) { // 5 seconds idle
                    activeTime += Date.now() - lastActivity - idleTime;
                    idleTime = 0;
                }
                lastActivity = Date.now();
            };

            document.addEventListener('mousemove', resetActivity);
            document.addEventListener('keypress', resetActivity);
            document.addEventListener('scroll', resetActivity);
            document.addEventListener('click', resetActivity);

            setInterval(() => {
                idleTime += 1000;
            }, 1000);
        }

        trackPrint() {
            const event = {
                type: 'print',
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname,
                title: document.title
            };

            this.sendEvent(event);
        }

        trackClipboard(action, event) {
            const clipboardEvent = {
                type: 'clipboard_' + action,
                selection: window.getSelection().toString().substring(0, 100),
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(clipboardEvent);
        }

        // Public API
        identify(userId, traits = {}) {
            this.userId = userId;
            this.userTraits = traits;
            
            const event = {
                type: 'user_identified',
                user: {
                    id: userId,
                    traits: traits
                },
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId
            };

            this.sendEvent(event);
        }

        track(eventName, properties = {}) {
            const event = {
                type: 'custom_event',
                name: eventName,
                properties: properties,
                timestamp: Date.now(),
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                page: window.location.pathname
            };

            this.sendEvent(event);
        }

        setConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
        }

        // ===== A/B TESTING SYSTEM =====
        initABTesting() {
            if (!this.config.enableABTesting) return;
            
            this.abTests = new Map();
            this.loadExistingABTests();
        }
        
        createABTest(testName, variants, options = {}) {
            const test = {
                name: testName,
                variants: variants,
                traffic: options.traffic || 1.0,
                targeting: options.targeting || {},
                startDate: options.startDate || Date.now(),
                endDate: options.endDate || null,
                goals: options.goals || [],
                active: true
            };
            
            this.abTests.set(testName, test);
            this.storeABTest(testName, test);
            
            // Auto-assign user to variant
            const variant = this.assignToVariant(testName);
            
            this.sendEvent({
                type: 'ab_test_created',
                testName: testName,
                variant: variant,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
            
            return variant;
        }
        
        assignToVariant(testName) {
            const test = this.abTests.get(testName);
            if (!test || !test.active) return null;
            
            // Check if user already assigned
            const existing = this.getStoredVariant(testName);
            if (existing) return existing;
            
            // Assign based on fingerprint hash for consistency
            const hash = this.fingerprint || '0';
            const hashNum = parseInt(hash.substring(0, 8), 16);
            const variantIndex = hashNum % test.variants.length;
            const variant = test.variants[variantIndex];
            
            this.storeVariantAssignment(testName, variant);
            return variant;
        }
        
        trackABTest(testName, goalName, value = 1) {
            const test = this.abTests.get(testName);
            const variant = this.getStoredVariant(testName);
            
            if (!test || !variant) return;
            
            this.sendEvent({
                type: 'ab_test_conversion',
                testName: testName,
                variant: variant,
                goal: goalName,
                value: value,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        storeABTest(testName, test) {
            try {
                const tests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
                tests[testName] = test;
                localStorage.setItem('da_ab_tests', JSON.stringify(tests));
            } catch (e) {}
        }
        
        storeVariantAssignment(testName, variant) {
            try {
                const assignments = JSON.parse(localStorage.getItem('da_ab_assignments') || '{}');
                assignments[testName] = variant;
                localStorage.setItem('da_ab_assignments', JSON.stringify(assignments));
            } catch (e) {}
        }
        
        getStoredVariant(testName) {
            try {
                const assignments = JSON.parse(localStorage.getItem('da_ab_assignments') || '{}');
                return assignments[testName] || null;
            } catch (e) {
                return null;
            }
        }
        
        loadExistingABTests() {
            try {
                const tests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
                Object.entries(tests).forEach(([name, test]) => {
                    this.abTests.set(name, test);
                });
            } catch (e) {}
        }
        
        // ===== FUNNEL ANALYTICS =====
        initFunnelTracking() {
            if (!this.config.enableFunnelTracking) return;
            
            this.funnels = new Map();
            this.loadExistingFunnels();
        }
        
        createFunnel(funnelName, steps, options = {}) {
            const funnel = {
                name: funnelName,
                steps: steps.map((step, index) => ({
                    name: step,
                    order: index,
                    required: options.requiredSteps ? options.requiredSteps.includes(step) : true
                })),
                timeWindow: options.timeWindow || 86400000, // 24 hours
                allowSkipping: options.allowSkipping || false,
                goals: options.goals || []
            };
            
            this.funnels.set(funnelName, funnel);
            this.storeFunnel(funnelName, funnel);
            
            this.sendEvent({
                type: 'funnel_created',
                funnelName: funnelName,
                steps: steps,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
            
            return funnel;
        }
        
        trackFunnelStep(funnelName, stepName, properties = {}) {
            const funnel = this.funnels.get(funnelName);
            if (!funnel) return;
            
            const step = funnel.steps.find(s => s.name === stepName);
            if (!step) return;
            
            // Get user's funnel progress
            const progress = this.getFunnelProgress(funnelName);
            const currentStep = step.order;
            
            // Update progress
            progress.steps[stepName] = {
                timestamp: Date.now(),
                properties: properties,
                completed: true
            };
            
            progress.lastStep = stepName;
            progress.lastStepOrder = currentStep;
            
            // Check if funnel completed
            const allSteps = funnel.steps.filter(s => s.required);
            const completedRequired = allSteps.filter(s => progress.steps[s.name]?.completed);
            const funnelCompleted = completedRequired.length === allSteps.length;
            
            this.storeFunnelProgress(funnelName, progress);
            
            this.sendEvent({
                type: 'funnel_step',
                funnelName: funnelName,
                stepName: stepName,
                stepOrder: currentStep,
                properties: properties,
                funnelCompleted: funnelCompleted,
                totalSteps: funnel.steps.length,
                completedSteps: Object.keys(progress.steps).length,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
            
            if (funnelCompleted) {
                this.sendEvent({
                    type: 'funnel_completed',
                    funnelName: funnelName,
                    timeToComplete: Date.now() - progress.startTime,
                    fingerprint: this.fingerprintLabel,
                    timestamp: Date.now()
                });
            }
        }
        
        getFunnelProgress(funnelName) {
            try {
                const allProgress = JSON.parse(localStorage.getItem('da_funnel_progress') || '{}');
                const userKey = this.fingerprintLabel || 'anonymous';
                
                if (!allProgress[userKey] || !allProgress[userKey][funnelName]) {
                    const newProgress = {
                        startTime: Date.now(),
                        steps: {},
                        lastStep: null,
                        lastStepOrder: -1
                    };
                    
                    if (!allProgress[userKey]) allProgress[userKey] = {};
                    allProgress[userKey][funnelName] = newProgress;
                    localStorage.setItem('da_funnel_progress', JSON.stringify(allProgress));
                    
                    return newProgress;
                }
                
                return allProgress[userKey][funnelName];
            } catch (e) {
                return {
                    startTime: Date.now(),
                    steps: {},
                    lastStep: null,
                    lastStepOrder: -1
                };
            }
        }
        
        storeFunnel(funnelName, funnel) {
            try {
                const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
                funnels[funnelName] = funnel;
                localStorage.setItem('da_funnels', JSON.stringify(funnels));
            } catch (e) {}
        }
        
        storeFunnelProgress(funnelName, progress) {
            try {
                const allProgress = JSON.parse(localStorage.getItem('da_funnel_progress') || '{}');
                const userKey = this.fingerprintLabel || 'anonymous';
                
                if (!allProgress[userKey]) allProgress[userKey] = {};
                allProgress[userKey][funnelName] = progress;
                
                localStorage.setItem('da_funnel_progress', JSON.stringify(allProgress));
            } catch (e) {}
        }
        
        loadExistingFunnels() {
            try {
                const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
                Object.entries(funnels).forEach(([name, funnel]) => {
                    this.funnels.set(name, funnel);
                });
            } catch (e) {}
        }
        
        // ===== ENHANCED BOT DETECTION =====
        initBotDetection() {
            if (!this.config.enableBotDetection) return;
            
            this.botScore = 0;
            this.runBotDetectionTests();
        }
        
        runBotDetectionTests() {
            const tests = [
                this.testUserAgent(),
                this.testWebDriver(),
                this.testPlugins(),
                this.testLanguages(),
                this.testScreen(),
                this.testBehavior(),
                this.testTiming(),
                this.testPermissions(),
                this.testHeadless(),
                this.testAutomation()
            ];
            
            this.botScore = tests.reduce((sum, score) => sum + score, 0);
            
            const isBot = this.botScore > 50; // Threshold for bot detection
            
            if (isBot) {
                this.sendEvent({
                    type: 'bot_detected',
                    botScore: this.botScore,
                    tests: tests,
                    fingerprint: this.fingerprintLabel,
                    timestamp: Date.now()
                });
            }
        }
        
        testUserAgent() {
            const ua = navigator.userAgent.toLowerCase();
            const botPatterns = [
                'bot', 'crawler', 'spider', 'crawling', 'headless',
                'phantom', 'selenium', 'webdriver', 'automated'
            ];
            
            return botPatterns.some(pattern => ua.includes(pattern)) ? 30 : 0;
        }
        
        testWebDriver() {
            return (window.navigator.webdriver || 
                    window.navigator.webdriver === true || 
                    window.webdriver || 
                    window.WebDriver) ? 40 : 0;
        }
        
        testPlugins() {
            const pluginCount = navigator.plugins.length;
            return pluginCount === 0 ? 15 : 0;
        }
        
        testLanguages() {
            const langCount = navigator.languages ? navigator.languages.length : 0;
            return langCount === 0 ? 10 : 0;
        }
        
        testScreen() {
            const hasScreen = screen.width && screen.height;
            return !hasScreen ? 20 : 0;
        }
        
        testBehavior() {
            // Check mouse movements (accumulated over time)
            return this.behaviorProfile.mousePatterns.length === 0 ? 5 : 0;
        }
        
        testTiming() {
            // Bots often have very fast or very precise timing
            const loadTime = Date.now() - this.pageLoadTime;
            return loadTime < 100 ? 10 : 0;
        }
        
        testPermissions() {
            try {
                return navigator.permissions ? 0 : 15;
            } catch (e) {
                return 15;
            }
        }
        
        testHeadless() {
            // Check for headless browser indicators
            const headlessIndicators = [
                !window.outerHeight,
                !window.outerWidth,
                navigator.webdriver,
                window.phantom,
                window._phantom,
                window.callPhantom
            ];
            
            return headlessIndicators.some(indicator => indicator) ? 25 : 0;
        }
        
        testAutomation() {
            // Check for automation frameworks
            const automationProps = [
                'webdriver', '_Selenium_IDE_Recorder', 'callSelenium',
                '_selenium', 'callPhantom', '_phantomjs',
                '__nightmare', '__fxdriver_unwrapped'
            ];
            
            return automationProps.some(prop => window[prop]) ? 30 : 0;
        }
        
        // ===== ENHANCED FRAUD DETECTION =====
        initFraudDetection() {
            if (!this.config.enableFraudDetection) return;
            
            this.fraudScore = 0;
            this.fraudIndicators = [];
            this.runFraudDetectionChecks();
        }
        
        runFraudDetectionChecks() {
            const checks = [
                this.checkVPN(),
                this.checkMultipleAccounts(),
                this.checkSuspiciousBehavior(),
                this.checkDeviceConsistency(),
                this.checkGeolocationJumps(),
                this.checkRapidActions(),
                this.checkFingerprintSpoofing()
            ];
            
            this.fraudScore = checks.reduce((sum, score) => sum + score, 0);
            
            if (this.fraudScore > 70) {
                this.sendEvent({
                    type: 'fraud_detected',
                    fraudScore: this.fraudScore,
                    indicators: this.fraudIndicators,
                    fingerprint: this.fingerprintLabel,
                    timestamp: Date.now()
                });
            }
        }
        
        checkVPN() {
            // Basic VPN detection based on timezone/IP inconsistencies
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // This would be enhanced with IP geolocation in real implementation
            return 0; // Placeholder
        }
        
        checkMultipleAccounts() {
            try {
                const labels = JSON.parse(localStorage.getItem('da_labels') || '{}');
                const fingerprintCount = Object.keys(labels).length;
                
                if (fingerprintCount > 5) {
                    this.fraudIndicators.push('multiple_fingerprints');
                    return 20;
                }
            } catch (e) {}
            return 0;
        }
        
        checkSuspiciousBehavior() {
            let score = 0;
            
            // Check for inhuman click patterns
            if (this.behaviorProfile.clickPatterns.length > 10) {
                const timings = this.behaviorProfile.clickPatterns.map(p => p.timing);
                const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
                
                if (avgTiming < 50) { // Too fast
                    this.fraudIndicators.push('rapid_clicking');
                    score += 15;
                }
            }
            
            return score;
        }
        
        checkDeviceConsistency() {
            // Check for device fingerprint inconsistencies
            try {
                const stored = localStorage.getItem('da_device_history');
                if (stored) {
                    const history = JSON.parse(stored);
                    const currentFingerprint = this.fingerprint;
                    
                    if (history.length > 0 && 
                        !history.includes(currentFingerprint) && 
                        history.length > 3) {
                        this.fraudIndicators.push('device_switching');
                        return 25;
                    }
                }
            } catch (e) {}
            return 0;
        }
        
        checkGeolocationJumps() {
            if (!this.userLocation) return 0;
            
            try {
                const lastLocation = JSON.parse(localStorage.getItem('da_last_location') || 'null');
                if (lastLocation) {
                    const distance = this.calculateDistance(
                        lastLocation.latitude, lastLocation.longitude,
                        this.userLocation.latitude, this.userLocation.longitude
                    );
                    
                    const timeDiff = Date.now() - lastLocation.timestamp;
                    const hoursSince = timeDiff / (1000 * 60 * 60);
                    
                    // Check for impossible travel (>500km/h)
                    if (distance > hoursSince * 500) {
                        this.fraudIndicators.push('impossible_travel');
                        return 30;
                    }
                }
                
                localStorage.setItem('da_last_location', JSON.stringify({
                    ...this.userLocation,
                    timestamp: Date.now()
                }));
            } catch (e) {}
            
            return 0;
        }
        
        checkRapidActions() {
            const now = Date.now();
            const recentActions = this.behaviorData.interactions.filter(
                action => now - action.timestamp < 60000 // Last minute
            );
            
            if (recentActions.length > 100) {
                this.fraudIndicators.push('rapid_actions');
                return 20;
            }
            
            return 0;
        }
        
        checkFingerprintSpoofing() {
            // Check for obvious fingerprint manipulation
            let score = 0;
            
            if (navigator.plugins.length === 0 && navigator.mimeTypes.length === 0) {
                this.fraudIndicators.push('disabled_plugins');
                score += 10;
            }
            
            if (screen.width === 0 || screen.height === 0) {
                this.fraudIndicators.push('invalid_screen');
                score += 15;
            }
            
            return score;
        }
        
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in kilometers
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
        
        // ===== ENHANCED SEARCH TRACKING =====
        setupSearchTracking() {
            if (!this.config.trackSearch) return;
            
            // Track search inputs
            document.addEventListener('input', (e) => {
                if (this.isSearchField(e.target)) {
                    this.trackSearchInput(e.target);
                }
            });
            
            // Track search form submissions
            document.addEventListener('submit', (e) => {
                const searchInput = e.target.querySelector('input[type="search"], input[name*="search"], input[name*="query"]');
                if (searchInput) {
                    this.trackSearchSubmission(searchInput.value, e.target);
                }
            });
        }
        
        isSearchField(element) {
            if (element.type === 'search') return true;
            
            const searchTerms = ['search', 'query', 'find', 'lookup'];
            const name = (element.name || '').toLowerCase();
            const id = (element.id || '').toLowerCase();
            const placeholder = (element.placeholder || '').toLowerCase();
            
            return searchTerms.some(term => 
                name.includes(term) || id.includes(term) || placeholder.includes(term)
            );
        }
        
        trackSearchInput(input) {
            const value = input.value.trim();
            if (value.length < 2) return;
            
            // Debounce search tracking
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.sendEvent({
                    type: 'search_input',
                    query: value,
                    inputField: input.name || input.id || 'unknown',
                    fingerprint: this.fingerprintLabel,
                    timestamp: Date.now()
                });
            }, 500);
        }
        
        trackSearchSubmission(query, form) {
            this.sendEvent({
                type: 'search_submission',
                query: query,
                formAction: form.action || window.location.href,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        // ===== CONTENT ENGAGEMENT TRACKING =====
        setupContentTracking() {
            if (!this.config.trackContent) return;
            
            this.observeContentElements();
            this.trackReadingProgress();
            this.trackTimeOnContent();
        }
        
        observeContentElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackContentView(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            // Observe main content elements
            const contentSelectors = [
                'article', 'main', '.content', '.post', '.article',
                'h1', 'h2', 'h3', 'p', '.paragraph'
            ];
            
            contentSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    observer.observe(el);
                });
            });
        }
        
        trackContentView(element) {
            const contentId = element.id || element.className || element.tagName;
            const content = element.textContent.substring(0, 100);
            
            this.sendEvent({
                type: 'content_view',
                contentId: contentId,
                contentPreview: content,
                elementType: element.tagName,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        trackReadingProgress() {
            let maxScroll = 0;
            
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    // Track reading milestones
                    if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                        this.sendEvent({
                            type: 'reading_progress',
                            percentage: scrollPercent,
                            contentTitle: document.title,
                            fingerprint: this.fingerprintLabel,
                            timestamp: Date.now()
                        });
                    }
                }
            });
        }
        
        trackTimeOnContent() {
            const startTime = Date.now();
            let lastActive = startTime;
            
            // Track active time (when user is actively engaging)
            const updateActiveTime = () => {
                lastActive = Date.now();
            };
            
            document.addEventListener('mousemove', updateActiveTime);
            document.addEventListener('scroll', updateActiveTime);
            document.addEventListener('keypress', updateActiveTime);
            
            // Send engagement milestones
            const milestones = [30, 60, 120, 300]; // seconds
            milestones.forEach(milestone => {
                setTimeout(() => {
                    const now = Date.now();
                    const activeTime = lastActive - startTime;
                    
                    if (activeTime >= milestone * 1000) {
                        this.sendEvent({
                            type: 'content_engagement',
                            content: document.title,
                            milestone: milestone === 300 ? 'final' : `${milestone}s`,
                            time: `${Math.round(activeTime / 1000)}s`,
                            fingerprint: this.fingerprintLabel,
                            timestamp: now
                        });
                    }
                }, milestone * 1000);
            });
        }
        
        // ===== NETWORK FINGERPRINTING =====
        initNetworkFingerprinting() {
            if (!this.config.fingerprintComponents.network) return;
            
            this.profileNetworkCharacteristics();
        }
        
        async profileNetworkCharacteristics() {
            const profile = {
                connectionType: this.getConnectionType(),
                downlink: this.getDownlink(),
                rtt: await this.measureRTT(),
                dnsResolution: await this.measureDNSResolution(),
                bandwidthEstimate: await this.estimateBandwidth()
            };
            
            this.networkProfile = profile;
            
            this.sendEvent({
                type: 'network_profile',
                profile: profile,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        getConnectionType() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection ? {
                effectiveType: connection.effectiveType,
                type: connection.type,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            } : null;
        }
        
        getDownlink() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection ? connection.downlink : null;
        }
        
        async measureRTT() {
            const start = performance.now();
            try {
                await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
                return performance.now() - start;
            } catch (e) {
                return null;
            }
        }
        
        async measureDNSResolution() {
            const domains = ['google.com', 'cloudflare.com', 'amazonaws.com'];
            const times = [];
            
            for (const domain of domains) {
                const start = performance.now();
                try {
                    await fetch(`https://${domain}/favicon.ico`, { method: 'HEAD', cache: 'no-cache' });
                    times.push(performance.now() - start);
                } catch (e) {
                    // DNS resolution failed or blocked
                }
            }
            
            return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : null;
        }
        
        async estimateBandwidth() {
            const start = performance.now();
            try {
                const response = await fetch('/favicon.ico', { cache: 'no-cache' });
                const end = performance.now();
                const size = parseInt(response.headers.get('content-length') || '0');
                const duration = (end - start) / 1000; // seconds
                return duration > 0 ? (size * 8) / (duration * 1000) : null; // kbps
            } catch (e) {
                return null;
            }
        }
        
        // ===== BEHAVIORAL FINGERPRINTING =====
        initBehavioralFingerprinting() {
            if (!this.config.fingerprintComponents.behavioral) return;
            
            this.setupTypingPatternTracking();
            this.setupMousePatternTracking();
            this.setupClickPatternTracking();
        }
        
        setupTypingPatternTracking() {
            let keyEvents = [];
            
            document.addEventListener('keydown', (e) => {
                keyEvents.push({
                    key: e.key === ' ' ? 'Space' : (e.key.length === 1 ? 'Letter' : e.key),
                    timestamp: Date.now(),
                    duration: 0
                });
            });
            
            document.addEventListener('keyup', (e) => {
                if (keyEvents.length > 0) {
                    const lastEvent = keyEvents[keyEvents.length - 1];
                    lastEvent.duration = Date.now() - lastEvent.timestamp;
                }
                
                // Analyze typing patterns every 50 keystrokes
                if (keyEvents.length >= 50) {
                    this.analyzeTypingPattern(keyEvents);
                    keyEvents = keyEvents.slice(-25); // Keep last 25 for continuity
                }
            });
        }
        
        analyzeTypingPattern(events) {
            const durations = events.map(e => e.duration).filter(d => d > 0);
            const intervals = [];
            
            for (let i = 1; i < events.length; i++) {
                intervals.push(events[i].timestamp - events[i-1].timestamp);
            }
            
            const pattern = {
                avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
                avgInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length,
                rhythm: this.calculateRhythm(intervals),
                timestamp: Date.now()
            };
            
            this.behaviorProfile.typingPatterns.push(pattern);
            
            // Keep only recent patterns
            if (this.behaviorProfile.typingPatterns.length > 10) {
                this.behaviorProfile.typingPatterns = this.behaviorProfile.typingPatterns.slice(-5);
            }
        }
        
        setupMousePatternTracking() {
            let mouseEvents = [];
            let lastMouse = { x: 0, y: 0, timestamp: Date.now() };
            
            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                const timeDiff = now - lastMouse.timestamp;
                
                if (timeDiff > 50) { // Sample every 50ms
                    const distance = Math.sqrt(
                        Math.pow(e.clientX - lastMouse.x, 2) + 
                        Math.pow(e.clientY - lastMouse.y, 2)
                    );
                    
                    mouseEvents.push({
                        x: e.clientX,
                        y: e.clientY,
                        distance: distance,
                        velocity: timeDiff > 0 ? distance / timeDiff : 0,
                        timestamp: now
                    });
                    
                    lastMouse = { x: e.clientX, y: e.clientY, timestamp: now };
                }
                
                // Analyze patterns every 100 movements
                if (mouseEvents.length >= 100) {
                    this.analyzeMousePattern(mouseEvents);
                    mouseEvents = mouseEvents.slice(-50); // Keep last 50
                }
            });
        }
        
        analyzeMousePattern(events) {
            const velocities = events.map(e => e.velocity).filter(v => v > 0);
            const distances = events.map(e => e.distance).filter(d => d > 0);
            
            const pattern = {
                avgVelocity: velocities.reduce((a, b) => a + b, 0) / velocities.length,
                avgDistance: distances.reduce((a, b) => a + b, 0) / distances.length,
                smoothness: this.calculateSmoothness(events),
                timestamp: Date.now()
            };
            
            this.behaviorProfile.mousePatterns.push(pattern);
            
            // Keep only recent patterns
            if (this.behaviorProfile.mousePatterns.length > 10) {
                this.behaviorProfile.mousePatterns = this.behaviorProfile.mousePatterns.slice(-5);
            }
        }
        
        setupClickPatternTracking() {
            let clickEvents = [];
            
            document.addEventListener('click', (e) => {
                clickEvents.push({
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button,
                    timing: Date.now(),
                    element: e.target.tagName
                });
                
                // Analyze click patterns every 20 clicks
                if (clickEvents.length >= 20) {
                    this.analyzeClickPattern(clickEvents);
                    clickEvents = clickEvents.slice(-10); // Keep last 10
                }
            });
        }
        
        analyzeClickPattern(events) {
            const intervals = [];
            for (let i = 1; i < events.length; i++) {
                intervals.push(events[i].timing - events[i-1].timing);
            }
            
            const pattern = {
                avgInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length,
                rhythm: this.calculateRhythm(intervals),
                spread: this.calculateClickSpread(events),
                timestamp: Date.now()
            };
            
            this.behaviorProfile.clickPatterns.push(pattern);
            
            // Keep only recent patterns
            if (this.behaviorProfile.clickPatterns.length > 10) {
                this.behaviorProfile.clickPatterns = this.behaviorProfile.clickPatterns.slice(-5);
            }
        }
        
        calculateRhythm(intervals) {
            if (intervals.length < 2) return 0;
            
            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / intervals.length;
            return Math.sqrt(variance);
        }
        
        calculateSmoothness(events) {
            if (events.length < 3) return 1;
            
            let direction_changes = 0;
            for (let i = 2; i < events.length; i++) {
                const prev_dx = events[i-1].x - events[i-2].x;
                const prev_dy = events[i-1].y - events[i-2].y;
                const curr_dx = events[i].x - events[i-1].x;
                const curr_dy = events[i].y - events[i-1].y;
                
                const dot_product = prev_dx * curr_dx + prev_dy * curr_dy;
                if (dot_product < 0) direction_changes++;
            }
            
            return 1 - (direction_changes / (events.length - 2));
        }
        
        calculateClickSpread(events) {
            if (events.length < 2) return 0;
            
            const xs = events.map(e => e.x);
            const ys = events.map(e => e.y);
            
            const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
            const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
            
            const distances = events.map(e => 
                Math.sqrt(Math.pow(e.x - avgX, 2) + Math.pow(e.y - avgY, 2))
            );
            
            return distances.reduce((a, b) => a + b, 0) / distances.length;
        }
        
        // ===== USER JOURNEY MAPPING =====
        initUserJourney() {
            this.userJourney = this.loadUserJourney();
            this.trackJourneyStep();
        }
        
        trackJourneyStep() {
            const step = {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                fingerprint: this.fingerprintLabel
            };
            
            this.userJourney.push(step);
            
            // Keep last 50 steps
            if (this.userJourney.length > 50) {
                this.userJourney = this.userJourney.slice(-25);
            }
            
            this.storeUserJourney();
            
            this.sendEvent({
                type: 'journey_step',
                step: step,
                journeyLength: this.userJourney.length,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        loadUserJourney() {
            try {
                const stored = localStorage.getItem('da_user_journey');
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        }
        
        storeUserJourney() {
            try {
                localStorage.setItem('da_user_journey', JSON.stringify(this.userJourney));
            } catch (e) {}
        }
        
        // ===== SESSION REPLAY =====
        initSessionReplay() {
            if (!this.config.enableSessionReplay) return;
            
            this.sessionReplayData = [];
            this.setupReplayTracking();
        }
        
        setupReplayTracking() {
            // Track DOM mutations
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    this.recordMutation(mutation);
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true,
                characterData: true,
                characterDataOldValue: true
            });
            
            // Track user interactions
            ['click', 'input', 'scroll', 'resize'].forEach(eventType => {
                document.addEventListener(eventType, (e) => {
                    this.recordInteraction(eventType, e);
                });
            });
        }
        
        recordMutation(mutation) {
            const record = {
                type: 'mutation',
                mutationType: mutation.type,
                target: this.getElementSelector(mutation.target),
                timestamp: Date.now()
            };
            
            if (mutation.type === 'childList') {
                record.addedNodes = Array.from(mutation.addedNodes).map(node => 
                    node.nodeType === 1 ? this.getElementSelector(node) : node.textContent
                );
                record.removedNodes = Array.from(mutation.removedNodes).map(node => 
                    node.nodeType === 1 ? this.getElementSelector(node) : node.textContent
                );
            }
            
            this.sessionReplayData.push(record);
            this.limitReplayData();
        }
        
        recordInteraction(eventType, event) {
            const record = {
                type: 'interaction',
                eventType: eventType,
                target: this.getElementSelector(event.target),
                timestamp: Date.now()
            };
            
            if (eventType === 'click') {
                record.coordinates = { x: event.clientX, y: event.clientY };
            } else if (eventType === 'scroll') {
                record.scroll = { x: window.scrollX, y: window.scrollY };
            } else if (eventType === 'input') {
                record.value = event.target.value ? event.target.value.length : 0; // Track length, not content
            }
            
            this.sessionReplayData.push(record);
            this.limitReplayData();
        }
        
        getElementSelector(element) {
            if (!element || element.nodeType !== 1) return 'unknown';
            
            let selector = element.tagName.toLowerCase();
            
            if (element.id) {
                selector += `#${element.id}`;
            } else if (element.className) {
                selector += `.${element.className.split(' ')[0]}`;
            }
            
            return selector;
        }
        
        limitReplayData() {
            // Keep only last 1000 replay events
            if (this.sessionReplayData.length > 1000) {
                this.sessionReplayData = this.sessionReplayData.slice(-500);
            }
        }

        getFingerprint() {
            return {
                fingerprint: this.fingerprint,
                label: this.fingerprintLabel
            };
        }

        // ===== ENHANCED API METHODS =====
        
        // Configuration Management
        setConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.log('Configuration updated', 'info');
        }
        
        getConfig() {
            return { ...this.config };
        }
        
        // Advanced A/B Testing
        createABTest(testName, variants, trafficSplit = 0.5) {
            const tests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
            tests[testName] = {
                variants: variants,
                trafficSplit: trafficSplit,
                createdAt: Date.now()
            };
            localStorage.setItem('da_ab_tests', JSON.stringify(tests));
            
            this.sendEvent({
                type: 'ab_test_created',
                testName: testName,
                variants: variants,
                trafficSplit: trafficSplit,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        getABTestVariant(testName) {
            const tests = JSON.parse(localStorage.getItem('da_ab_tests') || '{}');
            const assignments = JSON.parse(localStorage.getItem('da_ab_assignments') || '{}');
            const userKey = `${this.fingerprintLabel}_${testName}`;
            
            if (assignments[userKey]) {
                return assignments[userKey];
            }
            
            const test = tests[testName];
            if (!test) return null;
            
            const hash = this.hashCode(this.fingerprintLabel + testName);
            const variant = hash < test.trafficSplit ? test.variants[0] : test.variants[1];
            
            assignments[userKey] = variant;
            localStorage.setItem('da_ab_assignments', JSON.stringify(assignments));
            
            return variant;
        }
        
        trackABTest(testName, event, properties = {}) {
            const variant = this.getABTestVariant(testName);
            this.sendEvent({
                type: 'ab_test_conversion',
                testName: testName,
                variant: variant,
                event: event,
                properties: properties,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        getABTestResults(testName) {
            // This would typically be retrieved from your backend
            return {
                testName: testName,
                note: 'Results would be calculated on your backend with collected data'
            };
        }
        
        // Enhanced Funnel Analytics
        createFunnel(funnelName, steps) {
            const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
            funnels[funnelName] = {
                steps: steps,
                createdAt: Date.now()
            };
            localStorage.setItem('da_funnels', JSON.stringify(funnels));
            
            this.sendEvent({
                type: 'funnel_created',
                funnelName: funnelName,
                steps: steps,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        trackFunnelStep(funnelName, stepName, properties = {}) {
            const funnels = JSON.parse(localStorage.getItem('da_funnels') || '{}');
            const funnel = funnels[funnelName];
            
            if (!funnel) {
                this.log(`Funnel not found: ${funnelName}`, 'warn');
                return;
            }
            
            const stepIndex = funnel.steps.indexOf(stepName);
            if (stepIndex === -1) {
                this.log(`Step not found in funnel ${funnelName}: ${stepName}`, 'warn');
                return;
            }
            
            const userFunnels = JSON.parse(localStorage.getItem('da_user_funnels') || '{}');
            const userKey = `${this.fingerprintLabel}_${funnelName}`;
            
            if (!userFunnels[userKey]) {
                userFunnels[userKey] = {
                    startedAt: Date.now(),
                    steps: []
                };
            }
            
            userFunnels[userKey].steps.push({
                step: stepName,
                timestamp: Date.now(),
                properties: properties
            });
            
            localStorage.setItem('da_user_funnels', JSON.stringify(userFunnels));
            
            // Check if funnel is completed
            const completedSteps = userFunnels[userKey].steps.map(s => s.step);
            const isComplete = funnel.steps.every(step => completedSteps.includes(step));
            
            this.sendEvent({
                type: isComplete ? 'funnel_completed' : 'funnel_step',
                funnelName: funnelName,
                stepName: stepName,
                stepIndex: stepIndex,
                totalSteps: funnel.steps.length,
                completed: isComplete,
                properties: properties,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        getFunnelData(funnelName) {
            const userFunnels = JSON.parse(localStorage.getItem('da_user_funnels') || '{}');
            const userKey = `${this.fingerprintLabel}_${funnelName}`;
            return userFunnels[userKey] || null;
        }
        
        // Enhanced User Journey
        trackUserJourney(event, properties = {}) {
            const journey = JSON.parse(localStorage.getItem('da_user_journey') || '[]');
            journey.push({
                event: event,
                properties: properties,
                timestamp: Date.now(),
                page: window.location.pathname
            });
            
            // Keep only last 100 journey events
            if (journey.length > 100) {
                journey.splice(0, journey.length - 100);
            }
            
            localStorage.setItem('da_user_journey', JSON.stringify(journey));
            
            this.sendEvent({
                type: 'journey_step',
                event: event,
                properties: properties,
                fingerprint: this.fingerprintLabel,
                timestamp: Date.now()
            });
        }
        
        getUserJourney() {
            return JSON.parse(localStorage.getItem('da_user_journey') || '[]');
        }
        
        // Session Replay Controls
        startSessionReplay(options = {}) {
            this.sessionReplayConfig = {
                captureClicks: true,
                captureScrolls: true,
                captureForms: false,
                sampleRate: 0.1,
                ...options
            };
            
            if (Math.random() > this.sessionReplayConfig.sampleRate) return;
            
            this.isRecording = true;
            this.sessionReplayData = [];
            this.log('Session replay started');
        }
        
        stopSessionReplay() {
            this.isRecording = false;
            this.log('Session replay stopped');
        }
        
        getSessionReplayUrl() {
            // This would typically return a URL to view the replay
            return `https://your-dashboard.com/replay/${this.fingerprintLabel}/${this.sessionId}`;
        }
        
        // Analytics Data Export
        exportAnalyticsData() {
            return {
                fingerprint: this.fingerprintLabel,
                sessionId: this.sessionId,
                abTests: JSON.parse(localStorage.getItem('da_ab_assignments') || '{}'),
                funnels: JSON.parse(localStorage.getItem('da_user_funnels') || '{}'),
                journey: JSON.parse(localStorage.getItem('da_user_journey') || '[]'),
                behaviorData: this.behaviorData,
                fraudScore: this.fraudScore,
                botScore: this.botScore
            };
        }
        
        // Health Monitoring
        getHealth() {
            return {
                queueSize: this.eventQueue.length,
                errors: this.errorCount || 0,
                lastEventSent: this.lastEventTime || null,
                isOnline: this.isOnline,
                fingerprintLabel: this.fingerprintLabel
            };
        }
        
        // Utility Methods
        hashCode(str) {
            let hash = 0;
            if (str.length === 0) return hash;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash) / 2147483647; // Normalize to 0-1
        }

        destroy() {
            // Clean up event listeners
            this.isRecording = false;
            this.log('Analytik destroyed');
        }
    }

    // Auto-initialize if config is available
    if (window.AnalyticsConfig) {
        window.analytik = new DiscordAnalytics(window.AnalyticsConfig);
        window.discordAnalytics = window.analytik; // Backward compatibility
    }

    // Export for manual initialization
    window.Analytik = DiscordAnalytics;
    window.DiscordAnalytics = DiscordAnalytics; // Backward compatibility

})(window, document);
