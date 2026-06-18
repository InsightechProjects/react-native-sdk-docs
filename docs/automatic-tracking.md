---
sidebar_position: 4
title: Automatic Tracking
---

# What Gets Tracked Automatically

Once the SDK is set up, the following are captured without any additional code:

| What | How | Requires |
|------|-----|----------|
| Screen views | React Navigation listener | `navigationRef` prop |
| Tap / click events | Babel plugin instruments `Pressable`, `TouchableOpacity`, `TouchableHighlight` | Babel plugin |
| Scroll events | Babel plugin instruments `ScrollView`, `FlatList`, `SectionList` | Babel plugin |
| Text input & changes | Babel plugin instruments `TextInput` | Babel plugin |
| Field focus / blur | Tracked via `TextInput` wrapper | Babel plugin |
| App background / foreground | `AppState` listener | Nothing (built-in) |
| Viewport resize | `Dimensions` listener | Nothing (built-in) |
| Component tree snapshots | React fiber tree serialization | Nothing (built-in) |
| DOM mutations | Tree diff after interactions | Nothing (built-in) |
| Rage taps | Rapid repeated taps on same element | Nothing (built-in) |
| JS crashes | Global error handler | Nothing (built-in) |
| API errors | Fetch/XHR interception | Server config |

## Excluding Components from Auto-Tracking

If you don't want certain components to be tracked, exclude them in the Babel plugin config. Two options are available and can be combined:

- **`exclude`** — skip specific component *types* everywhere.
- **`excludeFiles`** — skip *all* instrumentation for files matching glob patterns. Use this as a file-level escape hatch for a screen or directory that interacts badly with instrumentation (e.g. a screen with complex native modules), instead of disabling the plugin entirely.

```js title="babel.config.js"
plugins: [
  ['@insightech/babel-plugin-react-native', {
    // Skip these component types in every file
    exclude: ['ScrollView', 'FlatList'],
    // Skip these files/directories entirely (glob patterns)
    excludeFiles: ['**/lesson/**', '**/VideoPlayer.tsx'],
  }],
],
```

Glob support: `**` (any path segments), `*` (any characters within one segment), and `?` (a single character). Globs are matched against the file's absolute path, so prefix directory patterns with `**/`. Clear the Metro cache after changing plugin options (`--reset-cache` / `--clear`).

## Components Instrumented by the Babel Plugin

| `react-native` import | Replaced with | Tracks |
|------------------------|---------------|--------|
| `Pressable` | `TrackedPressable` | Tap events with position, element text |
| `TouchableOpacity` | `TrackedTouchableOpacity` | Tap events; **preserves the native opacity fade** |
| `TouchableHighlight` | `TrackedTouchableHighlight` | Tap events; **preserves the native underlay highlight** |
| `ScrollView` | `TrackedScrollView` | Scroll position, content size |
| `FlatList` | `TrackedFlatList` | Scroll position, content size |
| `SectionList` | `TrackedSectionList` | Scroll position, content size |
| `TextInput` | `TrackedTextInput` | Keystrokes (masked), focus, blur, value changes |

All other components (`View`, `Text`, `Image`, etc.) are left untouched.

:::note Transparent instrumentation
`TouchableOpacity` and `TouchableHighlight` are wrapped by faithful tracked equivalents that **preserve their native press feedback** (opacity fade / underlay highlight) — instrumentation does not change how your buttons look or behave.
:::
