export const site = {
  name: "Appliance Fit Check",
  tagline: "Will this appliance fit? Check before you buy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://appliancefitcheck.org",
  appStoreUrl: "https://apps.apple.com/app/appliance-fit-check/id6754309083",
  playStoreUrl: null,
};

export const FIT_CHECK_PRICE = "$9.99";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.28.24:5012/api/v1"
).replace(/\/$/, "");

/** Legal text is fetched from the backend and should be reviewed before publication. */
export const LEGAL_IS_DRAFT = true;
