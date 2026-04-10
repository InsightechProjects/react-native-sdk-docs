---
sidebar_position: 11
title: Advanced Usage
---

# Advanced Usage

## Manual Screen Tracking

If you don't use React Navigation, track screens manually:

```tsx
import { useInsightech } from '@insightech/react-native';

function ProductDetailScreen({ product }) {
  const { trackScreen } = useInsightech();

  useEffect(() => {
    trackScreen('ProductDetail', { productId: product.id });
  }, []);

  return (/* ... */);
}
```

## Force Sending Events

The SDK batches events and sends them automatically. To force-send immediately (e.g., before navigating to an external URL or before a critical action):

```tsx
const { flush } = useInsightech();

const handleExternalLink = async () => {
  await flush(); // Ensure all events are sent
  Linking.openURL(url);
};
```

:::tip When to flush
- Before navigating away from a form with tracked data
- Before opening an external URL
- Before the user logs out
- After tracking a critical conversion event (purchase, sign-up)
:::

## Using Tracked Components Without the Babel Plugin

If you prefer not to use the Babel plugin, import tracked components directly:

```tsx
import {
  TrackedPressable,
  TrackedScrollView,
  TrackedFlatList,
  TrackedSectionList,
  TrackedTextInput,
} from '@insightech/react-native';

function MyScreen() {
  return (
    <TrackedScrollView testID="product-list">
      <TrackedPressable testID="buy-btn" onPress={handleBuy}>
        <Text>Buy Now</Text>
      </TrackedPressable>

      <TrackedTextInput
        testID="promo-code"
        placeholder="Promo code"
        onChangeText={setPromoCode}
      />
    </TrackedScrollView>
  );
}
```

All tracked components are drop-in replacements — they forward all props, refs, and callbacks.

## Using TrackedFlatList and TrackedSectionList

`FlatList` and `SectionList` are automatically instrumented by the Babel plugin. They track scroll events just like `ScrollView`:

```tsx
// This is automatically tracked via the Babel plugin:
import { FlatList } from 'react-native';

<FlatList
  testID="product-feed"
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
/>
```

Or use them directly:

```tsx
import { TrackedFlatList } from '@insightech/react-native';

<TrackedFlatList
  testID="product-feed"
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
/>
```

## Accessing the SDK Instance Directly

For advanced use cases, access the raw SDK instance via the hook:

```tsx
const { sdk } = useInsightech();

// Track a tap manually
sdk.trackTap({
  nodeIndex: 0,
  cssPath: '#custom-element',
  tag: 'button',
  text: 'Custom Button',
  elementX: 100,
  elementY: 200,
  screenX: 100,
  screenY: 300,
  scrollTop: 0,
  scrollLeft: 0,
  pageTop: 0,
  pageLeft: 0,
  name: '',
  href: '',
});
```

## Offline Support

Events are automatically persisted to AsyncStorage when the app goes to background. If the app is killed before events can be sent, they are restored and sent on the next app launch.

This handles:
- **OS killing the app** in the background to reclaim memory
- **App crashes** — persisted events survive the crash
- **Brief network outages** — failed requests are retried with exponential backoff (1s, 2s, 4s) up to 3 times

No configuration needed — offline support is built-in.
