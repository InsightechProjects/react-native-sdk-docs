---
sidebar_position: 14
title: API Reference
---

# API Reference

## InsightechProvider

The root provider component that initializes the SDK and provides context to child components.

```tsx
<InsightechProvider
  config={InsightechConfig}        // Required: SDK configuration
  navigationRef={NavigationRef}    // Optional: React Navigation container ref
>
  {children}
</InsightechProvider>
```

Must wrap your entire app (or at least the `NavigationContainer`). See [Configuration](./configuration) for all config options.

## useInsightech()

Hook for accessing tracking methods in any component within the provider.

```ts
const {
  trackScreen,
  trackCustomEvent,
  trackFormSubmit,
  trackError,
  flush,
  sdk,
} = useInsightech();
```

### trackScreen

```ts
trackScreen(screenName: string, params?: Record<string, unknown>): void
```

Manually track a screen view. Not needed if using React Navigation with `navigationRef` — screens are tracked automatically.

### trackCustomEvent

```ts
trackCustomEvent(data: Record<string, unknown>): void
```

Send a custom event (type 99). Include an `event` field for identification in the dashboard.

### trackFormSubmit

```ts
trackFormSubmit(info: FormInfo): void
```

Track a form submission with field-level detail. See [Form Tracking](./form-tracking) for the `FormInfo` type.

### trackError

```ts
trackError(info: {
  message: string;
  type?: string;           // defaults to 'validation'
  context?: Record<string, unknown>;
}): void
```

Track an error shown to the user. See [Error Tracking](./error-tracking) for examples.

### flush

```ts
flush(): Promise<void>
```

Force-send all pending events immediately. Returns a promise that resolves when the send completes.

### sdk

```ts
sdk: InsightechSDK
```

The raw SDK instance for advanced use cases (manual tap tracking, direct field tracking, etc.).

## Tracked Components

All tracked components are drop-in replacements that forward all props, refs, and callbacks.

### TrackedPressable

```tsx
import { TrackedPressable } from '@insightech/react-native';
// or auto-instrumented via Babel plugin from: import { Pressable } from 'react-native';

<TrackedPressable testID="my-button" onPress={handlePress}>
  <Text>Press Me</Text>
</TrackedPressable>
```

Replaces `Pressable`, `TouchableOpacity`, and `TouchableHighlight`. Tracks tap events with position, element text, and CSS path.

### TrackedScrollView

```tsx
import { TrackedScrollView } from '@insightech/react-native';

<TrackedScrollView testID="content" onScroll={handleScroll}>
  {/* content */}
</TrackedScrollView>
```

Tracks scroll position and content size, throttled by `scrollInterval`.

### TrackedFlatList

```tsx
import { TrackedFlatList } from '@insightech/react-native';

<TrackedFlatList
  testID="product-list"
  data={products}
  renderItem={renderItem}
/>
```

Generic-typed wrapper for `FlatList`. Tracks scroll position and content size.

### TrackedSectionList

```tsx
import { TrackedSectionList } from '@insightech/react-native';

<TrackedSectionList
  testID="settings-list"
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={renderHeader}
/>
```

Generic-typed wrapper for `SectionList`. Tracks scroll position and content size.

### TrackedTextInput

```tsx
import { TrackedTextInput } from '@insightech/react-native';

<TrackedTextInput
  testID="email-input"
  placeholder="Email"
  onChangeText={setEmail}
/>
```

Tracks keystrokes (masked), focus, blur, and value changes.

## Event Types

| Type | Name | Trigger |
|------|------|---------|
| 1 | Pageview | Screen mount / navigation |
| 2 | DOM Tree | Component tree snapshot |
| 3 | App Ready | SDK initialization |
| 4 | App Unload | App backgrounding |
| 7 | Click | `onPress` on tracked pressables |
| 8 | Input | `onChangeText` on tracked text inputs |
| 9 | Input Change | `onEndEditing` / blur with final value |
| 12 | Scroll | `onScroll` on tracked scroll views / lists |
| 13 | Tab Hidden | App goes to background |
| 14 | Tab Visible | App returns to foreground |
| 15 | Resize | Device orientation / dimensions change |
| 16 | DOM Mutation | Component tree diff after interactions |
| 17 | Field Focus | `onFocus` on tracked text inputs |
| 18 | Field Blur | `onBlur` on tracked text inputs |
| 19 | URL Change | Screen navigation |
| 20 | Form Submit | `trackFormSubmit()` call |
| 97 | API Error | HTTP errors on monitored endpoints |
| 98 | Rage Tap | Rapid repeated taps on same element |
| 99 | Custom / Error | `trackCustomEvent()` or `trackError()` |
