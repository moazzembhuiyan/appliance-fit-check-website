import { request } from "./client";
import { ENDPOINTS } from "./endpoints";

/**
 * REAL auth service (placeholders). Every function documents the payload the UI
 * sends and the response the UI expects. Adjust either side to match your API.
 * The UI only depends on the return shapes noted below.
 */
export const authApi = {
  /** UI sends {name,email,password}. Expects {email} (OTP is then emailed). */
  register: (payload) => request(ENDPOINTS.register, { body: payload }),
  /** UI sends {email,password}. Expects {user} or {requiresVerification:true,email}. */
  login: (payload) => request(ENDPOINTS.login, { body: payload }),
  logout: () => request(ENDPOINTS.logout),
  /** UI sends {email,code}. Expects {user}. */
  verifyOtp: (payload) => request(ENDPOINTS.verifyOtp, { body: payload }),
  /** UI sends {email}. Expects {cooldownSeconds?}. */
  resendOtp: (payload) => request(ENDPOINTS.resendOtp, { body: payload }),
  /** UI sends {email}. Expects {} (always succeed to avoid account enumeration). */
  forgotPassword: (payload) => request(ENDPOINTS.forgotPassword, { body: payload }),
  /** UI sends {email,code}. Expects {resetToken}. */
  verifyResetOtp: (payload) => request(ENDPOINTS.verifyResetOtp, { body: payload }),
  /** UI sends {email,resetToken,password}. Expects {}. */
  resetPassword: (payload) => request(ENDPOINTS.resetPassword, { body: payload }),
  /** Called on app load to restore a session. Expects {user} or a 401. */
  getSession: () => request(ENDPOINTS.session),
};
