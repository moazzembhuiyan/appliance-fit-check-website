import { ApiError, request, unwrapResponse } from "./client";
import { ENDPOINTS } from "./endpoints";

export const contentsApi = {
  async getLegalContent() {
    const response = await request(ENDPOINTS.contents, { skipAuth: true });
    const data = unwrapResponse(response);
    const content = Array.isArray(data) ? data[0] : data;
    if (!content || typeof content !== "object") {
      throw new ApiError("The contents API returned an invalid response.", {
        code: "INVALID_CONTENTS_RESPONSE",
      });
    }
    return content;
  },
};
