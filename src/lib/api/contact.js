import { request } from "./client";
import { ENDPOINTS } from "./endpoints";
export const contactApi = { send: (payload) => request(ENDPOINTS.sendContact, { body: payload }) };
