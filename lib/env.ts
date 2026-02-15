/**
 * Runtime environment variable accessor for server components.
 *
 * Next.js inlines `process.env["VAR"]` at build time even with bracket
 * notation. Wrapping the access in a function **in a separate module**
 * prevents the compiler from statically analysing and replacing the value.
 *
 * This file MUST remain a separate module—do NOT inline getServerEnv into
 * layout.tsx or any other server component.
 */
export function getServerEnv(key: string): string | undefined {
  return process.env[key];
}
