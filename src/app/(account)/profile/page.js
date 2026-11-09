"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { profileSchema } from "@/lib/validation/schemas";
import { useUpdateProfileMutation } from "@/store/api";
import { fmtDate } from "@/lib/utils";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formError, setFormError] = useState("");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { register, handleSubmit, reset, setError, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(profileSchema), mode: "onTouched" });

  useEffect(() => { if (user) reset({ name: user.name, email: user.email, phone: user.phone || "" }); }, [user, reset]);

  const onSubmit = async (v) => {
    setFormError("");
    try {
      const { user: u } = await updateProfile(v).unwrap();
      setUser(u);
      toast.success("Profile updated.");
    } catch (e) {
      if (e.fieldErrors) Object.entries(e.fieldErrors).forEach(([k, m]) => setError(k, { message: String(m) }));
      setFormError(e.message || "Could not update your profile.");
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <header>
        <h1 className="text-4xl">Profile</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          {user?.emailVerified && <><BadgeCheck className="size-4 text-ok" aria-hidden /> Email verified ·</>} Member since {user?.createdAt ? fmtDate(user.createdAt) : "—"}
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-6 sm:p-8">
        {formError && <p role="alert" className="rounded-xl bg-no-soft p-3 text-sm font-medium text-no">{formError}</p>}
        <Field label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <p className="-mt-2 flex gap-2 text-xs text-muted"><Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />Whether changing your email requires re-verification is decided by your backend.</p>
        <Field label="Phone (optional)" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isLoading} disabled={!isDirty}>Save changes</Button>
          <Button type="button" variant="ghost" disabled={!isDirty} onClick={() => reset()}>Discard</Button>
        </div>
      </form>
    </div>
  );
}
