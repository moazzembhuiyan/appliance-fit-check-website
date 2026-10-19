"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { contactSchema } from "@/lib/validation/schemas";
import { api } from "@/lib/api";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  const onSubmit = async (v) => {
    try {
      await api.contact.send(v);
      setSent(true);
      reset();
    } catch (e) {
      toast.error(e.message || "Could not send your message.");
    }
  };

  if (sent)
    return (
      <div role="status" className="rounded-2xl border border-ok/30 bg-ok-soft p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-ok" />
        <h2 className="mt-4 text-2xl">Message sent</h2>
        <p className="mt-2 text-ink/80">Thanks for getting in touch. We’ll reply as soon as we can.</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea id="message" rows={6} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "message-err" : undefined}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10 aria-[invalid=true]:border-no"
          {...register("message")} />
        {errors.message && <p id="message-err" role="alert" className="text-xs font-medium text-no">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" loading={isSubmitting}>Send message</Button>
    </form>
  );
}
