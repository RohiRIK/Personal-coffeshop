# ☕ Brista Platform (v2)

The **Brista Platform** is a modern, full-stack Order Management System (OMS) and Kitchen Display System (KDS) designed for coffee shops. It features a seamless customer ordering experience and a powerful real-time admin dashboard.

## ✨ Features

### 👤 Customer Experience
-   **Menu & Customization**: Browse drinks with rich visuals, filters, and customize options (milk, cup, notes).
-   **Cart System**: Persistent local cart with real-time totals.
-   **User Accounts**: Order history tracking, favorite items analysis, and "My Orders" status tracking.
-   **Live Updates**: Watch your order go from *Pending* → *Preparing* → *Ready* instantly.

### 👔 Admin Dashboard (Kitchen Display)
-   **Live Order Queue**: A high-density KDS (Kitchen Display System) to manage incoming orders.
-   **Status Control**: One-click status updates (Pending → Preparing → Ready → Completed).
-   **Menu Management**: Reactively toggle item availability (Sold Out) and manage prices.
-   **Inventory Management**: Real-time stock control for modifiers (Milk, Cups).
-   **Customer Insights**: View "VIP" status, total spend, and favorite drinks directly in the order ticket.

## 🛠️ Tech Stack
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (Custom "Stone & Amber" Coffee Theme)
-   **Backend / DB**: Firebase (Firestore, Auth, Storage)
-   **Icons**: Lucide React
-   **Runtime**: Bun

## 🚀 Getting Started

### Prerequisites
-   Bun (`curl -fsSL https://bun.sh/install | bash`)
-   Firebase Project

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/brista-platform.git
    cd brista-platform
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Set up Environment Variables:
    Create a `.env.local` file in the root:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...
    ```

4.  Run Development Server:
    ```bash
    bun run dev
    ```

## 📱 Screenshots

| Customer Menu | Admin KDS |
|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* |

## 📄 License
MIT
