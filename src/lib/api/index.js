import { authApi } from "./auth";
import { userApi } from "./user";
import { fitChecksApi } from "./fitChecks";
import { contactApi } from "./contact";
import { applianceModelsApi } from "./applianceModels";
import { paymentsApi } from "./payments";
import { contentsApi } from "./contents";

export const api = {
  auth: authApi,
  user: userApi,
  fitChecks: fitChecksApi,
  applianceModels: applianceModelsApi,
  payments: paymentsApi,
  contents: contentsApi,
  contact: contactApi,
};

export { ApiError } from "./client";
