import { ApiError, request, unwrapResponse } from "./client";
import { ENDPOINTS } from "./endpoints";

export const applianceModelsApi = {
  async listTypes() {
    const response = await request(ENDPOINTS.applianceTypes);
    const types = unwrapResponse(response);
    if (!Array.isArray(types) || types.some((item) => typeof item?.type !== "string")) {
      throw new ApiError("The API returned an invalid appliance type list.", {
        code: "INVALID_APPLIANCE_TYPES_RESPONSE",
      });
    }
    return types;
  },

  async findByTypeAndModel(type, model) {
    const response = await request(ENDPOINTS.applianceByTypeAndModel, {
      query: { type, model },
    });
    const appliance = unwrapResponse(response);
    if (
      !appliance ||
      typeof appliance !== "object" ||
      appliance.type !== type ||
      typeof appliance.model !== "string" ||
      !["height", "width", "depth"].every((dimension) =>
        Number.isFinite(Number(appliance[dimension])) && Number(appliance[dimension]) > 0
      )
    ) {
      throw new ApiError("No matching appliance model was found. Enter the dimensions manually.", {
        code: "APPLIANCE_MODEL_NOT_FOUND",
      });
    }
    return {
      ...appliance,
      height: Number(appliance.height),
      width: Number(appliance.width),
      depth: Number(appliance.depth),
    };
  },
};
