# Home Coffee Shop - Design System Specifications

## 1. Color Palette (Dark Mode)

### Primary Colors
- **Coffee Brown Dark**: #1B0F0A (Deep dark brown, almost black - primary backgrounds)
- **Coffee Brown Medium**: #3E2723 (Secondary backgrounds, elevated surfaces)
- **Coffee Brown Light**: #6D4C41 (Borders, subtle elements)

### Secondary Colors
- **Cream White**: #FFF8F0 (Text on dark backgrounds, primary text)
- **Off-White**: #F5F5F5 (Secondary text, light backgrounds)
- **Charcoal**: #263238 (Alternative dark background)

### Status Colors
- **Success Green**: #81C784 (Completed orders, positive feedback)
- **Warning Orange**: #FFB74D (Low inventory, pending states)
- **Error Red**: #E57373 (Errors, unavailable items)
- **Info Blue**: #64B5F6 (Informational elements)

### Accent Colors
- **Gold Yellow**: #FFD54F (VIP status, premium features)
- **Deep Red**: #EF5350 (Urgent notifications, critical alerts)

## 2. Typography

### Font Family
- **Primary**: Inter (for body text, UI elements)
- **Secondary**: Playfair Display (for headings, titles)

### Typography Scale
- **H1**: 2.5rem (32px), font-weight: 700 (Main page titles)
- **H2**: 2rem (24px), font-weight: 600 (Section headers)
- **H3**: 1.5rem (20px), font-weight: 600 (Subsection headers)
- **H4**: 1.25rem (18px), font-weight: 500 (Component titles)
- **Body Large**: 1.125rem (16px), font-weight: 400 (Main content)
- **Body Regular**: 1rem (14px), font-weight: 400 (Standard text)
- **Body Small**: 0.875rem (12px), font-weight: 400 (Captions, labels)
- **Caption**: 0.75rem (10px), font-weight: 400 (Fine print)

## 3. UI Feedback Specifications

### Disabled Elements
- **Opacity**: 0.5
- **Cursor**: not-allowed
- **Background**: Coffee Brown Light (#6D4C41)
- **Text**: Off-White (#F5F5F5)
- **Border**: Coffee Brown Light (#6D4C41)

### Hover States
- **Buttons**: Scale to 1.05x with 0.2s transition
- **Cards**: Elevate shadow (shadow-lg) with 0.2s transition
- **Interactive Elements**: Change background to Coffee Brown Light (#6D4C41) with 0.2s transition

### Active States
- **Selected Items**: Border with Gold Yellow (#FFD54F) and slight inset shadow
- **Pressed Buttons**: Scale to 0.98x with 0.1s transition

### Loading States
- **Skeleton Screens**: Animated gradient from Coffee Brown Dark to Coffee Brown Medium
- **Spinners**: Gold Yellow (#FFD54F) with 1.5s rotation animation
- **Progress Bars**: Gradient from Coffee Brown to Gold Yellow

### Error States
- **Input Fields**: Red border (#E57373) with red text
- **Error Messages**: Red background (#E57373) with white text
- **Icons**: Red exclamation icon

### Success States
- **Checkmarks**: Green checkmark animation
- **Toasts**: Green background with white text
- **Animations**: Subtle bounce effect

## 4. Spacing System
- **Base Unit**: 4px
- **Scale**: 1, 2, 4, 8, 12, 16, 24, 32, 48, 64 (in px)
- **Gaps**: Use multiples of 4px for consistent spacing

## 5. Component Specifications

### Buttons
- **Primary**: Background Coffee Brown Light, text Cream White, rounded-lg, padding 8px 16px
- **Secondary**: Background transparent, border Coffee Brown Light, text Cream White
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Size Variants**: Small (text-sm), Medium (text-base), Large (text-lg)

### Cards
- **Background**: Coffee Brown Medium (#3E2723) with subtle shadow (shadow-md)
- **Border Radius**: Rounded-xl
- **Padding**: p-4 for content cards, p-6 for feature cards
- **Hover Effect**: Elevate to shadow-lg

### Inputs
- **Background**: Coffee Brown Medium (#3E2723)
- **Border**: Coffee Brown Light (#6D4C41), rounded-lg
- **Focus**: Border Gold Yellow (#FFD54F) with subtle glow
- **Placeholder**: Off-White

### Modals
- **Background**: Semi-transparent overlay (rgba(0,0,0,0.7))
- **Content**: Card with max-width 90vw, centered vertically and horizontally
- **Close Button**: Top-right corner with X icon in Off-White

## 6. Ingredient Color Coding (For Admin Efficiency)

### Milk Type Labels
- **Cow Milk**: Light Blue (#BBDEFB) - for high contrast on dashboard
- **Oat Milk**: Beige/Tan (#D7CCC8) - for high contrast on dashboard
- **Soy Milk**: Off-White (#F5F5F5) - for high contrast on dashboard
- **Almond Milk**: Light Brown (#A1887F) - for high contrast on dashboard
- **No Milk**: Dark Grey (#757575) - for high contrast on dashboard