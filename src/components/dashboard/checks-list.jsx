"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ResultPanel } from "@/components/calculator/result-panel";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { persistPendingFit } from "@/lib/fit/pending-payment";
import { getAppliance } from "@/lib/fit/appliances";
import { fmtDate } from "@/lib/utils";
import { formatFraction } from "@/lib/measurements";

function formatDimensions(dimensions) {
  return ["width", "height", "depth"]
    .map((key) => formatFraction(dimensions[key]))
    .join("×");
}

export function EmptyChecks({ compact }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/25 bg-white/60 p-10 text-center">
      <h3 className="text-xl">No saved fit checks yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Run a fit check and your results will appear here. Unpaid results stay locked until checkout is complete.</p>
      {!compact && <Button asChild className="mt-6"><Link href="/check">Run a fit check</Link></Button>}
    </div>
  );
}

export function ChecksList({ items, onRemove }) {
  const { user } = useAuth();
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  const startCheckout = async () => {
    if (!view?.id || !user?._id) {
      toast.error("Your fit check or account ID is missing. Refresh and try again.");
      return;
    }
    setCheckoutBusy(true);
    try {
      persistPendingFit(view);
      const checkoutUrl = await api.payments.checkout({ user: user._id, reference: view.id });
      window.location.assign(checkoutUrl);
    } catch (error) {
      toast.error(error.message || "Could not start checkout.");
      setCheckoutBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try { await onRemove(del.id); toast.success("Fit check deleted."); setDel(null); }
    catch (e) { toast.error(e.message || "Could not delete."); }
    finally { setBusy(false); }
  };

  return (
    <>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {items?.map((c) => {
          const a = getAppliance(c.appliance);
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:px-6">
              <div className="min-w-0 flex-1 basis-48">
                <p className="font-display text-lg">{a?.name || c.appliance}</p>
                <p className="text-xs text-muted">{fmtDate(c.createdAt)} · {formatDimensions(c.product)} in into {formatDimensions(c.space)} in</p>
              </div>
              {c.isPaid
                ? <StatusBadge status={c.result.status} label={c.result.label} />
                : <span className="rounded-full bg-tight-soft px-3 py-1 text-sm font-semibold text-tight">Payment required</span>}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setView(c)} aria-label={`View ${a?.name} check`}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">View</span></Button>
                <Button variant="ghost" size="sm" onClick={() => setDel(c)} aria-label={`Delete ${a?.name} check`}><Trash2 className="size-4" /><span className="sr-only sm:not-sr-only">Delete</span></Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent title="Saved fit check" className="max-h-[90dvh] max-w-3xl overflow-y-auto">
          {view && <ResultPanel
            appliance={getAppliance(view.appliance) || { name: view.appliance, checklist: [], guide: "faq" }}
            result={view.result}
            product={view.product}
            space={view.space}
            locked={!view.isPaid}
            onCheckout={startCheckout}
            checkoutLoading={checkoutBusy}
            loggedIn={!!user}
            userIdAvailable={!!user?._id}
            canSave={false}
          />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <DialogContent title="Delete this fit check?" description="This removes it from your saved checks. This can’t be undone.">
          <div className="flex justify-end gap-3">
            <DialogClose asChild><Button variant="outline">Keep it</Button></DialogClose>
            <Button variant="danger" onClick={confirmDelete} loading={busy}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const ChecksSkeleton = () => (
  <div className="space-y-3" role="status" aria-label="Loading fit checks">
    {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-mist" />)}
  </div>
);
