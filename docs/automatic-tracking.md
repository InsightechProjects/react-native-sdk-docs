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

If you don't want certain components to be tracked, exclude them in the Babel plugin config:

```js title="babel.config.js"
plugins: [
  ['@insightech/babel-plugin-react-native', {
    exclude: ['ScrollView', 'FlatList'],
  }],
],
```

## Components Instrumented by the Babel Plugin

| `react-native` import | Replaced with | Tracks |
|------------------------|---------------|--------|
| `Pressable` | `TrackedPressable` | Tap events with position, element text |
| `TouchableOpacity` | `TrackedPressable` | Same as Pressable |
| `TouchableHighlight` | `TrackedPressable` | Same as Pressable |
| `ScrollView` | `TrackedScrollView` | Scroll position, content size |
| `FlatList` | `TrackedFlatList` | Scroll position, content size |
| `SectionList` | `TrackedSectionList` | Scroll position, content size |
| `TextInput` | `TrackedTextInput` | Keystrokes (masked), focus, blur, value changes |

All other components (`View`, `Text`, `Image`, etc.) are left untouched.
