import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/forms";

export const metadata = { title: "Verify your email", robots: { index: false } };
export default function Page() {
  return <Suspense><VerifyOtpForm /></Suspense>;
}
