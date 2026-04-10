---
sidebar_position: 6
title: Error Tracking
---

# Error Tracking

## Automatic JS Crash Tracking

The SDK automatically captures unhandled JavaScript exceptions via React Native's `ErrorUtils`. These are sent as `js_error` events and appear in the session timeline with the error message, name, stack trace, and whether the error was fatal.

The handler **chains with existing error handlers** (Sentry, Crashlytics, etc.) so it won't interfere with your crash reporting setup.

## Manual Error Tracking

Track error messages shown to users — validation errors, API failures, or any error state:

```tsx
import { useInsightech } from '@insightech/react-native';

function CheckoutScreen() {
  const { trackError } = useInsightech();

  const handleSubmit = () => {
    if (!isValid) {
      trackError({
        message: 'Please fill in all required fields',
        type: 'validation',
        context: { screen: 'Checkout', empty_fields: ['email', 'phone'] },
      });
      return;
    }

    try {
      await submitOrder();
    } catch (err) {
      trackError({
        message: `Payment failed: ${err.message}`,
        type: 'api',
        context: { endpoint: '/api/payment', status: err.status },
      });
    }
  };
}
```

## Error Event Format

Each `trackError` call sends a custom event (type 99) with:

| Field | Description | Default |
|-------|-------------|---------|
| `event` | Always `"error"` | — |
| `error_message` | The error text you provide | — |
| `error_type` | Category: `"validation"`, `"api"`, `"runtime"`, etc. | `"validation"` |
| Additional fields | Any keys in `context` are spread into the event | — |

## Examples

```tsx
// Form validation
trackError({
  message: 'Invalid email address',
  type: 'validation',
  context: { field: 'email' },
});

// API error
trackError({
  message: 'Server error: 500',
  type: 'api',
  context: { endpoint: '/api/orders', method: 'POST' },
});

// Business logic error
trackError({
  message: 'Item out of stock',
  type: 'inventory',
  context: { product_id: 'SKU-123' },
});
```
