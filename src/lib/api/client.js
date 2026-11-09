import { API_BASE_URL } from "@/lib/config";

const AUTH_TOKEN_KEY = "afc.auth.token";
const OTP_TOKEN_KEY = "afc.otp.token";

export class ApiError extends Error {
  constructor(message, { status = 0, code, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

function storage() {
  return typeof window === "undefined" ? null : window;
}

export function getAuthToken() {
  const browser = storage();
  if (!browser) return null;
  return browser.localStorage.getItem(AUTH_TOKEN_KEY) || browser.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token, remember = false) {
  const browser = storage();
  if (!browser) return;
  browser.localStorage.removeItem(AUTH_TOKEN_KEY);
  browser.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  if (token) {
    const target = remember ? browser.localStorage : browser.sessionStorage;
    target.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function replaceAuthToken(token) {
  const browser = storage();
  if (!browser) return;
  const remember = Boolean(browser.localStorage.getItem(AUTH_TOKEN_KEY));
  setAuthToken(token, remember);
}

export function getOtpToken() {
  return storage()?.sessionStorage.getItem(OTP_TOKEN_KEY) || null;
}

export function setOtpToken(token) {
  const browser = storage();
  if (!browser) return;
  if (token) browser.sessionStorage.setItem(OTP_TOKEN_KEY, token);
  else browser.sessionStorage.removeItem(OTP_TOKEN_KEY);
}

export function clearAuthTokens() {
  const browser = storage();
  if (!browser) return;
  browser.localStorage.removeItem(AUTH_TOKEN_KEY);
  browser.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  browser.sessionStorage.removeItem(OTP_TOKEN_KEY);
}

export function unwrapResponse(response) {
  return response?.data ?? response;
}

export function getResponseToken(response) {
  const data = unwrapResponse(response);
  const candidates = [data?.tokens, data?.otpToken, data?.otp_token, data?.user, data];
  for (const candidate of candidates) {
    const token = typeof candidate === "string"
      ? candidate
      : candidate?.accessToken ?? candidate?.access_token ?? candidate?.token;
    if (typeof token === "string" && token) return token;
  }
  return null;
}

export function getResponseUser(response) {
  const data = unwrapResponse(response);
  const user = data?.user ?? data?.profile ?? data?.updatedUser ?? data;
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    throw new ApiError("The API returned an invalid user profile.", { code: "INVALID_USER_RESPONSE" });
  }
  return {
    ...user,
    phone: user.phone ?? user.contactNumber ?? "",
    emailVerified: user.emailVerified ?? user.isEmailVerified ?? false,
  };
}

export async function request(endpoint, {
  params = {},
  body,
  query,
  signal,
  headers = {},
  skipAuth = false,
  cache = "no-store",
} = {}) {
  if (!API_BASE_URL) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not set. Configure it in .env.local.", { code: "NO_API_BASE_URL" });
  }
  let path = endpoint.path;
  for (const [key, value] of Object.entries(params)) path = path.replace(`:${key}`, encodeURIComponent(value));
  const qs = query ? `?${new URLSearchParams(query)}` : "";
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const authToken = skipAuth ? null : getAuthToken();

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}${qs}`, {
      method: endpoint.method,
      credentials: "include",
      cache,
      signal,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(authToken ? { Authorization: authToken } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Network error. Check your connection and try again.", { code: "NETWORK" });
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* Empty or non-JSON response body. */
  }

  if (!res.ok) {
    const errorData = data?.data ?? data;
    throw new ApiError(errorData?.message || `Request failed (${res.status})`, {
      status: res.status,
      code: errorData?.code,
      fieldErrors: errorData?.errors,
    });
  }
  return data;
}
