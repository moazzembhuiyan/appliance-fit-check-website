import { z } from "zod";
import { APPLIANCES } from "@/lib/fit/appliances";
import { parseInches } from "@/lib/measurements";

/* ---------- Calculator ---------- */
export const MAX_DIMENSION_IN = 200;

const dimension = z.preprocess(
  (value) => (typeof value === "string" && !value.trim() ? undefined : parseInches(value)),
  z
    .number({ error: "Enter a measurement, e.g. 29 7/8 or 29.875" })
    .positive("Must be greater than 0")
    .max(MAX_DIMENSION_IN, `Must be ${MAX_DIMENSION_IN} in or less`)
);

const dims = z.object({ height: dimension, width: dimension, depth: dimension });

export const fitInputSchema = z.object({
  appliance: z.enum(APPLIANCES.map((a) => a.id)),
  product: dims,
  space: dims,
});

/* ---------- Auth ---------- */
const email = z.string().trim().min(1, "Enter your email").email("Enter a valid email address");

export const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number");
// NOTE: align these rules with your backend's password policy.

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    email,
    contactNumber: z.string().trim().max(30).optional().or(z.literal("")),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v === true, "Please accept the Terms and Privacy Policy"),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const otpSchema = z.object({ code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code") });
export const forgotSchema = z.object({ email });

export const resetSchema = z
  .object({ password: passwordRule, confirmPassword: z.string().min(1, "Confirm your password") })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email,
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" })
  .refine((d) => d.password !== d.currentPassword, { path: ["password"], message: "Choose a different password" });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email,
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
});
