import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "contexts/auth-context";
import { CartProvider } from "contexts/cart-context";
import { AuthGuard } from "components/auth/auth-guard";
import { Navbar } from "components/layout/navbar";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Personal Coffeshop";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Hand-crafted beverages and artisanal pastries",
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
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
