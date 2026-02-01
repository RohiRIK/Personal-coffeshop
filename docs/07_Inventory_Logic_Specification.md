# Home Coffee Shop - Inventory Logic Specification

## 1. Overview

The inventory system manages real-time availability of ingredients (especially milk types) and ensures that unavailable items are immediately reflected in the guest interface. This document outlines the rules and mechanisms governing this synchronization.

## 2. Core Principles

### 2.1 Real-Time Synchronization

- Changes in inventory status must propagate to all connected clients within 1 second
- No refresh required for clients to see updated availability

### 2.2 Immediate UI Updates

- When an admin disables an inventory item, it becomes unavailable in guest interface instantly
- Disabled items appear grayed out with reduced opacity (0.5)
- Disabled items are non-selectable with cursor: not-allowed

### 2.3 Consistency Across Sessions

- Inventory status persists across user sessions
- New users see current inventory status upon login
- Returning users see updated inventory without manual refresh

## 3. Technical Implementation

### 3.1 Database Structure

```json
{
  "inventoryId": "string",
  "itemType": "string", // 'milk', 'cup', 'sugar'
  "itemName": "string", // 'Oat Milk', 'Ceramic Cup'
  "available": "boolean", // Critical field for UI updates
  "quantity": "number",
  "unit": "string",
  "lastUpdated": "timestamp"
}
```

### 3.2 Real-Time Listening

- Admin interface listens to inventory changes in real-time
- Guest interface listens to specific inventory categories (milk types)
- Use Firestore real-time listeners for instant updates

## 4. Business Rules

### 4.1 Milk Availability Rules

- If `available = false`, the milk option appears disabled in guest builder
- Disabled milk options cannot be selected by guests
- Disabled options show a tooltip: "Currently unavailable"
- When re-enabled, options return to normal state immediately

### 4.2 Order Processing Rules

- Orders with previously available but now unavailable ingredients are flagged
- Admin receives notification about affected pending orders
- Guest receives notification if their order contains unavailable items
- Affected orders can be modified or cancelled

### 4.3 Inventory Threshold Rules

- When quantity falls below `lowStockThreshold`, item shows warning state
- Admin dashboard highlights low-stock items
- Warning state is visible to admin but not to guests
- Item remains available until explicitly disabled by admin

## 5. UI Behavior Specifications

### 5.1 Guest Interface Response

- Milk selector components listen to inventory changes
- On availability change:
  1. Update component state
  2. Apply disabled styling (opacity 0.5, cursor not-allowed)
  3. Prevent selection
  4. Show tooltip indicating unavailability
  5. If currently selected, deselect and show error message

### 5.2 Admin Interface Response

- Inventory toggle switches reflect current database state
- Changes trigger immediate database update
- Visual feedback confirms the action
- Affected orders are highlighted if any exist

### 5.3 Error Handling

- If real-time connection fails, show cached state with "connection lost" indicator
- Retry connection automatically every 5 seconds
- When connection resumes, sync latest state
- Log any synchronization failures for debugging

## 6. Edge Cases

### 6.1 Simultaneous Updates

- Multiple admins changing inventory simultaneously
- Solution: Last-write-wins with optimistic UI updates
- Conflict detection and resolution if needed

### 6.2 Network Latency

- High latency situations where updates appear delayed
- Solution: Optimistic updates with error recovery
- Show "updating..." state during operations

### 6.3 Offline Handling

- Guests with poor connectivity
- Solution: Cache last known state
- Show offline indicator
- Sync when connection resumes
