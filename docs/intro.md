---
sidebar_position: 1
slug: /
title: Introduction
---

# Insightech React Native SDK

Insightech analytics SDK for React Native. Captures user interactions, screen views, and component tree snapshots for **session replay**, **heatmaps**, **click maps**, **scroll depth**, and **form analytics** on the Insightech dashboard.

The SDK sends data in the exact same format as the Insightech web JavaScript SDK, so no backend changes are needed.

## Features

- **Zero-code instrumentation** — Babel plugin automatically tracks taps, scrolls, and text input
- **Session replay** — Component trees serialized to a synthetic DOM for full visual replay
- **Privacy-first** — All PII masked on-device before transmission
- **Offline resilient** — Events persisted to AsyncStorage, restored on next launch
- **Lightweight** — Single production dependency (pako for gzip), no native modules
- **Universal** — Works with Expo, RN CLI, Expo Go, Paper, and Fabric

## Requirements

- React >= 17
- React Native >= 0.68
- `@react-native-async-storage/async-storage` >= 1.17
- Optional: `@react-navigation/native` for automatic screen tracking

**Tested with:** React Native 0.68 through 0.76, React 17 and 18, both Paper and Fabric renderers.

## Next Steps

1. [Install the SDK](./installation)
2. [Set up in 2 steps](./quick-start)
3. [See what's tracked automatically](./automatic-tracking)
