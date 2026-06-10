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

    // ── Session Replay ──
    sampleRate: 1.0,                // Fraction of visitors with replay, 0.0–1.0 (default: 1.0)
    maxSnapshotBytes: 500000,       // Drop a DOM snapshot above this approx. size (default: 500000)
    deferTracking: true,            // Defer snapshot/gzip work off the interaction path (default: true)

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
    maxTestIdEntries: 5000,         // Max testID lookup entries before LRU eviction (default: 5000)
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

### sampleRate

Controls **session-replay coverage**, not whether events flow. Analytics events (taps, scrolls, inputs, custom events, errors) are always sent for every visitor; the rate only decides which visitors also capture replay data (DOM tree + mutations).

| `sampleRate` | Visitors with full tracking (replay) | Visitors with lite tracking (events only) |
|--------------|--------------------------------------|-------------------------------------------|
| `1.0` (default) | 100% | 0% |
| `0.5` | 50% | 50% |
| `0.0` | 0% | 100% |

The decision is **deterministic per visitor** — a visitor keeps the same mode across app launches, and the same calculation is used by other Insightech SDKs, so a visitor lands in the same bucket on every platform.

Precedence when multiple settings apply:

1. **Explicit `trackingLevel`** — if you set `trackingLevel: 'full'` or `'lite'`, sampling is bypassed entirely.
2. **Server override (`sr`)** — Insightech can adjust the rate server-side without an app release.
3. **`sampleRate`** — the local default, `1.0` if omitted.

Out-of-range values are clamped to `[0, 1]` (a warning is logged in `devMode`).

### Session Replay Limits

| Option | Default | Description |
|--------|---------|-------------|
| `maxSnapshotBytes` | `500000` | Approximate size limit for a single DOM-tree snapshot. When a snapshot would exceed it, the SDK **drops that snapshot** (skips the type-2 event) rather than send an oversized payload — it never sends a partial tree. Other events keep flowing; only the replay snapshot for that screen is omitted (a warning is logged in `devMode`). Set `Infinity` to disable. |
| `deferTracking` | `true` | Keeps heavy work off the interaction path: DOM snapshots wait for ongoing gestures (`InteractionManager`) and serialize in chunks that yield to the event loop, and gzip of large payloads yields a frame first. Event order is preserved. Set `false` for fully synchronous capture (e.g. in tests). |

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
| `maxTestIdEntries` | `5000` | Maximum `testID` → node-index lookup entries before least-recently-used eviction. Bounds memory on long sessions and virtualized lists (FlatList) that mint many testIDs |

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
