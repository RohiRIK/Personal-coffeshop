import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "contexts/auth-context";
import { CartProvider } from "contexts/cart-context";
import { AuthGuard } from "components/auth/auth-guard";
import { Navbar } from "components/layout/navbar";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EnvProvider } from "components/env-provider";
import { getServerEnv } from "lib/env";

const siteName = getServerEnv("NEXT_PUBLIC_SITE_NAME") || "Personal Coffeshop";
const baseUrl = getServerEnv("NEXT_PUBLIC_BASE_URL") || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Personal Coffeshop",
  description: "Your personal coffee ordering companion.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coffeshop",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const env = {
    NEXT_PUBLIC_FIREBASE_API_KEY: getServerEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getServerEnv(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    ),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: getServerEnv(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    ),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: getServerEnv(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    ),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: getServerEnv(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    ),
    NEXT_PUBLIC_FIREBASE_APP_ID: getServerEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    NEXT_PUBLIC_APP_URL: getServerEnv("NEXT_PUBLIC_APP_URL"),
  };

  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <EnvProvider env={env} />
      </head>
      <body className="bg-stone-900 text-stone-100 selection:bg-amber-500 selection:text-stone-900">
        <AuthProvider>
          <CartProvider>
            <AuthGuard>
              <Navbar />
              <main className="min-h-screen">
                {children}
                <Toaster
                  closeButton
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: "#292524",
                      border: "1px solid #44403c",
                      color: "#fafaf9",
                    },
                  }}
                />
              </main>
            </AuthGuard>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
