# Analytik 🔥

**The Ultimate Auto-Tracking JavaScript Analytics Library with Discord Integration**

Transform your website analytics with real-time Discord notifications, advanced user tracking, persistent device fingerprinting, A/B testing, funnel analytics, and comprehensive user journey mapping.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/analytik.svg)](https://www.npmjs.com/package/analytik)
[![Discord](https://img.shields.io/discord/YOUR_DISCORD_ID.svg?label=discord)](https://discord.gg/YOUR_INVITE)

## ✨ Features

### 🎯 **Comprehensive Auto-Tracking**
- **Page Analytics**: Views, sessions, bounce rate, user flows
- **Interaction Tracking**: Clicks, scrolls, hovers, form interactions
- **Performance Monitoring**: Core Web Vitals, load times, errors
- **Media Analytics**: Video/audio events, download tracking
- **User Behavior**: Mouse patterns, time on page, engagement
- **E-commerce**: Cart actions, checkout flows, conversions

### 💬 **Discord Integration**
- **Rich Embeds**: Beautiful, formatted analytics reports
- **Real-time Notifications**: Instant event alerts
- **Geolocation Maps**: Clickable Google Maps links
- **Custom Branding**: Bot names, avatars, embed colors
- **Batch Reporting**: Efficient event grouping
- **Alert System**: Automated anomaly detection

### 🔒 **Advanced Device Fingerprinting**
- **Persistent Identification**: Survives cookies, incognito, browser changes
- **Multi-Layer Hashing**: Hardware, browser, canvas, WebGL, audio
- **Unique Labels**: Human-readable device identifiers (e.g., `SuperLion2838`)
- **Cross-Session Tracking**: Link user behavior across visits
- **Privacy Compliant**: GDPR/CCPA options included

### 🛡️ **Privacy & Security**
- **GDPR/CCPA Ready**: Built-in compliance features
- **PII Protection**: Automatic masking of sensitive data
- **Consent Management**: Configurable user consent
- **Do Not Track**: Respects DNT headers
- **Bot Detection**: Advanced filtering systems

## 🚀 Quick Start (5 Minutes)

### 1. Create Discord Webhook

1. Open your Discord server settings
2. Go to **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Choose your channel and copy the webhook URL

### 2. Add to Your Website

```html
<!-- NPM Installation -->
<script src="https://unpkg.com/analytik@latest/dist/analytik.min.js"></script>

<!-- Basic Setup -->
<script>
window.AnalyticsConfig = {
  webhook: "https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE",
  trackClicks: true,
  trackScrolling: true,
  trackGeolocation: true,
  enableFingerprinting: true,
  includeMapLinks: true,
  
  // Enable all advanced features
  trackABTests: true,
  trackFunnels: true,
  enableBotDetection: true,
  enableFraudDetection: true,
  trackUserJourney: true,
  enableSessionReplay: true
};
</script>

```
#### Or you can use this

```html
<!-- NPM Installation -->
<script src="https://unpkg.com/analytik@latest/dist/analytik.min.js"></script>

<!-- Advanced Setup with All Features -->
<script>
window.AnalyticsConfig = {
  // Discord Configuration
  webhook: "https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE",
  discordBotName: "Analytik Bot",
  discordBotAvatar: "https://your-site.com/bot-avatar.png",
  discordEmbedColor: "#5865F2",
  
  // Core Tracking
  trackPageViews: true,
  trackClicks: true,
  trackScrolling: true,
  trackForms: true,
  trackErrors: true,
  trackPerformance: true,
  
  // Advanced Features
  enableFingerprinting: true,
  trackABTests: true,
  trackFunnels: true,
  trackUserJourney: true,
  enableSessionReplay: true,
  trackContentEngagement: true,
  trackSearchWithAutocomplete: true,
  
  // Security & Detection
  enableBotDetection: true,
  enableFraudDetection: true,
  suspiciousActivityThreshold: 10,
  
  // Geolocation
  trackGeolocation: true,
  includeMapLinks: true,
  geolocationAccuracy: "high",
  
  // Discord Embed Buttons
  enableEmbedButtons: true,
  embedButtons: [
    {
      label: "View Details",
      url: "https://your-dashboard.com/user/{fingerprint}",
      style: "primary"
    },
    {
      label: "Block User",
      url: "https://your-admin.com/block/{fingerprint}",
      style: "danger"
    }
  ],
  
  // Privacy & Compliance
  respectDNT: true,
  anonymizeIP: true,
  maskPII: true,
  enableGDPRMode: true,
  
  // Performance
  samplingRate: 1.0,
  batchSize: 10,
  compressionEnabled: true,
  
  // Debug Mode
  debug: false,
  verbose: false
};
</script>
```

### 3. Start Tracking

```javascript
// Custom events
analytik.track('Purchase', {
  product: 'Premium Plan',
  value: 99.99,
  currency: 'USD'
});

// User identification
analytik.identify('user_123', {
  name: 'John Doe',
  plan: 'premium'
});

// A/B Testing
analytik.createABTest('header_design', ['blue_header', 'red_header'], 0.5);
const variant = analytik.getABTestVariant('header_design');

// Funnel Analytics
analytik.createFunnel('checkout_flow', [
  'product_view',
  'add_to_cart', 
  'checkout_start',
  'payment_info',
  'purchase_complete'
]);
analytik.trackFunnelStep('checkout_flow', 'add_to_cart');

// Session Replay
analytik.startSessionReplay();

// User Journey
analytik.trackUserJourney('onboarding_started');
```

## 📊 A/B Testing & Funnel Analytics

### A/B Testing
```javascript
// Create A/B test
analytik.createABTest('pricing_page', ['version_a', 'version_b'], 0.5);

// Get user's variant
const variant = analytik.getABTestVariant('pricing_page');
if (variant === 'version_a') {
  // Show version A
} else {
  // Show version B
}

// Track A/B test conversion
analytik.trackABTest('pricing_page', 'conversion', {
  value: 99.99,
  variant: variant
});

// Get A/B test results
const results = analytik.getABTestResults('pricing_page');
```

### Funnel Analytics
```javascript
// Create funnel
analytik.createFunnel('signup_flow', [
  'landing_page',
  'signup_form',
  'email_verification',
  'profile_setup',
  'first_login'
]);

// Track funnel steps
analytik.trackFunnelStep('signup_flow', 'signup_form', {
  source: 'homepage_cta'
});

// Get funnel conversion rates
const funnelData = analytik.getFunnelData('signup_flow');
```

### User Journey Mapping
```javascript
// Track user journey events
analytik.trackUserJourney('onboarding_started', {
  source: 'marketing_email',
  campaign: 'summer_2025'
});

analytik.trackUserJourney('feature_discovered', {
  feature: 'advanced_filters',
  time_to_discovery: 1200 // seconds
});

// Get user journey path
const journey = analytik.getUserJourney();
```

### Session Replay
```javascript
// Start session replay
analytik.startSessionReplay({
  captureClicks: true,
  captureScrolls: true,
  captureForms: false, // Don't capture sensitive form data
  sampleRate: 0.1 // Record 10% of sessions
});

// Stop session replay
analytik.stopSessionReplay();

// Get session replay URL
const replayUrl = analytik.getSessionReplayUrl();
```

## 📖 Complete Configuration

### Installation Methods

#### NPM Package
```bash
npm install analytik
```

```javascript
import Analytik from 'analytik';

const analytics = new Analytik({
  webhook: 'YOUR_WEBHOOK',
  trackClicks: true
});
```

#### CDN
```html
<script src="https://unpkg.com/analytik@latest/dist/analytik.min.js"></script>
<script>
const analytics = new Analytik({
  webhook: 'YOUR_WEBHOOK'
});
</script>
```

### Discord Settings
```javascript
window.AnalyticsConfig = {
  // Required Discord Configuration
  webhook: "https://discord.com/api/webhooks/...",
  discordBotName: "My Site Analytics",
  discordBotAvatar: "https://your-site.com/bot-avatar.png",
  discordEmbedColor: 0x3498db,
  
  // Auto-Tracking Features
  trackPageViews: true,        // Page view events
  trackClicks: true,           // Click tracking with heatmaps
  trackScrolling: true,        // Scroll depth analytics
  trackMouse: false,           // Mouse movement patterns
  trackForms: true,            // Form interactions & submissions
  trackGeolocation: true,      // User location with maps
  trackPerformance: true,      // Core Web Vitals & load times
  trackErrors: true,           // JavaScript error monitoring
  trackUserBehavior: true,     // Engagement & behavior patterns
  trackContent: true,          // Content interaction analytics
  trackSearch: true,           // Site search tracking
  trackEcommerce: false,       // E-commerce events
  trackMedia: true,            // Video/audio events
  trackDownloads: true,        // File download tracking
  trackPrint: false,           // Print event tracking
  trackClipboard: false,       // Copy/paste tracking
  
  // Advanced Fingerprinting
  enableFingerprinting: true,
  fingerprintPersistence: true,
  fingerprintComponents: {
    hardware: true,            // CPU, GPU, screen, memory
    browser: true,             // User agent, plugins, settings
    network: true,             // Connection type & speed
    behavioral: true,          // Typing & click patterns
    canvas: true,              // Canvas rendering fingerprint
    webgl: true,               // WebGL capabilities
    audio: true,               // Audio context fingerprinting
    fonts: true                // Available fonts detection
  },
  
  // Geolocation Settings
  geolocationAccuracy: "high", // "high" or "low"
  geolocationTimeout: 10000,   // Request timeout (ms)
  geolocationMaxAge: 600000,   // Cache duration (ms)
  includeMapLinks: true,       // Google Maps integration
  
  // Privacy & Compliance
  respectDNT: true,            // Honor Do Not Track
  anonymizeIP: true,           // IP address anonymization
  maskPII: true,               // Auto-mask sensitive data
  requireConsent: false,       // Require user consent
  consentCookieName: "analytics_consent",
  
  // Performance & Behavior
  samplingRate: 1.0,           // Event sampling (0.0-1.0)
  batchSize: 10,               // Events per batch
  maxRetries: 3,               // Failed request retries
  offlineStorage: true,        // Queue events when offline
  compressionEnabled: true,    // Compress event data
  
  // Discord Message Settings
  embedStyle: "rich",          // "rich" or "simple"
  includeTimestamps: true,     // Add timestamps to events
  includeUserAgent: true,      // Include browser info
  includeReferrer: true,       // Include referrer data
  maxMessageLength: 2000,      // Discord message limit
  
  // Filtering & Exclusions
  excludeElements: ['.sensitive', '#password', '.private'],
  excludePages: ['/admin', '/private'],
  excludeUsers: ['bot', 'crawler'],
  includeTestTraffic: false,
  
  // Alert Thresholds
  alertOnErrors: true,
  alertOnHighTraffic: 1000,    // Events per hour
  alertOnSuspiciousActivity: true,
  
  // Development & Debugging
  debug: false,                // Enable debug mode
  verbose: false,              // Verbose logging
  console: true                // Console output
};
```

## 🎨 Discord Embed Examples

### Page View Event
```json
{
  "title": "👁️ Page View - SuperLion2838",
  "color": 3447003,
  "fields": [
    {
      "name": "📍 Location",
      "value": "[View on Map](https://www.google.com/maps?q=40.7128,-74.0060)",
      "inline": true
    },
    {
      "name": "🌐 URL",
      "value": "https://yoursite.com/pricing",
      "inline": false
    },
    {
      "name": "📱 Device",
      "value": "Mobile • Chrome 91",
      "inline": true
    }
  ],
  "timestamp": "2025-07-09T14:30:15.000Z"
}
```

### E-commerce Event
```json
{
  "title": "🛒 Purchase Completed - QuickEagle7291",
  "color": 2067276,
  "fields": [
    {
      "name": "💰 Value",
      "value": "$99.99 USD",
      "inline": true
    },
    {
      "name": "📦 Product",
      "value": "Premium Plan",
      "inline": true
    },
    {
      "name": "📍 Location",
      "value": "[San Francisco, CA](https://www.google.com/maps?q=37.7749,-122.4194)",
      "inline": true
    }
  ]
}
```

## 🔍 Device Fingerprinting Deep Dive

### How It Works

Discord Analytics creates unique, persistent device identifiers using advanced fingerprinting techniques:

1. **Hardware Fingerprinting**
   - Screen resolution and color depth
   - CPU cores and architecture
   - GPU vendor and renderer
   - Available memory
   - Battery status and level

2. **Browser Fingerprinting**
   - User agent and version
   - Installed plugins and extensions
   - Language preferences
   - Timezone and locale settings
   - Font enumeration

3. **Advanced Techniques**
   - Canvas rendering patterns
   - WebGL capabilities
   - Audio context fingerprinting
   - Network characteristics
   - Behavioral patterns

### Unique Device Labels

Each device gets a memorable identifier:
- **Format**: `[Adjective][Animal][4-digit-number]`
- **Examples**: `SuperLion2838`, `QuickEagle7291`, `SilentWolf1576`
- **Collision Handling**: Automatic regeneration if duplicate detected
- **Persistence**: Stored across multiple browser storage mechanisms

### Persistence Strategy

The fingerprint persists through:
- ✅ Browser restarts
- ✅ Cookie clearing
- ✅ Incognito/private browsing
- ✅ Different browsers on same device
- ✅ VPN usage
- ✅ Browser updates

**Storage Locations:**
- LocalStorage & SessionStorage
- IndexedDB for complex data
- HTTP Cookies (fallback)
- Service Worker storage
- ETag validation

## 📊 Use Cases & Examples

### SaaS Application
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  trackPageViews: true,
  trackClicks: true,
  trackForms: true,
  trackPerformance: true,
  enableFingerprinting: true,
  
  // SaaS-specific settings
  trackEcommerce: true,
  alertOnHighTraffic: 500,
  maskPII: true,
  respectDNT: true
};

// Track feature usage
discordAnalytics.track('Feature Used', {
  feature: 'Dashboard Export',
  plan: 'premium',
  usage_count: 5
});

// Track user onboarding
discordAnalytics.track('Onboarding Step', {
  step: 'Profile Setup',
  completion_rate: 0.7
});
```

### E-commerce Store
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  trackEcommerce: true,
  trackDownloads: true,
  trackGeolocation: true,
  enableFingerprinting: true,
  
  // E-commerce specific
  alertOnHighTraffic: 1000,
  includeMapLinks: true
};

// Track purchases
discordAnalytics.track('Purchase', {
  order_id: 'ORD-12345',
  products: ['laptop', 'mouse'],
  total: 1299.99,
  currency: 'USD',
  shipping_method: 'express'
});

// Track cart abandonment
discordAnalytics.track('Cart Abandoned', {
  cart_value: 299.99,
  items_count: 3,
  stage: 'checkout'
});
```

### Content Website
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  trackContent: true,
  trackScrolling: true,
  trackMedia: true,
  enableFingerprinting: true,
  
  // Content-specific
  trackSearch: true,
  trackPrint: true,
  trackClipboard: true
};

// Track article engagement
discordAnalytics.track('Article Read', {
  article_id: 'how-to-analytics',
  reading_time: 240,
  scroll_depth: 85,
  social_shares: 3
});

// Track video engagement
discordAnalytics.track('Video Watched', {
  video_id: 'tutorial-01',
  duration: 180,
  completion_rate: 0.95
});
```

### Gaming Website
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  trackClicks: true,
  trackMouse: true,
  trackPerformance: true,
  enableFingerprinting: true,
  
  // Gaming-specific
  samplingRate: 0.5, // Reduce load
  batchSize: 20
};

// Track game events
discordAnalytics.track('Game Started', {
  game: 'puzzle-quest',
  level: 15,
  character: 'wizard'
});

// Track achievements
discordAnalytics.track('Achievement Unlocked', {
  achievement: 'speed_demon',
  points: 100,
  rarity: 'rare'
});
```

## 🔧 Advanced Configuration

### Custom Event Tracking
```javascript
// Business events
discordAnalytics.track('Lead Generated', {
  source: 'contact_form',
  quality: 'high',
  estimated_value: 5000
});

// User engagement
discordAnalytics.track('Feature Interaction', {
  feature: 'live_chat',
  duration: 120,
  satisfaction: 'positive'
});

// Performance monitoring
discordAnalytics.track('API Performance', {
  endpoint: '/api/users',
  response_time: 245,
  status_code: 200
});
```

### User Identification
```javascript
// Simple identification
discordAnalytics.identify('user_12345');

// Rich user data
discordAnalytics.identify('user_12345', {
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'enterprise',
  signup_date: '2025-01-15',
  ltv: 25000,
  segment: 'power_user'
});
```

### Dynamic Configuration
```javascript
// Update configuration at runtime
discordAnalytics.setConfig({
  trackMouse: true,
  samplingRate: 0.8
});

// Conditional tracking
if (user.plan === 'enterprise') {
  discordAnalytics.setConfig({
    trackScrolling: true,
    trackMouse: true
  });
}
```

## 🛠️ Installation Methods

### CDN (Recommended)
```html
<script src="https://cdn.jsdelivr.net/npm/discord-analytics@latest/dist/discord-analytics.min.js"></script>
```

### NPM
```bash
npm install discord-analytics
```

```javascript
import DiscordAnalytics from 'discord-analytics';

const analytics = new DiscordAnalytics({
  webhook: 'YOUR_WEBHOOK',
  trackClicks: true
});
```

### Self-Hosted
Download `discord-analytics.js` and host on your server:
```html
<script src="/js/discord-analytics.js"></script>
```

## 🔒 Privacy & Compliance

### GDPR Compliance
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // GDPR settings
  requireConsent: true,
  consentCookieName: "gdpr_consent",
  respectDNT: true,
  anonymizeIP: true,
  maskPII: true,
  
  // Data retention
  maxDataAge: 2592000000, // 30 days in ms
  enableDataDeletion: true
};

// Check consent before tracking
if (hasUserConsent()) {
  // Initialize analytics
}
```

### CCPA Compliance
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // CCPA settings
  enableOptOut: true,
  optOutCookieName: "ccpa_opt_out",
  dataSaleOptOut: true,
  
  // User rights
  enableDataExport: true,
  enableDataDeletion: true
};
```

### Cookie-Free Tracking
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // Cookie-free fingerprinting
  enableFingerprinting: true,
  fingerprintPersistence: false, // No cookies
  
  // Alternative storage
  useSessionStorage: true,
  useIndexedDB: true
};
```

## ⚡ Performance Optimization

### Sampling for High-Traffic Sites
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // Performance settings
  samplingRate: 0.1, // Track 10% of events
  batchSize: 50,      // Larger batches
  compressionEnabled: true,
  
  // Selective tracking
  trackPageViews: true,
  trackClicks: false, // Disable for performance
  trackScrolling: false
};
```

### Async Loading
```javascript
// Load analytics asynchronously
(function() {
  const script = document.createElement('script');
  script.src = '/discord-analytics.js';
  script.async = true;
  script.onload = function() {
    // Analytics loaded
    window.discordAnalytics = new DiscordAnalytics(window.AnalyticsConfig);
  };
  document.head.appendChild(script);
})();
```

### Web Workers
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // Offload fingerprinting to web worker
  useWebWorker: true,
  workerScript: '/analytics-worker.js'
};
```

## 🚨 Error Handling & Debugging

### Debug Mode
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // Debugging
  debug: true,
  verbose: true,
  console: true,
  
  // Error handling
  alertOnErrors: true,
  maxRetries: 5,
  retryDelay: 1000
};
```

### Error Tracking
```javascript
// Automatic error tracking
window.addEventListener('error', (e) => {
  discordAnalytics.track('JavaScript Error', {
    message: e.message,
    filename: e.filename,
    line: e.lineno,
    stack: e.error?.stack
  });
});

// Promise rejection tracking
window.addEventListener('unhandledrejection', (e) => {
  discordAnalytics.track('Promise Rejection', {
    reason: e.reason,
    stack: e.reason?.stack
  });
});
```

### Health Monitoring
```javascript
// Monitor analytics health
setInterval(() => {
  const health = discordAnalytics.getHealth();
  
  if (health.errors > 10) {
    // Too many errors
    console.warn('Analytics errors detected:', health);
  }
  
  if (health.queueSize > 100) {
    // Queue backing up
    console.warn('Analytics queue backing up:', health);
  }
}, 60000); // Check every minute
```

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| Basic Tracking | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fingerprinting | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Geolocation | ✅ | ✅ | ✅ | ✅ | ❌ |
| Service Workers | ✅ | ✅ | ✅ | ✅ | ❌ |
| WebGL Fingerprinting | ✅ | ✅ | ✅ | ✅ | ❌ |
| Audio Fingerprinting | ✅ | ✅ | ⚠️ | ✅ | ❌ |

**Legend:**
- ✅ Full support
- ⚠️ Partial support
- ❌ Not supported

### Fallbacks
```javascript
window.AnalyticsConfig = {
  webhook: "YOUR_WEBHOOK",
  
  // Fallback settings
  enableFallbacks: true,
  fallbackToBasicTracking: true,
  gracefulDegradation: true
};
```

## 🔄 Migration Guide

### From Google Analytics
```javascript
// GA4 Event → Discord Analytics
gtag('event', 'purchase', {
  currency: 'USD',
  value: 99.99
});

// Becomes:
discordAnalytics.track('Purchase', {
  currency: 'USD',
  value: 99.99
});
```

### From Mixpanel
```javascript
// Mixpanel → Discord Analytics
mixpanel.track('Page View', {
  page: '/pricing'
});

// Becomes:
discordAnalytics.track('Page View', {
  page: '/pricing'
});
```

### From Custom Analytics
```javascript
// Custom tracking → Discord Analytics
myAnalytics.send({
  event: 'user_action',
  data: { action: 'click' }
});

// Becomes:
discordAnalytics.track('User Action', {
  action: 'click'
});
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/yourusername/discord-analytics.git
cd discord-analytics
npm install
npm run dev
```

### Running Tests
```bash
npm test
npm run test:integration
npm run test:performance
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 **Documentation**: [docs.discord-analytics.com](https://docs.discord-analytics.com)
- 💬 **Discord**: [Join our community](https://discord.gg/discord-analytics)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/discord-analytics/issues)
- 📧 **Email**: support@discord-analytics.com

## 🎯 Roadmap

### Q2 2025
- [ ] Real-time dashboard
- [ ] A/B testing framework
- [ ] Machine learning insights
- [ ] Mobile SDK

### Q3 2025
- [ ] Session replay
- [ ] Funnel analytics
- [ ] Cohort analysis
- [ ] API webhooks

### Q4 2025
- [ ] Slack integration
- [ ] Teams integration
- [ ] Advanced segmentation
- [ ] Custom dashboards

---

**Made with ❤️ for the Discord community**

*Analytik - The Ultimate Analytics Library for Discord Integration*
