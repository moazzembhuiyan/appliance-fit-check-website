import { request } from "./client";
import { ENDPOINTS } from "./endpoints";

/** Expected user shape: { id, name, email, phone?, createdAt, emailVerified } */
export const userApi = {
  getProfile: () => request(ENDPOINTS.getProfile),
  /** UI sends {name,email,phone}. Expects {user}. */
  updateProfile: (payload) => request(ENDPOINTS.updateProfile, { body: payload }),
  /** UI sends {currentPassword,password}. Expects {}. */
  changePassword: (payload) => request(ENDPOINTS.changePassword, { body: payload }),
};
