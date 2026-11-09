import { clearAuthTokens, getResponseUser, request } from "./client";
import { ENDPOINTS } from "./endpoints";

function makeFormData(data, image) {
  const formData = new FormData();
  if (image) formData.append("image", image);
  formData.append("data", JSON.stringify(data));
  return formData;
}

export const userApi = {
  async getProfile() {
    const response = await request(ENDPOINTS.getProfile);
    return { user: getResponseUser(response) };
  },

  async updateProfile({ name, email, phone, image }) {
    const response = await request(ENDPOINTS.updateProfile, {
      body: makeFormData({ name, email, contactNumber: phone }, image),
    });
    return { user: getResponseUser(response) };
  },

  changePassword: ({ currentPassword, password }) =>
    request(ENDPOINTS.changePassword, { body: { oldPassword: currentPassword, newPassword: password } }),

  async deleteProfile() {
    const response = await request(ENDPOINTS.deleteProfile);
    clearAuthTokens();
    return response;
  },
};
