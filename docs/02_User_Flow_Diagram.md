# Home Coffee Shop - User Flow Diagram

## Guest Flow (Mobile Interface)

### 1. Authentication

- Guest opens app
- Navigate to login screen
- Enter credentials
- If new user, navigate to registration
- On successful authentication, redirect to menu

### 2. Menu Selection

- View visual menu of coffee options
- Select desired drink (Cappuccino, Americano, Espresso, Freddo, etc.)
- Proceed to customization builder

### 3. Customization Builder

- Select milk type (Regular, Low Fat, Oat, Soy, Almond, None)
  - System validates availability against inventory
  - Disabled options appear grayed out
- Select sugar level (None, Low, Medium, High)
- Select cup type (Glass Mug, Ceramic Cup)
  - Takeaway/Paper cups are not available
- Review order summary
- Submit order

### 4. Order Confirmation

- View order in queue with estimated time
- Receive notification when order is ready
- Pick up order from host
- Rate coffee experience (1-5 stars)

### 5. Post-Order

- Rating stored in user profile
- Contributes to VIP status calculation
- Return to menu for additional orders

## Admin Flow (Tablet Interface)

### 1. Authentication

- Admin opens admin interface
- Authenticate with admin credentials
- Redirect to dashboard

### 2. Dashboard Overview

- View live order queue
- See inventory status indicators
- Access statistical reports

### 3. Order Management

- Receive new order notification (sound + popup)
- View order details (drink, customizations, user)
- Mark order as "In Progress"
- Mark order as "Ready for Pickup"
- Notify customer when ready

### 4. Inventory Management

- Access inventory control panel
- Toggle milk availability (ON/OFF)
- Changes immediately reflect in guest interface
- Monitor low stock warnings

### 5. Analytics Review

- View "Top Drinker" statistics
- Review "Most Popular Drink" trends
- Monitor "Average Barista Rating"
- Adjust operations based on insights
