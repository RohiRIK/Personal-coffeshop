# Changelog

All notable changes to the **Personal Coffeshop** platform are documented here.

---

## [2026-02-16] — Fun Features, Analytics & Testing

### ✨ Features

- **Surprise Me Button** — Slot-machine animation on menu page that picks a random drink (`df83f39`)
- **Daily Special** — Admin sets a featured drink with barista note; spotlight banner on menu (`df83f39`)
- **Emoji Reactions** — Customers react on order success; shown in admin KDS (`df83f39`)
- **Leaderboard** — `/leaderboard` page with visual podium + ranked customer list (`3b4db2b`)
- **Stamp Card** — Loyalty card grid on orders page, auto-increments per order (`3b4db2b`)
- **Café Guestbook** — `/guestbook` real-time message wall with mood emojis (`3b4db2b`)
- **Order Export CSV** — Download order history as CSV from analytics dashboard (`6e52143`)
- **Recipe Management** — Link ingredients to menu items for auto-deduction (`7017cde`)
- **Enhanced Customer Analytics** — Search, sort, VIP badges, favorite drinks (`dec2747`)

### 🐛 Fixes

- Tighten guestbook mobile layout spacing (`95ac0da`)

### 🧪 Tests

- Add Bun test suite with 61 tests across 5 files — constants, utils, type-guards, CSV export, types (`83a5790`)

### 📝 Docs

- Update `GEMINI.md` with dev/prod Docker workflow (`a231927`)

---

## [2026-02-15] — Admin Tools, Menu Management & Docker Runtime

### ✨ Features

- **Menu Management (CRUD)** — Create, edit, and delete menu items from admin (`f21412d`)
- **Hide Prices Toggle** — Admin sidebar toggle to show/hide prices on guest view (`24a4a11`)
- **Web Audio Notification Sound** — Local audio alert for new orders (`3e7c4e1`)
- **Runtime Env Config** — Docker environment variables injected at runtime, no rebuild needed (`9cbfc76`)

### 🐛 Fixes

- Use `getServerEnv` wrapper to prevent Next.js inlining env vars at build time (`ef53a8e`)
- Use bracket notation for `process.env` to prevent build-time inlining (`e5de6fa`)
- Force dynamic rendering in root layout for runtime env vars (`1f5aee4`)
- Resolve sidebar navigation crash and infinite loop (`cbc0ffa`)

### 🔧 Chores

- Remove build-time env vars, use runtime injection only (`1cd7380`)
- Update Docker Compose for local build on port 3001 (`05467f1`)
- Apply Prettier formatting (`3e9593b`)
- Automate Prettier with Husky + lint-staged pre-commit hooks (`add05db`)

---

## [2026-02-02] — Analytics, Email & Deployment

### ✨ Features

- **Analytics Dashboard** — Revenue charts, popular items, stats cards (`67abc14`)
- **Password Reset Email** — Resend-based email delivery for password resets (`67abc14`)
- **Email Notification System** — Order ready + rating email notifications (`67abc14`)

### 🐛 Fixes

- Add missing build args to Dockerfile and CI (`e803f5a`)
- Robust Firebase init for CI builds (`86a3071`)

### 📝 Docs

- Add Quick Start guide and deployment config (`bd7123e`)
- Simplify Quick Start to remove clone requirement (`f02f400`)

### 🔧 Chores

- Fix linting issues and add `.prettierignore` (`2997387`)
- Update deployment env example (`3a5ea45`)

---

## [2026-02-01] — Core Platform Launch

### 🚀 Initial Release

- **Admin Dashboard** — Order queue, customer management, sidebar navigation (`a773548`)
- **Customer Orders Page** — Order history with active/past sections (`a773548`)

### ✨ Features

- **Order Rating System** — Star rating modal + history integration (`ff698fa`)
- **Admin Ratings View** — Expose ratings in admin dashboard list & modal (`c3fa837`)
- **Inventory Tracking** — Stock levels, low-stock alerts, auto-disable (`1236de8`)
- **Inventory Restocking UI** — Restock modal and auto-disable logic (`ab82ebf`)
- **PWA Support** — Service worker, manifest, installable app (`b835530`)
- **Order Success Page** — Confetti celebration, sugar level display (`375a64d`)
- **Responsive Mobile Layout** — Hamburger menus, collapsible admin sidebar (`f9706b1`)
- **Password Reset** — Forgot password link + email flow (`35c15c5`)
- **Sugar Level Selector** — Visual indicators for drink sweetness (`f0d427e`, `e466ad9`)
- **Shop/Admin Toggle** — Role-based login redirect (`95c679c`)
- **Docker Containerization** — GHCR CI workflow for container builds (`fcb24fb`)

### 🐛 Fixes

- Fix Firebase undefined field error in order creation (`a340666`)
- Fix orders page Firestore timestamp handling (`2b9fd5b`)
- Fix inventory ID mismatch, update VIP threshold to 10 orders (`465a0c5`)
- Fix build: Force webpack for PWA compatibility (`438a82f`)
- Fix build: Update `generateMetadata` params to async await (`35e237c`)
- Fix syntax error: Remove duplicate div (`6f29c1a`)
- Add `imageUrl` to `OrderItem` type (`b4622de`)
- Pass Firebase secrets to Docker build in CI (`8295ec8`)

### 🎨 UI/Branding

- Rebrand to **Personal Coffeshop** + fix TypeScript errors (`264adb4`)
- Polish My Orders UI: Add images to past orders (`ae70d68`)
- Refactor README: Premium Roast Edition (`1d3975d`)
- Update Navbar: Remove 'Coffee' text, add Logo (`08d89fb`)
- Polish Branding: Remove 'Coffee' suffix everywhere (`48d794d`)
- Refactor inventory UI to table layout (`daeac72`)

### 📝 Docs

- Update README with project motivation, screenshots, Firebase wording (`2c4c735`, `5cbb834`, `05a2319`)
- Add LinkedIn Post draft (`ebc89cb`)
- Remove 'v2' labeling, update slogans (`c215b47`, `c98c668`)

### 🔧 Chores

- Add GitHub Actions CI workflow (`90890d6`)
- Fix CI: Handle Firebase gracefully in sitemap (`d85f813`)
- Add public folder for Docker build (`ebb0af5`)
- Fix Prettier formatting (multiple) (`3173adc`, `ff45386`, `f180971`, `e953df1`, `2763664`, `38d0c75`)
