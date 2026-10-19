/**
 * ============================================================================
 *  API ENDPOINTS — PLACEHOLDERS
 * ============================================================================
 *  These paths are NOT real. Your backend's API specification was not
 *  provided, so each path below is a placeholder to be replaced with your
 *  actual route. Request/response shapes in ./auth.js, ./user.js, ./fitChecks.js
 *  and ./contact.js are likewise documented assumptions — adjust to match.
 * ============================================================================
 */
export const ENDPOINTS = {
  // Auth
  register: { method: "POST", path: "/TODO/auth/register" },
  login: { method: "POST", path: "/TODO/auth/login" },
  logout: { method: "POST", path: "/TODO/auth/logout" },
  verifyOtp: { method: "POST", path: "/TODO/auth/verify-otp" },
  resendOtp: { method: "POST", path: "/TODO/auth/resend-otp" },
  forgotPassword: { method: "POST", path: "/TODO/auth/forgot-password" },
  verifyResetOtp: { method: "POST", path: "/TODO/auth/verify-reset-otp" },
  resetPassword: { method: "POST", path: "/TODO/auth/reset-password" },
  session: { method: "GET", path: "/TODO/auth/session" },
  // User
  getProfile: { method: "GET", path: "/TODO/user/profile" },
  updateProfile: { method: "PATCH", path: "/TODO/user/profile" },
  changePassword: { method: "POST", path: "/TODO/user/change-password" },
  // Fit checks
  listFitChecks: { method: "GET", path: "/TODO/fit-checks" },
  saveFitCheck: { method: "POST", path: "/TODO/fit-checks" },
  deleteFitCheck: { method: "DELETE", path: "/TODO/fit-checks/:id" },
  // Optional: server-side evaluation (otherwise the browser rules in lib/fit are used)
  evaluateFit: { method: "POST", path: "/TODO/fit-checks/evaluate" },
  // Contact
  sendContact: { method: "POST", path: "/TODO/contact" },
};
