---
sidebar_position: 12
title: How It Works
---

# How It Works

## Architecture Overview

```
Your App
  │
  ├── InsightechProvider (wraps app, captures fiber tree)
  │     │
  │     ├── Babel plugin rewrites imports at build time
  │     │     Pressable → TrackedPressable
  │     │     ScrollView → TrackedScrollView
  │     │     FlatList → TrackedFlatList
  │     │     SectionList → TrackedSectionList
  │     │     TextInput → TrackedTextInput
  │     │
  │     ├── Tracked wrappers intercept user events
  │     │
  │     ├── Component tree serialized to synthetic DOM
  │     │     View → <div>, Text → <span>, Pressable → <button>
  │     │
  │     └── Privacy masking applied on-device
  │
  └── Events batched → compressed → sent to Insightech backend
        ↓
      Insightech Dashboard (replay, heatmaps, funnels, analytics)
```

## Synthetic DOM Tree

React Native has no HTML DOM. The SDK constructs a synthetic DOM by walking the React fiber tree and mapping components to HTML equivalents:

| React Native Component | HTML Element |
|------------------------|-------------|
| `View`, `SafeAreaView`, `KeyboardAvoidingView` | `<div>` |
| `Text` | `<span>` |
| `Image`, `ImageBackground` | `<img>` |
| `TextInput` | `<input>` |
| `ScrollView` | `<div>` (with overflow styles) |
| `FlatList`, `SectionList` | `<ul>` |
| `Pressable`, `TouchableOpacity`, `TouchableHighlight` | `<button>` |
| `Switch` | `<input type="checkbox">` |
| `Modal` | `<div>` |

This synthetic DOM is sent to the backend and used by the replay player to reconstruct the visual layout of your app.

## Screen URLs

Screens are represented as URLs for backend compatibility:

```
https://app.insightech.com/rn/{appName}/{screenName}?param=value
```

For example, navigating to a `ProductDetail` screen with `{ productId: '42' }` generates:
```
https://app.insightech.com/rn/MyApp/ProductDetail?productId=42
```

## Event Batching & Delivery

Events are queued and sent based on type:

| Strategy | Event Types | Behavior |
|----------|-------------|----------|
| **Immediate** | Pageview, DOM tree, navigation, form submit, app background | Sent as soon as queued |
| **Force send** | Clicks, rage taps | Flushes entire queue immediately |
| **Batched** | Scroll, resize, input, mutations | Merged into arrays to reduce payload |
| **Size-based** | All other types | Queue flushed when payload exceeds 200KB |

### Retry & Resilience

- Failed requests are retried with **exponential backoff** (1s, 2s, 4s) up to 3 times
- Events are **persisted to AsyncStorage** on app background and restored on next launch
- Queue is **capped at 1000 events** to prevent unbounded memory growth
- Payloads over 10KB are **gzip compressed** automatically

## Fiber Access & Compatibility

The SDK accesses React's internal fiber properties to serialize the component tree. These are undocumented internals tried in order:

1. `__internalInstanceHandle` — Fabric / New Architecture
2. `_internalFiberInstanceHandleDEV` — Paper / development builds
3. `_reactInternals` — React 18+
4. `_reactInternalInstance` — React 17 / legacy

If fiber access fails, the SDK **degrades gracefully** — events (clicks, scrolls, inputs) are still tracked, but session replay won't have DOM tree data.

:::note
After upgrading React or React Native to a new major version, verify that session replay renders correctly on the Insightech dashboard.
:::
