---
sidebar_position: 3
title: Quick Start
---

# Quick Start

Integration requires just **two steps**: add the Babel plugin and wrap your app with `InsightechProvider`.

## Step 1: Add the Babel Plugin

```js title="babel.config.js"
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // or 'module:metro-react-native-babel-preset'
    plugins: ['@insightech/react-native/babel-plugin'],
  };
};
```

:::note
The plugin is **bundled inside `@insightech/react-native`**. There is no separate `@insightech/babel-plugin-react-native` npm package — use the path above, not a standalone install.
:::

:::note Expo users
Expo apps don't ship with a `babel.config.js` by default. Create the file at your project root with the contents above; Metro will pick it up automatically on the next start.
:::

The plugin automatically instruments interactive components at build time. Your app code stays 100% standard React Native — no imports to change, no components to swap.

**What the plugin does:** It rewrites `react-native` imports so interactive components are replaced with tracked equivalents:

```js
// Your code (unchanged):
import { View, Text, Pressable, TextInput } from 'react-native';

// After Babel transform (automatic):
import { View, Text } from 'react-native';
import { TrackedPressable as Pressable, TrackedTextInput as TextInput } from '@insightech/react-native';
```

:::note
After adding or changing the Babel plugin config, clear the Metro cache:
- Expo: `npx expo start --clear`
- RN CLI: `npx react-native start --reset-cache`
:::

## Step 2: Wrap Your App

Pick the section that matches your navigation setup.

### Option A — React Navigation

```tsx title="App.tsx"
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { InsightechProvider } from '@insightech/react-native';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <InsightechProvider
      config={{
        account: 'YOUR_PROFILE_ID:YOUR_SERVER_ID',
        appName: 'MyApp',
      }}
      navigationRef={navigationRef}
    >
      <NavigationContainer ref={navigationRef}>
        {/* Your app navigator */}
      </NavigationContainer>
    </InsightechProvider>
  );
}
```

### Option B — Expo Router

Expo Router manages `NavigationContainer` internally, so there's no ref to pass. Use the bundled `useInsightechExpoRouter` hook instead:

```tsx title="app/_layout.tsx"
import { Stack } from 'expo-router';
import {
  InsightechProvider,
  useInsightech,
} from '@insightech/react-native';
import { useInsightechExpoRouter } from '@insightech/react-native/expo-router';

function ScreenTracker() {
  const sdk = useInsightech();
  useInsightechExpoRouter(sdk);
  return null;
}

export default function RootLayout() {
  return (
    <InsightechProvider
      config={{
        account: 'YOUR_PROFILE_ID:YOUR_SERVER_ID',
        appName: 'MyApp',
      }}
    >
      <ScreenTracker />
      <Stack />
    </InsightechProvider>
  );
}
```

:::tip Where to find your account string
Your account string is formatted as `profileId:serverId`. Log in to the [Insightech dashboard](https://cloud.insightech.com), open your profile's tracking code snippet, and copy both values from the JavaScript installation snippet. (There is no separate "API Keys" page.)
:::

:::note Web platform
The SDK is optimised for iOS and Android native builds. If you also run the same Expo project on web, you may see harmless `TrackedScrollView` warnings in development — web replay is not supported.
:::

That's it. The SDK starts tracking as soon as a screen is registered. Open your app, navigate a few screens, then check the [Replay List](https://cloud.insightech.com) in the dashboard.

:::caution No screen tracked
If you see the console warning `[Insightech] No screen tracked after 10s`, the SDK has no URL to attach events to and is holding everything in memory. Double-check that `attachNavigation()` or `useInsightechExpoRouter()` is wired up in your root component.
:::

## Development Mode

Set `devMode: true` during development to see SDK logs in Metro and generate a new visitor ID on each reload:

```tsx
<InsightechProvider
  config={{
    account: 'YOUR_PROFILE_ID:YOUR_SERVER_ID',
    appName: 'MyApp',
    devMode: __DEV__,  // Auto-enable in development
  }}
  navigationRef={navigationRef}
/>
```
