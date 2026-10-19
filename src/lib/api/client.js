import { API_BASE_URL } from "@/lib/config";

export class ApiError extends Error {
  constructor(message, { status = 0, code, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors; // { fieldName: "message" } when the API returns validation errors
  }
}

/**
 * HOOK POINT: add auth headers here (e.g. Authorization: Bearer <token>) if your
 * backend uses tokens. If it uses httpOnly cookies, leave this empty and keep
 * `credentials: "include"` below.
 */
function getAuthHeaders() {
  return {};
}

/**
 * Central request helper used by every real API service.
 * @param {{method:string,path:string}} endpoint entry from ENDPOINTS
 * @param {{params?:object, body?:object, query?:object, signal?:AbortSignal}} [opts]
 */
export async function request(endpoint, { params = {}, body, query, signal } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not set. Configure it in .env.local.", { code: "NO_API_BASE_URL" });
  }
  let path = endpoint.path;
  for (const [k, v] of Object.entries(params)) path = path.replace(`:${k}`, encodeURIComponent(v));
  const qs = query ? `?${new URLSearchParams(query)}` : "";

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}${qs}`, {
      method: endpoint.method,
      credentials: "include",
      signal,
      headers: { "Content-Type": "application/json", Accept: "application/json", ...getAuthHeaders() },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Network error. Check your connection and try again.", { code: "NETWORK" });
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    // ADAPT: map your backend's error shape here.
    throw new ApiError(data?.message || `Request failed (${res.status})`, {
      status: res.status,
      code: data?.code,
      fieldErrors: data?.errors,
    });
  }
  return data;
}
