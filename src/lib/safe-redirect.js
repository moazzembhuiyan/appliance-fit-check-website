/** Only allow same-site relative paths to prevent open redirects. */
export function safeNext(next, fallback = "/dashboard") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
