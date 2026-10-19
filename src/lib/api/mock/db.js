/**
 * DEMO-ONLY storage for the mock adapter. This is NOT security: data lives in
 * the visitor's browser localStorage. Delete lib/api/mock/ once real APIs are
 * connected (and set NEXT_PUBLIC_USE_MOCK_API=false).
 */
const KEY = "afc.mock.db.v1";
export const MOCK_OTP = "123456";

const empty = () => ({ users: [], session: null, checks: {}, pendingOtp: {}, resetTokens: {} });

export function readDb() {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return empty();
  }
}
export function writeDb(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage unavailable */
  }
}
export const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));
export const uid = () => Math.random().toString(36).slice(2, 10);
