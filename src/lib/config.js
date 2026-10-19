export const site = {
  name: "Appliance Fit Check",
  tagline: "Will this appliance fit? Check before you buy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://appliancefitcheck.org",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "#",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#",
};

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

/** Set to false once your own Privacy Policy / Terms text replaces the drafts. */
export const LEGAL_IS_DRAFT = true;
