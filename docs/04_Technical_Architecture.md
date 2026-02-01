# Home Coffee Shop - Technical Architecture

## 1. Tech Stack Overview

### Frontend (brista-app-v2)

- **Framework**: Next.js 15 (App Router with TypeScript)
- **Styling**: Tailwind CSS 4 for utility-first styling
- **State Management**: React Context API with custom hooks
- **UI Components**: Custom-built components with Tailwind integration
- **Images**: `next/image` for automatic optimization

### Backend & Services

- **Authentication**: Firebase Authentication
- **Database**: Firestore for structured data
- **Storage**: Firebase Storage for media assets
- **Hosting**: Vercel (recommended) or Firebase Hosting

### Development Tools

- **Build Tool**: Next.js with Turbopack
- **Package Manager**: Bun
- **Code Formatting**: Prettier + ESLint
- **Version Control**: Git with GitHub

## 2. Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Input, etc.)
│   ├── guest/           # Guest-specific components
│   │   ├── Menu/        # Menu display components
│   │   ├── Builder/     # Customization builder
│   │   └── Order/       # Order-related components
│   └── admin/           # Admin-specific components
│       ├── Dashboard/   # Dashboard components
│       ├── Orders/      # Order management
│       └── Inventory/   # Inventory controls
├── pages/               # Route-level components
│   ├── Guest/
│   │   ├── Login.jsx
│   │   ├── Menu.jsx
│   │   └── OrderHistory.jsx
│   └── Admin/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       └── Analytics.jsx
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication logic
│   ├── useOrders.js     # Order management
│   └── useInventory.js  # Inventory synchronization
├── services/            # API/service layer
│   ├── firebase.js      # Firebase configuration
│   ├── authService.js   # Authentication functions
│   ├── orderService.js  # Order operations
│   └── inventoryService.js # Inventory functions
├── utils/               # Utility functions
│   ├── constants.js     # Application constants
│   ├── helpers.js       # Helper functions
│   └── validators.js    # Validation functions
├── contexts/            # React Context providers
│   ├── AuthContext.js   # Authentication state
│   ├── OrderContext.js  # Order state
│   └── InventoryContext.js # Inventory state
├── styles/              # Global styles
│   └── globals.css      # Tailwind and custom styles
└── App.jsx              # Main application component
```

## 3. State Management Strategy

### Global State with Context API

- **AuthContext**: Manages user authentication state
- **OrderContext**: Tracks current orders and queue status
- **InventoryContext**: Maintains real-time inventory availability

### Local State with useState/useReducer

- Component-specific state managed internally
- Complex form states managed with useReducer

### Server State with React Query/SWR (Optional)

- Caching and background updates for better UX
- Optimistic updates for real-time feel

## 4. Real-time Synchronization

- Firestore listeners for live order updates
- Realtime Database for immediate inventory changes
- WebSocket-like behavior using Firestore's real-time capabilities

## 5. Security Considerations

- Client-side validation with server-side verification
- Secure authentication tokens
- Role-based access control
- Input sanitization
