if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const r = (e) => a(e, t),
      o = { module: { uri: t }, exports: i, require: r };
    s[t] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (c(...e), i));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/FDm1wS0ksTOOsgZaRFxMS/_buildManifest.js",
          revision: "fd22d63b48324dddeda56155d1457e9b",
        },
        {
          url: "/_next/static/FDm1wS0ksTOOsgZaRFxMS/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/148-57a1d9b3af91f175.js",
          revision: "57a1d9b3af91f175",
        },
        {
          url: "/_next/static/chunks/156-1643af7b3af80bb0.js",
          revision: "1643af7b3af80bb0",
        },
        {
          url: "/_next/static/chunks/356-1861d7b52d95dd19.js",
          revision: "1861d7b52d95dd19",
        },
        {
          url: "/_next/static/chunks/53c0104b-da533bf370bae4ea.js",
          revision: "da533bf370bae4ea",
        },
        {
          url: "/_next/static/chunks/5b86099a-5f9b7cf01bb56543.js",
          revision: "5f9b7cf01bb56543",
        },
        {
          url: "/_next/static/chunks/619-81e477067303c1d6.js",
          revision: "81e477067303c1d6",
        },
        {
          url: "/_next/static/chunks/720-0cd0732f4dbad1d2.js",
          revision: "0cd0732f4dbad1d2",
        },
        {
          url: "/_next/static/chunks/767-27f5b30363286b9a.js",
          revision: "27f5b30363286b9a",
        },
        {
          url: "/_next/static/chunks/998-72251bfff06e7615.js",
          revision: "72251bfff06e7615",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-e8b448ca49246967.js",
          revision: "e8b448ca49246967",
        },
        {
          url: "/_next/static/chunks/app/admin/customers/page-2c13e30d8d0199f1.js",
          revision: "2c13e30d8d0199f1",
        },
        {
          url: "/_next/static/chunks/app/admin/inventory/page-97d8b7409969168e.js",
          revision: "97d8b7409969168e",
        },
        {
          url: "/_next/static/chunks/app/admin/layout-f7157b38472ccd19.js",
          revision: "f7157b38472ccd19",
        },
        {
          url: "/_next/static/chunks/app/admin/menu/page-b1e938bf53fc0d9b.js",
          revision: "b1e938bf53fc0d9b",
        },
        {
          url: "/_next/static/chunks/app/admin/orders/page-5fbb4ab21c05e68f.js",
          revision: "5fbb4ab21c05e68f",
        },
        {
          url: "/_next/static/chunks/app/admin/page-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/api/send-email/route-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/checkout/page-4ea8b1534919c3fd.js",
          revision: "4ea8b1534919c3fd",
        },
        {
          url: "/_next/static/chunks/app/drink/%5Bid%5D/page-a092195c2a47a86d.js",
          revision: "a092195c2a47a86d",
        },
        {
          url: "/_next/static/chunks/app/error-e9b018321f2c45a7.js",
          revision: "e9b018321f2c45a7",
        },
        {
          url: "/_next/static/chunks/app/layout-c98182766ffa062a.js",
          revision: "c98182766ffa062a",
        },
        {
          url: "/_next/static/chunks/app/login/page-00b13f8353b5090a.js",
          revision: "00b13f8353b5090a",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/menu/%5Bcategory%5D/page-41443ee177acafb2.js",
          revision: "41443ee177acafb2",
        },
        {
          url: "/_next/static/chunks/app/menu/loading-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/menu/page-41443ee177acafb2.js",
          revision: "41443ee177acafb2",
        },
        {
          url: "/_next/static/chunks/app/opengraph-image/route-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/order-success/page-11cf0b2c5b2e4e3d.js",
          revision: "11cf0b2c5b2e4e3d",
        },
        {
          url: "/_next/static/chunks/app/orders/page-c14095adf61f469a.js",
          revision: "c14095adf61f469a",
        },
        {
          url: "/_next/static/chunks/app/page-41443ee177acafb2.js",
          revision: "41443ee177acafb2",
        },
        {
          url: "/_next/static/chunks/app/rate/%5BorderId%5D/page-fcf4219b2718200a.js",
          revision: "fcf4219b2718200a",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/f5e865f6-d5e40da0f2472b81.js",
          revision: "d5e40da0f2472b81",
        },
        {
          url: "/_next/static/chunks/framework-372c62845e5ba996.js",
          revision: "372c62845e5ba996",
        },
        {
          url: "/_next/static/chunks/main-app-1dcdf383174c376d.js",
          revision: "1dcdf383174c376d",
        },
        {
          url: "/_next/static/chunks/main-eca6b2d1b8eeb8f8.js",
          revision: "eca6b2d1b8eeb8f8",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-e9760efe1d9d8455.js",
          revision: "e9760efe1d9d8455",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-a72fc5396875c1d4.js",
          revision: "a72fc5396875c1d4",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-af5f7e68791c0457.js",
          revision: "af5f7e68791c0457",
        },
        {
          url: "/_next/static/css/9ed84d3c29f1aa0f.css",
          revision: "9ed84d3c29f1aa0f",
        },
        {
          url: "/_next/static/media/028c0d39d2e8f589-s.p.woff2",
          revision: "c47061a6ce9601b5dea8da0c9e847f79",
        },
        { url: "/icon.png", revision: "22499c09d414b73ac115ce9a7c8124e4" },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "76fdd3369f623a3edcf74ce2200bfdd0",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
