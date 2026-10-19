import { request } from "./client";
import { ENDPOINTS } from "./endpoints";

/**
 * Saved fit check shape used by the UI:
 * { id, createdAt, appliance, product:{height,width,depth}, space:{height,width,depth},
 *   result:{status,label,summary,dimensions[]} }
 */
export const fitChecksApi = {
  list: () => request(ENDPOINTS.listFitChecks),
  save: (payload) => request(ENDPOINTS.saveFitCheck, { body: payload }),
  remove: (id) => request(ENDPOINTS.deleteFitCheck, { params: { id } }),
  /** Optional: if your backend evaluates fits, swap this into the calculator. */
  evaluate: (payload) => request(ENDPOINTS.evaluateFit, { body: payload }),
};
