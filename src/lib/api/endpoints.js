/**
 * API paths from the Appliance Fit Check Postman collection.
 * The contact route is not included in the Postman collection.
 */
export const ENDPOINTS = {
  // Auth
  register: { method: "POST", path: "/users/register" },
  login: { method: "POST", path: "/auth/login" },
  changePassword: { method: "POST", path: "/auth/change-password" },
  refreshToken: { method: "POST", path: "/auth/refresh-token" },
  forgotPassword: { method: "POST", path: "/auth/forget-password" },
  resetPassword: { method: "POST", path: "/auth/reset-password" },
  verifyOtp: { method: "POST", path: "/otp/verify-otp" },
  resendOtp: { method: "POST", path: "/otp/resend-otp" },
  // User
  getProfile: { method: "GET", path: "/users/my-profile" },
  updateProfile: { method: "PUT", path: "/users/update-my-profile" },
  deleteProfile: { method: "DELETE", path: "/users/delete-profile" },
  // Appliance catalogue
  applianceTypes: { method: "GET", path: "/appliance-models/types" },
  applianceByTypeAndModel: { method: "GET", path: "/appliance-models/by-type-and-model" },
  contents: { method: "GET", path: "/contents" },
  // Fit checks
  listFitChecks: { method: "GET", path: "/appliance-fit/my-appliance-fit" },
  getFitCheck: { method: "GET", path: "/appliance-fit/:id" },
  saveFitCheck: { method: "POST", path: "/appliance-fit" },
  deleteFitCheck: { method: "DELETE", path: "/appliance-fit/:id" },
  // Payments
  paymentCheckout: { method: "POST", path: "/payments/checkout" },
};
