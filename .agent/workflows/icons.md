---
description: Use Lucide icons instead of emojis to match the template design
---

# Icon Usage Guidelines

## Rule
**Always use Lucide React icons instead of emojis** to maintain consistency with the template design.

## Why
- Emojis render differently across devices/browsers
- Lucide icons match the existing design system
- Professional and consistent appearance

## How
```tsx
// ❌ Don't use emojis
<span>☕ Coffee</span>

// ✅ Use Lucide icons
import { Coffee } from "lucide-react";
<Coffee className="w-4 h-4" />
```

## Common Icons
- `Coffee` - drinks/menu
- `Settings` - admin/configuration
- `User` - user profile
- `ShoppingCart` - cart
- `Check` - success/selected
- `X` - close/cancel
- `Minus`, `Plus` - quantity controls

## Import
```tsx
import { IconName } from "lucide-react";
```

Browse all icons: https://lucide.dev/icons
