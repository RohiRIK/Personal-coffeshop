# Home Coffee Shop - Analytics Strategy

## 1. Key Metrics Definition

### 1.1 Top Drinker Identification

**Metric**: User with the highest total number of completed orders
**Calculation**:

- Count completed orders per user from the `orders` collection
- Filter by `status === 'completed'`
- Rank users by order count in descending order
- Report top user with their total order count

**Update Frequency**: Real-time with daily aggregation
**Data Source**: `orders` collection with user references
**Formula**: `argmax(user_id) for count(order_id) where status='completed'`

### 1.2 Most Popular Drink

**Metric**: Drink item with the highest number of orders
**Calculation**:

- Count orders per menu item from the `orders` collection
- Group by `itemId` referencing `menu_items`
- Sum counts for each unique menu item
- Rank items by order count in descending order

**Update Frequency**: Real-time with hourly aggregation
**Data Source**: `orders` collection with menu item references
**Formula**: `argmax(item_id) for count(order_id) grouped by itemId`

### 1.3 Average Barista Rating

**Metric**: Mean of all barista ratings given by customers
**Calculation**:

- Collect all `baristaRating` values from the `ratings` collection
- Calculate arithmetic mean of all ratings
- Filter out null or invalid ratings
- Optionally segment by time period

**Update Frequency**: Real-time with rolling averages
**Data Source**: `ratings` collection with barista ratings
**Formula**: `mean(baristaRating) for all valid ratings`

## 2. Additional Metrics

### 2.1 User Engagement Metrics

- **Return Customer Rate**: Percentage of users who place multiple orders
- **Average Orders Per User**: Total orders divided by unique users
- **Peak Ordering Times**: Time distribution of order submissions
- **Session Duration**: Average time spent on the platform per visit

### 2.2 Operational Metrics

- **Order Completion Time**: Average time from order placement to completion
- **Order Accuracy Rate**: Percentage of orders completed as specified
- **Inventory Turnover**: Rate at which inventory items are consumed
- **System Uptime**: Percentage of time the system is operational

### 2.3 Quality Metrics

- **Customer Satisfaction Score**: Average of all customer ratings
- **Order Modification Rate**: Percentage of orders modified after submission
- **Cancellation Rate**: Percentage of orders cancelled before completion
- **Repeat Rating Rate**: Percentage of customers who provide ratings

## 3. Data Collection Strategy

### 3.1 Event Tracking

- **Order Placed**: Capture order details, timestamp, user ID
- **Order Status Changed**: Track each status transition with timestamps
- **Rating Submitted**: Record rating values and associated metadata
- **Inventory Updated**: Log all inventory changes with admin attribution
- **User Actions**: Track significant user interactions for engagement metrics

### 3.2 Data Aggregation

- **Real-time Updates**: Use Firestore real-time listeners for immediate metric updates
- **Batch Processing**: Perform hourly/daily aggregations for efficiency
- **Historical Analysis**: Maintain time-series data for trend analysis
- **Segmentation**: Organize data by user groups, time periods, and item categories

## 4. Reporting Dashboard

### 4.1 Daily Reports

- Top Drinker of the day
- Most popular drink of the day
- Average rating of the day
- Total orders processed
- Inventory consumption summary

### 4.2 Weekly Reports

- Weekly trends in order volume
- Comparison of metrics week-over-week
- User acquisition and retention
- Inventory forecasting
- Staff performance metrics

### 4.3 Monthly Reports

- Monthly business performance summary
- Customer loyalty analysis
- Seasonal trend identification
- Revenue projections
- System performance review

## 5. Technical Implementation

### 5.1 Database Queries

```javascript
// Top Drinker Query
const getTopDrinker = async () => {
  const ordersSnapshot = await db
    .collection("orders")
    .where("status", "==", "completed")
    .get();

  const userCounts = {};
  ordersSnapshot.forEach((doc) => {
    const userId = doc.data().userId;
    userCounts[userId] = (userCounts[userId] || 0) + 1;
  });

  const topUser = Object.keys(userCounts).reduce((a, b) =>
    userCounts[a] > userCounts[b] ? a : b,
  );

  return { userId: topUser, count: userCounts[topUser] };
};

// Most Popular Drink Query
const getMostPopularDrink = async () => {
  const ordersSnapshot = await db.collection("orders").get();

  const itemCounts = {};
  ordersSnapshot.forEach((doc) => {
    const itemId = doc.data().itemId;
    itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
  });

  const topItem = Object.keys(itemCounts).reduce((a, b) =>
    itemCounts[a] > itemCounts[b] ? a : b,
  );

  return { itemId: topItem, count: itemCounts[topItem] };
};

// Average Rating Query
const getAverageRating = async () => {
  const ratingsSnapshot = await db.collection("ratings").get();

  let sum = 0;
  let count = 0;
  ratingsSnapshot.forEach((doc) => {
    const rating = doc.data().baristaRating;
    if (rating && rating >= 1 && rating <= 5) {
      sum += rating;
      count++;
    }
  });

  return count > 0 ? sum / count : 0;
};
```

### 5.2 Caching Strategy

- Cache computed metrics for performance
- Invalidate cache on relevant data changes
- Use Cloud Functions for automatic recalculation
- Implement fallback to raw data if cache unavailable

## 6. Privacy & Compliance

- Anonymize personal data where possible
- Implement data retention policies
- Ensure GDPR/CCPA compliance
- Secure sensitive analytics data
- Limit access to authorized personnel only
