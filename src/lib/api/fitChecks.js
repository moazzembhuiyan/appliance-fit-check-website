import { ApiError, request, unwrapResponse } from "./client";
import { ENDPOINTS } from "./endpoints";
import { formatFraction } from "@/lib/measurements";

const STATUS_MAP = {
  fits: "fits",
  fits_perfectly: "fits",
  tight: "tight",
  tight_fit: "tight",
  tight_fits: "tight",
  modify: "modify",
  require_modification: "modify",
  requires_modification: "modify",
  no: "no",
  does_not_fit: "no",
  not_fit: "no",
};

const STATUS_LABELS = {
  fits: "Fits Perfectly",
  tight: "Tight Fit",
  modify: "Requires Modification",
  no: "Does Not Fit",
};

function normalizeStatus(status) {
  const key = String(status || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const normalized = STATUS_MAP[key];
  if (!normalized) {
    throw new ApiError("The API returned an unknown fit status.", { code: "INVALID_FIT_STATUS" });
  }
  return normalized;
}

function formatFailReason(reason) {
  if (typeof reason !== "string") return reason;
  return reason.replace(/(\d+(?:\.\d+)?)\s*"/g, (_, value) => `${formatFraction(Number(value))}"`);
}

function normalizeFitRecord(record) {
  const appliance = record?.type ?? record?.appliance;
  const product = record?.measurements ?? record?.product;
  const space = record?.cutoutMeasurements ?? record?.space;
  const id = record?._id ?? record?.id;
  const status = normalizeStatus(record?.status ?? record?.result?.status);
  if (
    typeof id !== "string" ||
    !id ||
    typeof appliance !== "string" ||
    !product ||
    !space
  ) {
    throw new ApiError("The API returned an invalid fit check.", { code: "INVALID_FIT_RECORD" });
  }

  const normalizedProduct = {};
  const normalizedSpace = {};
  for (const key of ["height", "width", "depth"]) {
    const productValue = Number(product[key]);
    const spaceValue = Number(space[key]);
    normalizedProduct[key] = Number.isFinite(productValue) && productValue > 0 ? productValue : null;
    normalizedSpace[key] = Number.isFinite(spaceValue) && spaceValue > 0 ? spaceValue : null;
  }

  const dimensionStatuses = record?.dimensionStatus ?? {};
  const dimensions = ["height", "width", "depth"].flatMap((key) => {
    if (normalizedProduct[key] === null || normalizedSpace[key] === null) return [];
    const dimensionStatus = normalizeStatus(dimensionStatuses[key] ?? status);
    const clearance = Number((normalizedSpace[key] - normalizedProduct[key]).toFixed(3));
    const amount = `${Math.abs(clearance)} in`;
    const message = clearance < 0
      ? `Product is ${amount} larger than the space.`
      : `${amount} of clearance.`;
    return [{
      key,
      label: key[0].toUpperCase() + key.slice(1),
      product: normalizedProduct[key],
      space: normalizedSpace[key],
      clearance,
      status: dimensionStatus,
      message,
    }];
  });

  return {
    ...record,
    id,
    createdAt: record?.createdAt,
    appliance,
    product: normalizedProduct,
    space: normalizedSpace,
    isPaid: record?.isPaid === true,
    result: {
      status,
      label: STATUS_LABELS[status],
      summary: formatFailReason(record?.failReason || record?.result?.summary || STATUS_LABELS[status]),
      dimensions,
      hasCompleteMeasurements: dimensions.length === 3,
    },
  };
}

function extractRecords(response) {
  const data = unwrapResponse(response);
  if (Array.isArray(data)) return data;
  for (const candidate of [data?.items, data?.applianceFits, data?.results, response?.items]) {
    if (Array.isArray(candidate)) return candidate;
  }
  throw new ApiError("The API returned an invalid fit check list.", {
    code: "INVALID_FIT_LIST_RESPONSE",
  });
}

function paginationMeta(meta, fallbackPage, fallbackLimit, count) {
  const page = Number(meta?.page);
  const limit = Number(meta?.limit);
  const total = Number(meta?.total);
  const totalPage = Number(meta?.totalPage);
  return {
    page: Number.isInteger(page) && page > 0 ? page : fallbackPage,
    limit: Number.isInteger(limit) && limit > 0 ? limit : fallbackLimit,
    total: Number.isInteger(total) && total >= 0 ? total : count,
    totalPage: Number.isInteger(totalPage) && totalPage >= 0
      ? totalPage
      : Math.ceil(count / fallbackLimit),
  };
}

function requireAuthor(author) {
  if (typeof author !== "string" || !author.trim()) {
    throw new ApiError("Sign in before creating an appliance fit check.", {
      code: "FIT_CHECK_AUTHOR_REQUIRED",
    });
  }
}

/**
 * Saved fit check shape used by the UI:
 * { id, createdAt, appliance, product:{height,width,depth}, space:{height,width,depth},
 *   result:{status,label,summary,dimensions[]} }
 */
export const fitChecksApi = {
  async list({ page = 1, limit = 10 } = {}) {
    const response = await request(ENDPOINTS.listFitChecks, { query: { page, limit } });
    const records = extractRecords(response).map(normalizeFitRecord);
    return {
      items: records,
      meta: paginationMeta(response?.meta, page, limit, records.length),
    };
  },
  async get(id) {
    const response = await request(ENDPOINTS.getFitCheck, { params: { id } });
    return normalizeFitRecord(unwrapResponse(response));
  },
  async create({ author, appliance, product, space }) {
    requireAuthor(author);
    const response = await request(ENDPOINTS.saveFitCheck, {
      body: { author, type: appliance, measurements: product, cutoutMeasurements: space },
    });
    const record = unwrapResponse(response);
    return normalizeFitRecord(record);
  },
  save: ({ author, appliance, product, space }) => {
    requireAuthor(author);
    return request(ENDPOINTS.saveFitCheck, {
      body: { author, type: appliance, measurements: product, cutoutMeasurements: space },
    });
  },
  remove: (id) => request(ENDPOINTS.deleteFitCheck, { params: { id } }),
  normalizeRecord: normalizeFitRecord,
};
