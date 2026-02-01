# Home Coffee Shop - Database Schema (Firebase)

## Collections Structure

### 1. users Collection

```json
{
  "userId": "string (auto-generated)",
  "username": "string",
  "email": "string",
  "photoURL": "string (user avatar for admin dashboard)",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "totalOrders": "number",
  "vipStatus": "boolean",
  "preferredDrink": "string",
  "averageRatingGiven": "number",
  "totalRatingsGiven": "number"
}
```

### 2. menu_items Collection

```json
{
  "itemId": "string (auto-generated)",
  "name": "string (e.g., 'Cappuccino', 'Americano')",
  "description": "string",
  "imageUrl": "string",
  "available": "boolean",
  "category": "string (e.g., 'Espresso', 'Milk-Based', 'Cold')",
  "preparationTime": "number (minutes)"
}
```

### 3. inventory Collection

```json
{
  "inventoryId": "string (auto-generated)",
  "itemType": "string ('milk', 'cup', 'sugar', etc.)",
  "itemName": "string (e.g., 'Oat Milk', 'Ceramic Cup')",
  "available": "boolean",
  "quantity": "number",
  "unit": "string (e.g., 'liters', 'pieces')",
  "lowStockThreshold": "number",
  "lastUpdated": "timestamp"
}
```

### 4. orders Collection

```json
{
  "orderId": "string (auto-generated)",
  "userId": "string (reference to users collection)",
  "itemId": "string (reference to menu_items collection)",
  "status": "string ('pending', 'in-progress', 'ready', 'completed', 'cancelled')",
  "customizations": {
    "milkType": "string",
    "sugarLevel": "string ('none', 'low', 'medium', 'high')",
    "cupType": "string"
  },
  "orderTime": "timestamp",
  "estimatedCompletionTime": "timestamp",
  "actualCompletionTime": "timestamp",
  "baristaRating": "number (1-5)",
  "baristaNotes": "string"
}
```

### 5. ratings Collection

```json
{
  "ratingId": "string (auto-generated)",
  "orderId": "string (reference to orders collection)",
  "userId": "string (reference to users collection)",
  "baristaRating": "number (1-5)",
  "drinkRating": "number (1-5)",
  "feedback": "string",
  "ratedAt": "timestamp"
}
```

### 6. analytics Collection (Aggregated Data)

```json
{
  "analyticsId": "string (auto-generated)",
  "metricType": "string ('top-drinker', 'popular-drink', 'avg-rating')",
  "period": "string ('daily', 'weekly', 'monthly', 'all-time')",
  "data": "object (varies by metricType)",
  "calculatedAt": "timestamp"
}
```
