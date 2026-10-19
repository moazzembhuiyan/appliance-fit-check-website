"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "@/components/layout/logout-dialog";
import { useAuth } from "@/context/auth-context";
import { changePasswordSchema } from "@/lib/validation/schemas";
import { api } from "@/lib/api";

export default function Settings() {
  const { user } = useAuth();
  const [logout, setLogout] = useState(false);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(changePasswordSchema), mode: "onTouched" });

  const onSubmit = async ({ currentPassword, password }) => {
    setFormError("");
    try {
      await api.user.changePassword({ currentPassword, password });
      toast.success("Password changed.");
      reset();
    } catch (e) {
      if (e.fieldErrors) Object.entries(e.fieldErrors).forEach(([k, m]) => setError(k, { message: String(m) }));
      setFormError(e.message || "Could not change your password.");
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-4xl">Settings</h1>

      <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-2xl">Change password</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-5">
          {formError && <p role="alert" className="rounded-xl bg-no-soft p-3 text-sm font-medium text-no">{formError}</p>}
          <Field label="Current password" type="password" autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
          <Field label="New password" type="password" autoComplete="new-password" hint="At least 8 characters, with a letter and a number." error={errors.password?.message} {...register("password")} />
          <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" loading={isSubmitting}>Update password</Button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-2xl">Account</h2>
        <dl className="mt-4 divide-y divide-line text-sm">
          <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Signed in as</dt><dd className="font-medium">{user?.email}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Email status</dt><dd className="font-medium">{user?.emailVerified ? "Verified" : "Not verified"}</dd></div>
        </dl>
        <Button variant="outline" className="mt-5" onClick={() => setLogout(true)}><LogOut className="size-4" /> Sign out</Button>
      </section>
      <LogoutDialog open={logout} onOpenChange={setLogout} />
    </div>
  );
}
