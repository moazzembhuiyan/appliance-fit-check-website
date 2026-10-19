"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function LogoutDialog({ open, onOpenChange }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    try {
      // Navigate first so the account-area guard doesn't redirect to /login when auth state clears.
      router.push("/");
      onOpenChange(false);
      await signOut();
      toast.success("You’ve been signed out.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Sign out?" description="You’ll need to sign in again to see your saved fit checks.">
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Stay signed in</Button>
          </DialogClose>
          <Button onClick={confirm} loading={busy}>Sign out</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
