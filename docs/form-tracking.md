---
sidebar_position: 7
title: Form Tracking
---

# Form Tracking

Track form submissions with field-level detail for form analytics in the Insightech dashboard.

## Basic Usage

```tsx
import { useInsightech } from '@insightech/react-native';

function CheckoutScreen() {
  const { trackFormSubmit, flush } = useInsightech();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = async () => {
    trackFormSubmit({
      nodeIndex: 0,
      cssPath: '#checkout-form',
      name: 'checkout',
      method: 'POST',
      fields: [
        { nodeIndex: 1, cssPath: '#email', name: 'email', value: email },
        { nodeIndex: 2, cssPath: '#name', name: 'name', value: name },
        // Mask sensitive fields before tracking
        { nodeIndex: 3, cssPath: '#card', name: 'card', value: '****' },
      ],
    });

    // Force send events before navigating away
    await flush();
    navigation.navigate('OrderConfirmation');
  };
}
```

:::warning Important
Always call `flush()` before navigating away from a screen with tracked form data. This ensures events are sent before the component unmounts.
:::

## FormInfo Type

```ts
interface FormInfo {
  nodeIndex: number;    // Form element node index (0 if unknown)
  cssPath: string;      // CSS selector for the form (e.g., '#checkout-form')
  name: string;         // Form name
  method: string;       // HTTP method (e.g., 'POST')
  fields: FormField[];  // Array of field values
}

interface FormField {
  nodeIndex: number;    // Field element node index
  cssPath: string;      // CSS selector (e.g., '#email')
  name: string;         // Field name
  value: string;        // Field value (mask sensitive data!)
}
```

## Masking Sensitive Fields

The SDK automatically masks `TextInput` values captured via the Babel plugin. However, when you manually pass values to `trackFormSubmit`, **you are responsible for masking sensitive data**:

```tsx
fields: [
  // Public fields — OK to send as-is
  { nodeIndex: 1, cssPath: '#email', name: 'email', value: email },

  // Sensitive fields — mask before tracking
  { nodeIndex: 2, cssPath: '#card', name: 'card', value: '****' },
  { nodeIndex: 3, cssPath: '#cvv', name: 'cvv', value: '***' },
  { nodeIndex: 4, cssPath: '#ssn', name: 'ssn', value: '***-**-****' },
]
```
