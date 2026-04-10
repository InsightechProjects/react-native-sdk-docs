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
    plugins: ['@insightech/babel-plugin-react-native'],
  };
};
```

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

:::tip Where to find your account string
Log in to the [Insightech dashboard](https://app.insightech.com). Your profile ID and server ID are in the tracking code snippet, formatted as `profileId:serverId`.
:::

That's it. The SDK starts tracking immediately. Open your app, navigate a few screens, then check the [Replay List](https://app.insightech.com) in the dashboard.

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
