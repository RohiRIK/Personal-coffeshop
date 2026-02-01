# Home Coffee Shop - Component Hierarchy

## Root Level

```
App
├── AuthProvider
├── OrderProvider
├── InventoryProvider
└── Router
    ├── GuestRoutes
    │   ├── GuestLayout
    │   │   ├── Header
    │   │   ├── Navigation
    │   │   ├── Footer
    │   │   └── RatingModal
    │   ├── LoginPage
    │   ├── RegistrationPage
    │   ├── MenuPage
    │   │   ├── MenuItemGrid
    │   │   │   ├── MenuItemCard
    │   │   │   └── MenuItemModal
    │   │   └── CustomizationBuilder
    │   │       ├── MilkSelector
    │   │       ├── SugarSelector
    │   │       ├── CupSelector
    │   │       └── OrderSummary
    │   └── OrderHistoryPage
    └── AdminRoutes
        ├── AdminLayout
        │   ├── AdminHeader
        │   ├── AdminNavigation
        │   └── AdminFooter
        ├── DashboardPage
        │   ├── LiveQueue
        │   │   ├── OrderCard
        │   │   ├── OrderActions
        │   │   └── NotificationAlert
        │   ├── StatsOverview
        │   │   ├── TopDrinkerCard
        │   │   ├── PopularDrinkCard
        │   │   └── AvgRatingCard
        │   └── QuickActions
        ├── OrdersPage
        │   ├── OrderList
        │   ├── OrderDetailsModal
        │   └── OrderFilter
        ├── InventoryPage
        │   ├── InventoryList
        │   ├── InventoryItemToggle
        │   └── LowStockWarning
        └── AnalyticsPage
            ├── ChartsContainer
            ├── UserStats
            └── DrinkStats
```

## Key Components Description

### Guest-Specific Components

- **MenuItemCard**: Displays drink information with image and description
- **CustomizationBuilder**: Allows milk, sugar, and cup selection
- **MilkSelector**: Grid of available milk types with real-time availability
- **CupSelector**: Shows only reusable cup options (no takeaway)
- **OrderSummary**: Confirms selections before submission
- **RatingModal**: Modal that pops up for users to rate their coffee (1-5 stars) when order status becomes "Completed"

### Admin-Specific Components

- **OrderCard**: Shows order details with action buttons
- **NotificationAlert**: Sound and visual alerts for new orders
- **InventoryItemToggle**: Switch to enable/disable inventory items
- **StatsOverview**: Cards showing key metrics
- **ChartsContainer**: Visual representations of analytics data
