---
sidebar_position: 9
title: Privacy & Data Masking
---

# Privacy & Data Masking

All personal data is **masked on-device before transmission**. Raw values never leave the device.

## Automatic Input Masking

All `TextInput` values are masked by default:

| User types | Sent as | Rule |
|------------|---------|------|
| `John Doe` | `**** ***` | Letters/symbols → `*` |
| `4242424242424242` | `0000000000000000` | Digits → `0` |
| `john@example.com` | `****@*******.**` | Email pattern detected, structure preserved |
| `123 Main St` | `000 **** **` | Mixed: digits → `0`, letters → `*` |

## Automatic Email Detection

Email addresses are detected and masked in **all text content** — not just input fields. Any text matching an email pattern is masked before the component tree is sent.

## Content Masking with testID

Mask specific on-screen text using `testID` combined with the server's `contentBlockList`. This is useful for masking personal details on confirmation screens while keeping order IDs readable.

### Example

```tsx
{/* Order ID — visible (not in block list) */}
<Text testID="order-id">{orderId}</Text>

{/* Personal details — masked via contentBlockList */}
<Text testID="personal-details">{userName}</Text>
<Text testID="personal-details">{userEmail}</Text>
<Text testID="personal-details">{userAddress}</Text>
```

**In the replay:**
- Order ID: `ORD-12345` (readable)
- Name: `**** ***` (masked)
- Email: `****@*******.**` (masked)
- Address: `*** **** **` (masked)

## Server-Controlled Masking Rules

The server returns two lists on the SDK's first request — **no app update needed** to change masking rules:

### fieldAllowList

Input fields to leave **unmasked**. By default all input values are masked. Add selectors here for fields where you want to see the actual value (e.g., search boxes, quantity inputs):

```json
{
  "fieldAllowList": ["#search-input", "#quantity", ".public-field"]
}
```

### contentBlockList

Elements to **fully mask**. All non-whitespace characters in matching elements are replaced with `*`:

```json
{
  "contentBlockList": ["#personal-details", "#payment-info", "#ssn-field"]
}
```

:::tip
Masking rules are managed server-side. Contact your Insightech account manager or configure them in the dashboard settings to update allow/block lists without deploying a new app version.
:::
