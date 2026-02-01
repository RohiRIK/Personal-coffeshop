import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,

  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const config: NextConfig = {
  output: "standalone",
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
      // Google encrypted images
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      // thehungrybites
      {
        protocol: "https",
        hostname: "www.thehungrybites.com",
      },
      // Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // Equator Coffees
      {
        protocol: "https",
        hostname: "www.equatorcoffees.com",
      },
      // Colombian Coffee
      {
        protocol: "https",
        hostname: "colombiancoffee.us",
      },
      // Laura Fuentes
      {
        protocol: "https",
        hostname: "www.laurafuentes.com",
      },
      // Easy Weeknight Recipes
      {
        protocol: "https",
        hostname: "easyweeknightrecipes.com",
      },
      // Simply Recipes
      {
        protocol: "https",
        hostname: "www.simplyrecipes.com",
      },
      // Coffee Kev
      {
        protocol: "https",
        hostname: "coffeekev.com",
      },
      // Cookhouse Diary
      {
        protocol: "https",
        hostname: "cookhousediary.com",
      },
    ],
  },
};

export default withPWA(config);
