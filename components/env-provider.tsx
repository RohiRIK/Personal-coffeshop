"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __ENV__: Record<string, string | undefined>;
  }
}

export function EnvProvider({
  env,
}: {
  env: Record<string, string | undefined>;
}) {
  if (typeof window !== "undefined" && !window.__ENV__) {
    window.__ENV__ = env;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__ENV__ = ${JSON.stringify(env)}`,
      }}
    />
  );
}
