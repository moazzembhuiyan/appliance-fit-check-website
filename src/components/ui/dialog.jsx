"use client";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({ className, children, title, description, ...props }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-[fade_.2s_ease]" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lift data-[state=open]:animate-[pop_.2s_ease]",
          className
        )}
        {...props}
      >
        <D.Title className="font-display text-xl">{title}</D.Title>
        {description ? (
          <D.Description className="mt-2 text-sm text-muted">{description}</D.Description>
        ) : (
          <D.Description className="sr-only">{title}</D.Description>
        )}
        <div className="mt-5">{children}</div>
        <D.Close aria-label="Close" className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-ink">
          <X className="size-5" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
