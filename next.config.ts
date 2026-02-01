import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Unsplash images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Picsum placeholder images
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Google encrypted images (for some menu items)
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      // thehungrybites (freddo espresso)
      {
        protocol: "https",
        hostname: "www.thehungrybites.com",
      },
      // Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // Equator Coffees (moka pot)
      {
        protocol: "https",
        hostname: "www.equatorcoffees.com",
      },
      // Colombian Coffee (turkish coffee)
      {
        protocol: "https",
        hostname: "colombiancoffee.us",
      },
      // Laura Fuentes (hot mocha)
      {
        protocol: "https",
        hostname: "www.laurafuentes.com",
      },
      // Easy Weeknight Recipes (iced mocha)
      {
        protocol: "https",
        hostname: "easyweeknightrecipes.com",
      },
      // Simply Recipes (affogato)
      {
        protocol: "https",
        hostname: "www.simplyrecipes.com",
      },
      // Coffee Kev (cortado)
      {
        protocol: "https",
        hostname: "coffeekev.com",
      },
      // Cookhouse Diary (chai latte)
      {
        protocol: "https",
        hostname: "cookhousediary.com",
      },
    ],
  },
};

export default config;
