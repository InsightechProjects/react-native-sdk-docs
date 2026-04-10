---
sidebar_position: 2
title: Installation
---

# Installation

## Install the SDK

```bash
npm install @insightech/react-native @react-native-async-storage/async-storage
```

## Install React Navigation (Recommended)

For automatic screen tracking, install React Navigation:

```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

:::tip
React Navigation is optional but strongly recommended. Without it, you'll need to [track screens manually](./advanced-usage#manual-screen-tracking).
:::

## Expo

No additional setup needed. The SDK has no native modules and works out of the box with Expo managed workflow, bare workflow, and Expo Go.

## React Native CLI

If using `@react-native-async-storage/async-storage` for the first time, run:

```bash
cd ios && pod install
```
