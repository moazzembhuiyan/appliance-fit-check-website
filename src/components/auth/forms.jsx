"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { AuthShell, AuthLink } from "./auth-shell";
import { OtpInput } from "./otp-input";
import { useCountdown } from "@/hooks/use-countdown";
import { useAuth } from "@/context/auth-context";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
  useVerifyResetOtpMutation,
} from "@/store/api";
import { safeNext } from "@/lib/safe-redirect";
import { loginSchema, registerSchema, otpSchema, forgotSchema, resetSchema } from "@/lib/validation/schemas";

/** Map API field errors onto react-hook-form, and show the rest as a toast. */
function handleApiError(e, setError, setFormError) {
  if (e?.fieldErrors) Object.entries(e.fieldErrors).forEach(([k, m]) => setError(k, { message: String(m) }));
  setFormError(e?.message || "Something went wrong. Please try again.");
}
const FormError = ({ msg }) => msg ? <p role="alert" className="rounded-xl bg-no-soft p-3 text-sm font-medium text-no">{msg}</p> : null;

/* ------------------------------ LOGIN ------------------------------ */
export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const { signIn, status } = useAuth();
  const next = safeNext(sp.get("next"));
  const [formError, setFormError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  useEffect(() => { if (status === "authenticated") router.replace(next); }, [status, next, router]);

  const onSubmit = async (v) => {
    setFormError("");
    try {
      const res = await login({ email: v.email, password: v.password, remember: v.remember }).unwrap();
      if (res.requiresVerification) {
        toast.message("Please verify your email first.");
        return router.push(`/verify-otp?email=${encodeURIComponent(v.email)}&purpose=signup&next=${encodeURIComponent(next)}`);
      }
      signIn(res.user);
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}.`);
      router.replace(next);
    } catch (e) {
      handleApiError(e, setError, setFormError);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your saved fit checks."
      footer={<>New here? <AuthLink href="/register">Create an account</AuthLink></>}>
      {sp.get("reset") && <p role="status" className="mb-5 rounded-xl bg-ok-soft p-3 text-sm font-medium text-ok">Password updated. Sign in with your new password.</p>}
      {sp.get("expired") && <p role="status" className="mb-5 rounded-xl bg-tight-soft p-3 text-sm font-medium text-tight">Your session expired. Please sign in again.</p>}
      {sp.get("next") && !sp.get("expired") && !sp.get("reset") && <p role="status" className="mb-5 rounded-xl bg-mist p-3 text-sm">Please sign in to continue.</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError msg={formError} />
        <Field label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex min-h-11 items-center gap-2.5"><input type="checkbox" className="size-5 accent-ink" {...register("remember")} /> Keep me signed in</label>
          <Link href="/forgot-password" className="font-medium underline underline-offset-4">Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>Sign in</Button>
      </form>
    </AuthShell>
  );
}

/* ----------------------------- REGISTER ----------------------------- */
export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema), mode: "onTouched", defaultValues: { terms: false, contactNumber: "" } });

  const onSubmit = async (v) => {
    setFormError("");
    try {
      await registerUser({ name: v.name, email: v.email, password: v.password, contactNumber: v.contactNumber }).unwrap();
      toast.success("Account created. Check your email for a verification code.");
      router.push(`/verify-otp?email=${encodeURIComponent(v.email)}&purpose=signup`);
    } catch (e) {
      handleApiError(e, setError, setFormError);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Save fit checks and revisit them any time."
      footer={<>Already have an account? <AuthLink href="/login">Sign in</AuthLink></>}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError msg={formError} />
        <Field label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Field label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register("email")} />
        <Field label="Phone (optional)" type="tel" autoComplete="tel" error={errors.contactNumber?.message} {...register("contactNumber")} />
        <Field label="Password" type="password" autoComplete="new-password" hint="At least 8 characters, with a letter and a number." error={errors.password?.message} {...register("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-ink" aria-invalid={errors.terms ? true : undefined} {...register("terms")} />
            <span>I agree to the <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</span>
          </label>
          {errors.terms && <p role="alert" className="mt-1 text-xs font-medium text-no">{errors.terms.message}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>Create account</Button>
      </form>
    </AuthShell>
  );
}

/* ---------------------------- VERIFY OTP ---------------------------- */
export function VerifyOtpForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const email = sp.get("email") || "";
  const purpose = sp.get("purpose") === "reset" ? "reset" : "signup";
  const next = safeNext(sp.get("next"));
  const { signIn } = useAuth();
  const cooldown = useCountdown(60, email ? `afc.otp.cooldown:${purpose}:${email.toLowerCase()}` : undefined);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [verifyResetOtp, { isLoading: isVerifyingReset }] = useVerifyResetOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(otpSchema), defaultValues: { code: "" } });

  const submit = async ({ code }) => {
    setFormError("");
    try {
      if (purpose === "reset") {
        const { resetToken } = await verifyResetOtp({ email, code }).unwrap();
        try { sessionStorage.setItem("afc.reset", JSON.stringify({ email, resetToken })); } catch {}
        router.replace("/reset-password");
      } else {
        const { user } = await verifyOtp({ email, code }).unwrap();
        signIn(user);
        toast.success("Email verified. Welcome aboard!");
        router.replace(next);
      }
    } catch (e) {
      setError("code", { message: e.message || "Invalid code" });
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const res = await resendOtp({ email }).unwrap();
      cooldown.start(res?.cooldownSeconds || 30);
      toast.success("A new code is on its way.");
    } catch (e) {
      toast.error(e.message || "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  if (!email)
    return (
      <AuthShell title="Verification link incomplete" footer={<AuthLink href="/login">Back to sign in</AuthLink>}>
        <p className="text-muted">We couldn’t tell which email to verify. Please start again from sign in or registration.</p>
      </AuthShell>
    );

  return (
    <AuthShell title="Check your email"
      subtitle={<>We sent a 6-digit code to <strong className="text-ink">{email}</strong>. Enter it below to {purpose === "reset" ? "reset your password" : "verify your account"}.</>}
      footer={<AuthLink href={purpose === "reset" ? "/forgot-password" : "/register"}>Use a different email</AuthLink>}>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
        <FormError msg={formError} />
        <Controller control={control} name="code" render={({ field }) => (
          <OtpInput value={field.value} onChange={(v) => { field.onChange(v); if (v.length === 6) handleSubmit(submit)(); }} error={errors.code?.message} disabled={isSubmitting || isVerifying || isVerifyingReset} autoFocus />
        )} />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting || isVerifying || isVerifyingReset}>Verify</Button>
        <p className="text-center text-sm text-muted">
          Didn’t get it?{" "}
          {cooldown.active ? (
            <span aria-live="polite">Resend in <span className="tabular-nums">0:{String(cooldown.left).padStart(2, "0")}</span></span>
          ) : (
            <button type="button" onClick={resend} disabled={resending} className="font-medium text-ink underline underline-offset-4 disabled:opacity-50">{resending ? "Sending…" : "Resend code"}</button>
          )}
        </p>
      </form>
    </AuthShell>
  );
}

/* -------------------------- FORGOT PASSWORD -------------------------- */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(forgotSchema), mode: "onTouched" });
  const onSubmit = async ({ email }) => {
    setFormError("");
    try {
      await forgotPassword({ email }).unwrap();
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&purpose=reset`);
    } catch (e) {
      setFormError(e.message || "Something went wrong.");
    }
  };
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we’ll send a code to reset it." footer={<AuthLink href="/login">Back to sign in</AuthLink>}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError msg={formError} />
        <Field label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register("email")} />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>Send reset code</Button>
      </form>
    </AuthShell>
  );
}

/* --------------------------- RESET PASSWORD --------------------------- */
export function ResetPasswordForm() {
  const router = useRouter();
  const raw = useSyncExternalStore(
    () => () => {},
    () => { try { return sessionStorage.getItem("afc.reset") || ""; } catch { return ""; } },
    () => undefined // server render: unknown
  );
  let ctx = null; // undefined = loading, null = missing
  if (raw === undefined) ctx = undefined;
  else { try { ctx = JSON.parse(raw || "null"); } catch { ctx = null; } }
  const [formError, setFormError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetSchema), mode: "onTouched" });

  const onSubmit = async ({ password, confirmPassword }) => {
    setFormError("");
    try {
      await resetPassword({ email: ctx.email, resetToken: ctx.resetToken, password, confirmPassword }).unwrap();
      try { sessionStorage.removeItem("afc.reset"); } catch {}
      router.replace("/login?reset=1");
    } catch (e) {
      setFormError(e.message || "Could not reset your password.");
    }
  };

  if (ctx === undefined) return <AuthShell title="Reset password"><div className="h-40 animate-pulse rounded-xl bg-mist" aria-label="Loading" /></AuthShell>;
  if (!ctx)
    return (
      <AuthShell title="Reset link expired" footer={<AuthLink href="/login">Back to sign in</AuthLink>}>
        <p className="text-muted">For your security, reset sessions expire. Request a new code to continue.</p>
        <Button asChild className="mt-6"><Link href="/forgot-password">Start again</Link></Button>
      </AuthShell>
    );

  return (
    <AuthShell title="Choose a new password" subtitle={`for ${ctx.email}`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError msg={formError} />
        <Field label="New password" type="password" autoComplete="new-password" hint="At least 8 characters, with a letter and a number." error={errors.password?.message} {...register("password")} />
        <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>Update password</Button>
      </form>
    </AuthShell>
  );
}
