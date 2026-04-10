---
sidebar_position: 13
title: Troubleshooting
---

# Troubleshooting

## No data appearing in the dashboard

1. **Check devMode logs:** Set `devMode: true` and look for `[Insightech:Transport]` logs in Metro. You should see `Response: 200` for successful sends.
2. **Verify account string:** Ensure `account` is formatted as `profileId:serverId` (e.g., `'080360e96:us-0-api'`).
3. **Check date filter:** The dashboard defaults to "Yesterday". Switch to "Today" to see current sessions.
4. **Check the dashboard URL:** Ensure you're viewing the correct profile at `https://cloud.insightech.com/profile/{profileId}/replay/list`.

## Session replay shows empty or broken layout

1. **Check fiber access:** In devMode, look for `[Insightech:Provider] Root fiber captured` in Metro logs. If you see "No fiber found", the SDK can't access the component tree.
2. **Verify RN version:** Ensure you're on a supported React Native version (0.68+).
3. **Add testIDs:** Elements without `testID` use positional selectors which are less stable across renders.
4. **Check for interactions:** Sessions with only a pageview (no clicks or navigation) may not have enough data for replay. Interact with the app to generate click and navigation events.

## Events not being tracked for specific components

1. **Check Babel plugin:** Verify `@insightech/babel-plugin-react-native` is in your `babel.config.js`.
2. **Clear Metro cache:** After changing Babel config, clear the cache:
   - Expo: `npx expo start --clear`
   - RN CLI: `npx react-native start --reset-cache`
3. **Check exclusions:** Make sure the component isn't in the `exclude` list.
4. **Custom wrapper components:** The Babel plugin only instruments direct imports from `react-native`. If you wrap `Pressable` in a custom component, either:
   - Use `TrackedPressable` directly in your wrapper, or
   - Track events manually using `useInsightech`

## High memory usage or battery drain

Adjust throttling and batching settings:

```tsx
config={{
  scrollInterval: 300,        // Less frequent scroll events
  mutationBatchInterval: 500, // Longer mutation batch window
  sendRequestSize: 500,       // Larger batches, fewer requests
  maxQueueSize: 500,          // Smaller max queue
}}
```

## Events lost when app is killed

Events are automatically persisted to AsyncStorage when the app goes to background and restored on next launch. If you're still losing events:

1. Ensure `@react-native-async-storage/async-storage` is properly installed and linked
2. Check that AsyncStorage isn't being cleared by other code in your app
3. Verify the app has time to persist before being killed (the persist happens on `AppState` background event)

## Babel plugin not working

1. Verify the plugin is listed in `babel.config.js` under `plugins`
2. The plugin path should be either:
   - `'@insightech/babel-plugin-react-native'` (when installed from npm)
   - `require.resolve('../path-to-babel-plugin')` (for local development)
3. Restart Metro with cache cleared after any Babel config changes
4. Check that your component imports are from `'react-native'` — the plugin only transforms imports from that specific module

## SDK not initializing

If you see `[Insightech:Provider] init() FAILED` in devMode logs:

1. Check that `account` is a valid `profileId:serverId` string with exactly one colon
2. Verify network connectivity — the SDK makes an HTTP request on init
3. Ensure `InsightechProvider` is mounted before `NavigationContainer`

## Console logs in production

The SDK only logs to `console.log` when `devMode: true`. In production builds, set `devMode: false` (or omit it — `false` is the default) for zero console output. Debug information is still written to AsyncStorage under the key `insightech_debug_log` for diagnostics.
