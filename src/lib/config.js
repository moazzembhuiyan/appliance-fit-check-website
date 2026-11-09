export const site = {
  name: "Appliance Fit Check",
  tagline: "Will this appliance fit? Check before you buy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://appliancefitcheck.org",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "#",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#",
};

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.28.24:5012/api/v1"
).replace(/\/$/, "");

/** Legal text is fetched from the backend and should be reviewed before publication. */
export const LEGAL_IS_DRAFT = true;
