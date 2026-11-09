export const PENDING_FIT_KEY = "afc.pending-fit";

export function persistPendingFit(record) {
  sessionStorage.setItem(PENDING_FIT_KEY, JSON.stringify({ ...record, isPaid: false }));
}

export function clearPendingFit() {
  sessionStorage.removeItem(PENDING_FIT_KEY);
}
