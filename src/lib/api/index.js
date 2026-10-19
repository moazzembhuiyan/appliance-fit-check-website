import { USE_MOCK_API } from "@/lib/config";
import { authApi } from "./auth";
import { userApi } from "./user";
import { fitChecksApi } from "./fitChecks";
import { contactApi } from "./contact";
import { mockAuthApi, mockUserApi, mockFitChecksApi, mockContactApi } from "./mock";

/**
 * The single switch point. UI code imports `api` from here and never knows
 * whether it is talking to the mock or the real backend.
 */
export const api = USE_MOCK_API
  ? { auth: mockAuthApi, user: mockUserApi, fitChecks: mockFitChecksApi, contact: mockContactApi }
  : { auth: authApi, user: userApi, fitChecks: fitChecksApi, contact: contactApi };

export { ApiError } from "./client";
