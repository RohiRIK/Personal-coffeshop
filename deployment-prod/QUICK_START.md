# 🚀 Quick Start Guide

This guide describes how to run the Personal Coffee Shop application from anywhere using Docker.

- **Port:** `9025`
  - **Why 9025?** "The Precision Recipe"
    - **9 (Bars):** The industry standard for pump pressure.
    - **25 (Seconds):** The lower bound of the ideal extraction window.
    - _It effectively encodes the "minimum viable parameters" for a high-quality espresso shot._

## Prerequisites

- **Docker** and **Docker Compose** installed.
- A **`.env`** file with your Firebase and Resend credentials.

## Option 1: Run with Docker (No Clone Required)

1.  **Create a Folder**: Make a new directory (e.g., `my-coffee-shop`).
2.  **Create docker-compose.yml**: Create a file named `docker-compose.yml` with the following content:

    ```yaml
    version: "3"
    services:
      app:
        image: ghcr.io/rohirik/personal-coffeshop:latest
        container_name: coffee-shop
        ports:
          - "9025:3000"
        environment:
          - PORT=3000
          - HOSTNAME=0.0.0.0
          - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
          - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
          - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
          - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
          - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
          - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
          - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
          - RESEND_API_KEY=${RESEND_API_KEY}
        env_file:
          - .env
        restart: always
    ```

3.  **Create .env**: Create a `.env` file in the same folder with your credentials (see template below).
4.  **Access**: Open `http://localhost:3000`.

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
