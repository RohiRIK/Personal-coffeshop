# 🚀 LinkedIn Post Draft: The Personal Coffeshop

*Choose the "Hook" that fits your style best!*

---

### Option 1: The "Problem Solver" (Best for engagement)

**Headline:** I turned my kitchen into a startup so I could just enjoy my coffee. ☕️💻

We've all been there: you're hosting friends, trying to make 5 different coffee orders, forgetting who wanted oat milk, and missing the actual conversation because you're stressed in the kitchen.

As a developer, I realized this wasn't a "memory problem"—it was a **systems problem**.

So I built the **Personal Coffeshop**: a full-stack Order Management System (OMS) for my home.

**Why it’s overkill (and why I love it):**
Instead of a sticky note, my friends scan a QR code to order.
Instead of shouting "Who ordered the Cappuccino?", my iPad on the wall (functioning as a Kitchen Display System) pings me in real-time.

**The Tech Stack (The fun part):**
building this on the bleeding edge was non-negotiable.
⚡️ **Bun + Next.js 15**: For instant server-side rendering.
🔥 **Firebase**: Handling real-time auth and "live" order tickets with zero server maintenance.
📱 **PWA**: Guests "install" the app instantly—no App Store download required.
🐳 **Docker + GHCR**: Automated builds because even hobby projects deserve CI/CD.

It’s built for hospitality, not profit. The goal? To be the ultimate host.

Check out the code here: [GitHub Link]
#NextJS #Bun #SoftwareEngineering #SideProject #Coffee

---

### Option 2: The "Tech Deep Dive" (Best for recruiters/devs)

**Headline:** Building a Real-time KDS with Next.js 15 and Bun. 🛠️

I just finished shipping v2 of my "Personal Coffeshop"—a home hosting platform that treats my kitchen like a high-volume café.

The challenge: **Zero Latency.**
When a guest hits "Order" on their phone, my kitchen dashboard needs to update *instantly*. No refreshes, no polling.

**Architecture Breakdown:**
1.  **Frontend**: Next.js 15 (App Router) for a hybrid static/dynamic architecture.
2.  **State Sync**: Leveraging Firestore snapshots to synchronize state across devices in milliseconds.
3.  **Runtime**: Switched to **Bun** for faster package management and builds.
4.  **Deployment**: Dockerized container running on my home server, available via local Wi-Fi.

The result is a "No-Hustle" backend that lets me focus on the code (and the latte art).

It’s open source! 
👇 [GitHub Link]

#FullStack #PWA #WebDevelopment #RealTime #Engineering

---

### 🎨 Visuals to Attach
*Attach the "Shop" screenshot and the "Admin Portal" (KDS) screenshot side-by-side to show the "Cause and Effect" (Guest orders -> Host receives).*
