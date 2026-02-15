# Gemini Codebase Analysis

## Project Overview

This repository contains the source code for the "Brista Platform", a web application designed for a home café experience ("Personal Coffeshop"). It is a full-stack application built with **Next.js 15**, **Bun**, and **Firebase**.

The application provides:

- **Guest Interface:** Mobile-first PWA for browsing the menu, customizing drinks, and ordering.
- **Admin Dashboard:** Tablet-optimized Kitchen Display System (KDS) for managing orders and inventory.

## Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router)
- **Runtime/Package Manager:** Bun
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Stone & Amber" theme)
- **Backend:** Firebase (Firestore, Auth, Storage, Hosting)
- **Deployment:** Docker (GHCR) + PWA capabilities

## Development Rules & Best Practices

### 1. Code Style & Formatting

**CRITICAL:** This project enforces strict Prettier formatting in CI.

- **Rule:** Code formatting is **automatically handled** by pre-commit hooks.
- **Automation:** `husky` runs `prettier --write` on staged files. No manual action required.
- **Why:** Prevents unformatted code from entering the repository and breaking CI.

### 2. Docker & CI/CD

**CRITICAL:** The Docker build requires build-time environment variables for Firebase.

- **Rule:** When adding new `NEXT_PUBLIC_` variables, you MUST update:
  1.  `Dockerfile` (add `ARG` and `ENV`).
  2.  `.github/workflows/docker.yml` (add `build-args` mapping to Secrets).
- **Why:** Next.js inlines these variables at build time. If missing, the build fails (e.g. `auth/invalid-api-key`).

### 3. Type Safety

- **Rule:** Ensure interfaces in `lib/firebase/types.ts` are updated when new data fields (like `imageUrl`) are introduced.
- **Pre-Check:** Run `bun run build` locally to catch Type Errors before pushing.

### 4. PWA & Next.js 15 Compatibility

- **Rule:** Use `modules: false` or specific Webpack config if `next-pwa` conflicts with Turbopack.
- **Current Config:** We use `next build --webpack` in `package.json` to avoid Turbopack issues with the PWA plugin.

## Key Commands

- `bun run dev`: Start development server.
- `bun run build`: Production build (checks Types and builds PWA).
- `bun run prettier --write .`: Fix all formatting issues.
