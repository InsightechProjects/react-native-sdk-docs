---
sidebar_position: 10
title: Configuration
---

# Configuration Reference

All configuration options for `InsightechProvider`:

```tsx
<InsightechProvider
  config={{
    // ── Required ──
    account: 'profileId:serverId',  // From your Insightech dashboard
    appName: 'MyApp',               // Used in screen URLs

    // ── Optional ──
    protocol: 'https:',             // Server protocol (default: 'https:')
    trackingLevel: 'full',          // 'full' or 'lite' (default: 'full')
    devMode: false,                 // See Development Mode below (default: false)

    // ── Network ──
    maxConcurrentRequests: 1,       // Max parallel HTTP requests (default: 1)
    sendRequestSize: 200,           // KB threshold to trigger send (default: 200)
    requestTimeout: 10000,          // Request timeout in ms (default: 10000)
    maxRetries: 3,                  // Max retries per failed batch (default: 3)
    retryBaseDelay: 1000,           // Base delay for exponential backoff in ms (default: 1000)

    // ── Event Throttling ──
    scrollInterval: 150,            // Scroll event throttle in ms (default: 150)
    resizeInterval: 150,            // Resize event throttle in ms (default: 150)
    mutationBatchInterval: 200,     // Mutation batch window in ms (default: 200)

    // ── Storage ──
    visitorIdStorageKey: 'insightech_vid', // AsyncStorage key for visitor ID
    maxQueueSize: 1000,             // Max queued events before dropping oldest (default: 1000)
  }}
  navigationRef={navigationRef}     // Optional: React Navigation ref
/>
```

## Configuration Details

### account (required)

Your Insightech profile and server identifier, formatted as `profileId:serverId`. Find this in your Insightech dashboard tracking code snippet.

### appName (required)

Used to build screen URLs. For example, with `appName: 'MyApp'` and a screen named `ProductDetail`, the URL becomes:
```
https://app.insightech.com/rn/MyApp/ProductDetail
```

### devMode

When `true`:
- Generates a new visitor ID on every app start (each reload is a new session)
- Enables `console.log` output for debugging SDK behavior
- Useful during development to see events in Metro logs

```tsx
devMode: __DEV__,  // Auto-enable in development builds only
```

### trackingLevel

- `'full'` (default) — Captures all events including DOM tree and mutations for session replay
- `'lite'` — Captures interaction events only (clicks, scrolls, inputs) without DOM data

### Network Options

| Option | Default | Description |
|--------|---------|-------------|
| `maxConcurrentRequests` | `1` | Limits parallel HTTP requests to prevent network flooding |
| `sendRequestSize` | `200` | KB threshold — queue is flushed when payload exceeds this size |
| `requestTimeout` | `10000` | Request timeout in milliseconds. Requests that take longer are aborted |
| `maxRetries` | `3` | Failed batches are retried with exponential backoff up to this many times |
| `retryBaseDelay` | `1000` | Base delay in ms. Actual delay: `baseDelay * 2^(retryCount-1)` + jitter |

### Event Throttling

| Option | Default | Description |
|--------|---------|-------------|
| `scrollInterval` | `150` | Minimum ms between scroll events |
| `resizeInterval` | `150` | Minimum ms between resize events |
| `mutationBatchInterval` | `200` | Window in ms to batch DOM mutations |

### Storage

| Option | Default | Description |
|--------|---------|-------------|
| `visitorIdStorageKey` | `'insightech_vid'` | AsyncStorage key for persisting the visitor ID across app launches |
| `maxQueueSize` | `1000` | Maximum events in the queue. Oldest events are dropped when exceeded |

## Performance Tuning

For apps with heavy scroll or animation, reduce tracking frequency:

```tsx
config={{
  scrollInterval: 300,        // Less frequent scroll events
  mutationBatchInterval: 500, // Longer mutation batch window
  sendRequestSize: 500,       // Larger batches, fewer network requests
  maxQueueSize: 500,          // Smaller max queue for memory-constrained devices
}}
```
