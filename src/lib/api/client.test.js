import { afterEach, describe, expect, it, vi } from "vitest";
import { authApi } from "./auth";
import { getAuthToken, getResponseToken, setAuthToken } from "./client";

afterEach(() => vi.unstubAllGlobals());

describe("getResponseToken", () => {
  it("extracts a registration OTP token from the API response", () => {
    expect(getResponseToken({
      success: true,
      data: {
        user: { id: "user-id" },
        otpToken: { token: "otp-token" },
      },
    })).toBe("otp-token");
  });

  it("extracts access tokens from supported response shapes", () => {
    expect(getResponseToken({ data: { tokens: { accessToken: "access-token" } } })).toBe("access-token");
    expect(getResponseToken({ data: { access_token: "snake-case-token" } })).toBe("snake-case-token");
  });

  it("returns null when the response has no token", () => {
    expect(getResponseToken({ data: { user: { id: "user-id" } } })).toBeNull();
  });
});

describe("registration OTP token", () => {
  it("stores the registration token and sends it when verifying the OTP", async () => {
    const values = new Map();
    const storage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    };
    const responses = [
      {
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          data: { user: { id: "user-id" }, otpToken: { token: "otp-token" } },
        }),
      },
      {
        ok: true,
        status: 200,
        json: async () => ({ data: { user: { id: "user-id", name: "New User", email: "user@example.com" } } }),
      },
    ];
    const fetchMock = vi.fn(async () => responses.shift());
    vi.stubGlobal("window", { localStorage: storage, sessionStorage: storage });
    vi.stubGlobal("fetch", fetchMock);

    await authApi.register({ name: "New User", email: "user@example.com", password: "password1" });
    await authApi.verifyOtp({ email: "user@example.com", code: "123456" });

    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("otp-token");
  });
});

describe("login response", () => {
  it("uses the access token to fetch the profile when login returns only a token", async () => {
    const values = new Map();
    const storage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { accessToken: "login-token" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { _id: "user-id", name: "Samow", email: "samow@example.com" },
        }),
      });
    vi.stubGlobal("window", { localStorage: storage, sessionStorage: storage });
    vi.stubGlobal("fetch", fetchMock);

    await expect(authApi.login({
      email: "samow@example.com",
      password: "password1",
    })).resolves.toMatchObject({
      user: { _id: "user-id", name: "Samow", email: "samow@example.com" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("/users/my-profile");
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("login-token");
    expect(getAuthToken()).toBe("login-token");
  });
});

describe("session profile requests", () => {
  it("does not clear a newly issued login token when an older unauthenticated request returns 401", async () => {
    const values = new Map();
    const storage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    };
    vi.stubGlobal("window", { localStorage: storage, sessionStorage: storage });

    let respond;
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { respond = resolve; })));
    const pending = authApi.getSession();
    setAuthToken("new-login-token");
    respond({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: "Unauthorized" }),
    });

    await expect(pending).rejects.toMatchObject({ status: 401 });
    expect(getAuthToken()).toBe("new-login-token");
  });
});
