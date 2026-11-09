import { ApiError, request, unwrapResponse } from "./client";
import { ENDPOINTS } from "./endpoints";

export const paymentsApi = {
  async checkout({ user, reference }) {
    const response = await request(ENDPOINTS.paymentCheckout, {
      body: { user, reference },
    });
    const paymentUrl = unwrapResponse(response);
    if (typeof paymentUrl !== "string") {
      throw new ApiError("The payment API did not return a checkout link.", {
        code: "INVALID_PAYMENT_URL",
      });
    }
    let url;
    try {
      url = new URL(paymentUrl);
    } catch {
      throw new ApiError("The payment API returned an invalid checkout link.", {
        code: "INVALID_PAYMENT_URL",
      });
    }
    if (url.protocol !== "https:") {
      throw new ApiError("The payment API returned an insecure checkout link.", {
        code: "INSECURE_PAYMENT_URL",
      });
    }
    return url.href;
  },
};
