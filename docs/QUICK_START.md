# 🚀 Quick Start Guide

This guide describes how to run the Personal Coffee Shop application from anywhere using Docker.

## Prerequisites

- **Docker** and **Docker Compose** installed.
- A **`.env`** file with your Firebase and Resend credentials.

## Option 1: Run with Deployment Script (Recommended)

1.  **Create a Folder**: Make a new directory (e.g., `my-coffee-shop`).
2.  **Copy Files**: Copy the `deployment` folder contents into it.
    - `deployment/docker-compose.yml` -> `docker-compose.yml`
3.  **Create .env**: Create a `.env` file in the same folder with the following keys:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    RESEND_API_KEY=re_your_resend_key
    ```
4.  **Run**:
    ```bash
    docker-compose up -d
    ```
5.  **Access**: Open `http://localhost:3000`.

## Option 2: Run from Source

1.  **Clone**:
    ```bash
    git clone https://github.com/RohiRIK/Personal-coffeshop.git
    cd Personal-coffeshop
    ```
2.  **Install & Dev**:
    ```bash
    bun install
    bun run dev
    ```
3.  **Build Docker Locally**:
    ```bash
    docker-compose up --build
    ```
