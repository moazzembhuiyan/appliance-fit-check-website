import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./index";
import { API_BASE_URL } from "@/lib/config";

afterEach(() => vi.unstubAllGlobals());

function jsonResponse(data, status = 200) {
  return {
    ok: true,
    status,
    json: async () => ({ success: true, statusCode: status, data }),
  };
}

describe("appliance fit API flow", () => {
  it("loads appliance types and searches a model with encoded type and model parameters", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([{ type: "Refrigerator", modelCount: 15 }]))
      .mockResolvedValueOnce(jsonResponse({
        type: 'Pro Range - "36"',
        model: "gr364g-ss",
        height: 5.01,
        width: 30.01,
        depth: 21.01,
      }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(api.applianceModels.listTypes()).resolves.toEqual([
      { type: "Refrigerator", modelCount: 15 },
    ]);
    const model = await api.applianceModels.findByTypeAndModel('Pro Range - "36"', "gr364g-ss");

    expect(new URL(fetchMock.mock.calls[1][0]).pathname).toBe("/api/v1/appliance-models/by-type-and-model");
    const query = new URL(fetchMock.mock.calls[1][0]).searchParams;
    expect(query.get("type")).toBe('Pro Range - "36"');
    expect(query.get("model")).toBe("gr364g-ss");
    expect(model).toMatchObject({ height: 5.01, width: 30.01, depth: 21.01 });
  });

  it("preserves all 21 appliance categories returned by the live catalog", async () => {
    const categories = Array.from({ length: 21 }, (_, index) => ({
      type: `Appliance category ${index + 1}`,
      modelCount: index,
    }));
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(categories));
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.applianceModels.listTypes();

    expect(result).toHaveLength(21);
    expect(result).toEqual(categories);
  });

  it("submits measurements and maps the server fit response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      _id: "fit-id",
      type: "Cooktop Installed Over Oven",
      measurements: { height: 5.01, width: 30.01, depth: 21.01 },
      cutoutMeasurements: { height: 5, width: 30, depth: 21 },
      dimensionStatus: {
        height: "require_modification",
        width: "require_modification",
        depth: "require_modification",
      },
      status: "require_modification",
      failReason: 'Height too small by 0.01", Width too small by 0.01", Depth too small by 0.01"',
      isPaid: false,
    }, 201));
    vi.stubGlobal("fetch", fetchMock);

    const fit = await api.fitChecks.create({
      author: "user-id",
      appliance: "Cooktop Installed Over Oven",
      product: { height: 5.01, width: 30.01, depth: 21.01 },
      space: { height: 5, width: 30, depth: 21 },
    });

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/appliance-fit`);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      author: "user-id",
      type: "Cooktop Installed Over Oven",
      measurements: { height: 5.01, width: 30.01, depth: 21.01 },
      cutoutMeasurements: { height: 5, width: 30, depth: 21 },
    });
    expect(fit).toMatchObject({
      id: "fit-id",
      isPaid: false,
      result: { status: "modify", label: "Requires Modification" },
    });
    expect(fit.result.summary).toBe('Height too small by 1/100", Width too small by 1/100", Depth too small by 1/100"');
  });

  it("checks payment for a specific fit record and starts checkout with its reference", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        _id: "fit-id",
        type: "Cooktop Installed Over Oven",
        measurements: { height: 5.01, width: 30.01, depth: 21.01 },
        cutoutMeasurements: { height: 5, width: 30, depth: 21 },
        dimensionStatus: {
          height: "require_modification",
          width: "require_modification",
          depth: "require_modification",
        },
        status: "require_modification",
        failReason: 'Height too small by 0.01", Width too small by 0.01", Depth too small by 0.01"',
        isPaid: true,
      }))
      .mockResolvedValueOnce(jsonResponse("https://checkout.stripe.com/c/pay/session"));
    vi.stubGlobal("fetch", fetchMock);

    const fit = await api.fitChecks.get("fit-id");
    const checkoutUrl = await api.payments.checkout({ user: "user-id", reference: "fit-id" });

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/appliance-fit/fit-id`);
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
    expect(fit).toMatchObject({ id: "fit-id", isPaid: true, result: { status: "modify" } });
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/payments/checkout`);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ user: "user-id", reference: "fit-id" });
    expect(checkoutUrl).toBe("https://checkout.stripe.com/c/pay/session");
  });

  it("requests a paginated fit-check list and preserves the API pagination metadata", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        statusCode: 200,
        meta: { page: 2, limit: 10, total: 329, totalPage: 33 },
        data: [{
          _id: "fit-id",
          type: "Refrigerator",
          measurements: { height: 30, width: 24, depth: 24 },
          cutoutMeasurements: { height: 31, width: 25, depth: 25 },
          dimensionStatus: { height: "fits_perfectly", width: "fits_perfectly", depth: "fits_perfectly" },
          status: "fits_perfectly",
          isPaid: true,
        }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.fitChecks.list({ page: 2, limit: 10 });

    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.toString()).toBe("page=2&limit=10");
    expect(result.meta).toEqual({ page: 2, limit: 10, total: 329, totalPage: 33 });
    expect(result.items).toHaveLength(1);
  });

  it("keeps historical fit checks with missing dimensions displayable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        statusCode: 200,
        meta: { page: 1, limit: 10, total: 1, totalPage: 1 },
        data: [{
          _id: "legacy-fit-id",
          type: "Standalone Cooktop",
          measurements: { width: 30.2, depth: 20.2 },
          cutoutMeasurements: { width: 30, depth: 20 },
          dimensionStatus: { width: "require_modification", depth: "require_modification" },
          status: "require_modification",
          failReason: 'Width too small by 0.20", Depth too small by 0.20"',
          isPaid: true,
        }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.fitChecks.list();

    expect(result.items[0]).toMatchObject({
      id: "legacy-fit-id",
      product: { height: null, width: 30.2, depth: 20.2 },
      space: { height: null, width: 30, depth: 20 },
      result: {
        hasCompleteMeasurements: false,
        dimensions: [{ key: "width" }, { key: "depth" }],
      },
    });
  });

  it("deletes a fit check using its record ID", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ message: "Deleted" }));
    vi.stubGlobal("fetch", fetchMock);

    await api.fitChecks.remove("fit-id");

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/appliance-fit/fit-id`);
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("requires the signed-in user ID as fit check author", async () => {
    await expect(api.fitChecks.create({
      appliance: "Refrigerator",
      product: { height: 30, width: 24, depth: 24 },
      space: { height: 31, width: 25, depth: 25 },
    })).rejects.toMatchObject({ code: "FIT_CHECK_AUTHOR_REQUIRED" });
  });

  it("loads the terms and privacy documents from the contents endpoint", async () => {
    const legalContent = {
      termsAndConditions: "<p>Terms text</p>",
      privacyPolicy: "<p>Privacy text</p>",
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([legalContent]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(api.contents.getLegalContent()).resolves.toEqual(legalContent);
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/contents`);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});
