---
sidebar_position: 8
title: Element Identification
---

# Element Identification with testID

Use `testID` on your components for stable, readable element identification in analytics.

## Why testID Matters

```tsx
<Pressable testID="add-to-cart" onPress={handleAdd}>
  <Text>Add to Cart</Text>
</Pressable>

<TextInput testID="email-input" placeholder="Email" onChangeText={setEmail} />

<ScrollView testID="product-list">
  {/* ... */}
</ScrollView>
```

**Benefits:**

| With testID | Without testID |
|---|---|
| `#add-to-cart` | `div:nth-child(2)` |
| Stable across layout changes | Breaks when layout changes |
| Readable in analytics dashboard | Opaque position-based selectors |
| Used for content masking rules | Cannot target for masking |

## How It Works

- `testID` maps to the HTML `id` attribute in the synthetic DOM
- This produces CSS selectors like `#add-to-cart` instead of positional selectors like `div:nth-child(2)`
- The same `testID` is used for:
  - Element identification in heatmaps and click maps
  - Content masking rules (see [Privacy & Masking](./privacy-masking))
  - Replay element highlighting

## Best Practices

```tsx
// ✅ Good — descriptive, unique identifiers
<Pressable testID="checkout-submit-btn" onPress={handleSubmit} />
<TextInput testID="shipping-email" onChangeText={setEmail} />
<Text testID="order-total">${total}</Text>

// ❌ Avoid — generic or missing identifiers
<Pressable onPress={handleSubmit} />
<TextInput onChangeText={setEmail} />
```

:::tip
`testID` is already standard practice for React Native testing libraries (e.g., `@testing-library/react-native`). Use the same IDs for both testing and analytics.
:::
