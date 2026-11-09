import { ApiError, clearAuthTokens, getAuthToken, getOtpToken, getResponseToken, getResponseUser, replaceAuthToken, request, setAuthToken, setOtpToken, unwrapResponse } from "./client";
import { ENDPOINTS } from "./endpoints";

function otpHeaders() {
  const token = getOtpToken();
  if (!token) {
    throw new ApiError("Your verification session expired. Request a new code to continue.", {
      code: "OTP_TOKEN_MISSING",
    });
  }
  return { Authorization: token };
}

function makeFormData(data, image) {
  const formData = new FormData();
  if (image) formData.append("image", image);
  formData.append("data", JSON.stringify(data));
  return formData;
}

export const authApi = {
  async register({ name, email, password, contactNumber = "", image }) {
    const response = await request(ENDPOINTS.register, {
      body: makeFormData({ name, email, password, contactNumber }, image),
      skipAuth: true,
    });
    setOtpToken(getResponseToken(response));
    return { ...unwrapResponse(response), email };
  },

  async login({ email, password, remember }) {
    const response = await request(ENDPOINTS.login, { body: { email, password }, skipAuth: true });
    const data = unwrapResponse(response);
    const token = getResponseToken(data);
    if (data?.requiresVerification || data?.user?.emailVerified === false) {
      setOtpToken(token);
      return { ...data, requiresVerification: true, user: data.user ? getResponseUser(data) : undefined };
    }
    if (token) setAuthToken(token, remember);
    setOtpToken(null);

    const userData = data?.user ?? data?.profile ?? data?.updatedUser;
    const user = userData
      ? getResponseUser({ user: userData })
      : (await request(ENDPOINTS.getProfile)).data;

    return { ...data, user: userData ? user : getResponseUser(user) };
  },

  async logout() {
    clearAuthTokens();
    return {};
  },

  async refreshToken() {
    const response = await request(ENDPOINTS.refreshToken);
    const token = getResponseToken(response);
    if (!token) throw new ApiError("The API did not return a refreshed access token.", { code: "REFRESH_TOKEN_MISSING" });
    replaceAuthToken(token);
    return unwrapResponse(response);
  },

  async verifyOtp({ email, code }) {
    const response = await request(ENDPOINTS.verifyOtp, {
      body: { otp: code },
      headers: otpHeaders(),
      skipAuth: true,
    });
    const token = getResponseToken(response);
    if (token) setAuthToken(token);
    setOtpToken(null);
    return { user: getResponseUser(response), email };
  },

  async resendOtp({ email }) {
    const response = await request(ENDPOINTS.resendOtp, { body: { email }, skipAuth: true });
    return unwrapResponse(response);
  },

  async forgotPassword({ email }) {
    const response = await request(ENDPOINTS.forgotPassword, { body: { email }, skipAuth: true });
    setOtpToken(getResponseToken(response));
    return unwrapResponse(response);
  },

  async verifyResetOtp({ email, code }) {
    const response = await request(ENDPOINTS.verifyOtp, {
      body: { otp: code },
      headers: otpHeaders(),
      skipAuth: true,
    });
    const resetToken = getResponseToken(response) || getOtpToken();
    if (!resetToken) {
      throw new ApiError("The API did not return a password reset token.", { code: "RESET_TOKEN_MISSING" });
    }
    setOtpToken(resetToken);
    return { resetToken, email };
  },

  async resetPassword({ email, resetToken, password, confirmPassword = password }) {
    setOtpToken(resetToken);
    const response = await request(ENDPOINTS.resetPassword, {
      body: { email, newPassword: password, confirmPassword },
      headers: otpHeaders(),
      skipAuth: true,
    });
    setOtpToken(null);
    return unwrapResponse(response);
  },

  async getSession() {
    const requestToken = getAuthToken();
    try {
      const response = await request(ENDPOINTS.getProfile);
      return { user: getResponseUser(response) };
    } catch (error) {
      if (error?.status === 401 && getAuthToken() === requestToken) clearAuthTokens();
      throw error;
    }
  },
};
