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
3. **Check exclusions:** Make sure the component isn't in the `exclude` list, and that its file isn't matched by an `excludeFiles` glob.
4. **Custom wrapper components:** The Babel plugin only instruments direct imports from `react-native`. If you wrap `Pressable` in a custom component, either:
   - Use `TrackedPressable` directly in your wrapper, or
   - Track events manually using `useInsightech`
5. **Check provider placement:** Tracked components only record when they render inside `<InsightechProvider>` — see below.

## `<InsightechProvider>` placement (no data on some screens)

The Babel plugin instruments components app-wide, and every tracked component looks up the SDK from the nearest `<InsightechProvider>`. If a tracked component renders **outside** the provider's subtree, tracking is silently disabled **for that component only** — the app keeps running (the SDK fails open and never throws).

In development (`__DEV__`) you'll see this warning once:

```text
[Insightech] A tracked component rendered outside <InsightechProvider>;
tracking is disabled for it. Move <InsightechProvider> so it wraps your
entire app (above your navigator/router).
```

**Fix:** mount `<InsightechProvider>` at the very top of your app — above your navigator/router (e.g. wrapping the root layout in `app/_layout.tsx` for Expo Router, or your `NavigationContainer`) — so every screen and component is a descendant. A correctly-placed provider never triggers this warning.

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

:::note scrollInterval vs scrollEventThrottle
`scrollInterval` (provider config) controls how often the SDK *records* a scroll snapshot. `scrollEventThrottle` is a standard per-component prop controlling how often the native layer delivers scroll events to JS. The tracked scroll wrappers default it to `16` (~60fps) only when you don't set it; **any value you pass is respected**. Scroll heatmaps are built from throttled position snapshots, so a higher `scrollEventThrottle` for performance has negligible visual impact.
:::

## Virtualized lists (FlatList / SectionList)

Virtualized lists only render the rows currently near the viewport — off-screen rows are unmounted. This has two implications for capture, both expected:

- **Replay reflects what was on screen.** A DOM-tree snapshot contains the rows mounted at capture time; rows far off-screen aren't in it. As the user scrolls, mutation events capture the rows that come and go, so the replay follows the scroll rather than showing the entire list at once.
- **Row tracking stays correct and bounded.** As rows recycle, each remounted row gets a fresh node index, and tap/scroll tracking resolves elements **by `testID`** to their current index — so interactions map to the right row. The internal `testID → index` registry is **LRU-bounded** (`maxTestIdEntries`, default `5000`), so a long scrolling session won't leak memory; actively-visible elements are refreshed and never evicted.

Recommendations for large lists:

- Give rows a **stable `testID`** (and a stable `keyExtractor`) so recycled rows map back consistently.
- Tune `windowSize` / `initialNumToRender` on the list if you want more rows captured per snapshot (at the cost of render work).
- Raise `maxTestIdEntries` only if you have more than ~5,000 distinct interactive `testID`s alive at once (rare).

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
