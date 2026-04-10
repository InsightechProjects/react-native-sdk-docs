---
sidebar_position: 5
title: Custom Events
---

# Custom Event Tracking

Use the `useInsightech` hook to track custom business events like purchases, sign-ups, or feature usage.

## Basic Usage

```tsx
import { useInsightech } from '@insightech/react-native';

function ProductDetailScreen({ product }) {
  const { trackCustomEvent } = useInsightech();

  const handleAddToCart = () => {
    addToCart(product);

    trackCustomEvent({
      event: 'add_to_cart',
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      currency: 'USD',
    });
  };

  return (
    <Pressable testID="add-to-cart-btn" onPress={handleAddToCart}>
      <Text>Add to Cart</Text>
    </Pressable>
  );
}
```

## Purchase Tracking

```tsx
const { trackCustomEvent, flush } = useInsightech();

const handlePurchaseComplete = async (order) => {
  trackCustomEvent({
    event: 'purchase',
    order_id: order.id,
    total: order.total,
    currency: 'USD',
    item_count: order.items.length,
  });

  // Ensure the event is sent before navigating
  await flush();
  navigation.navigate('OrderConfirmation');
};
```

## How Custom Events Work

Custom events are sent as type 99 (`DATA_LAYER`) events. The `data` object you pass is sent as-is to the backend, where it can be used for:

- **Conversion tracking** — Track purchases, sign-ups, and other goals
- **Funnel analysis** — Identify drop-off points in multi-step flows
- **Segmentation** — Filter sessions by custom event properties
- **Session timeline** — Events appear in the replay timeline alongside clicks and navigation

:::tip
Always include an `event` field with a descriptive name (e.g., `'purchase'`, `'add_to_cart'`, `'sign_up'`). This is the key used for filtering and reporting in the dashboard.
:::
