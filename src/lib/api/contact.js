import { ApiError } from "./client";

export const contactApi = {
  async send() {
    throw new ApiError("The Postman collection does not include a contact-message endpoint.", {
      code: "CONTACT_ENDPOINT_UNAVAILABLE",
    });
  },
};
