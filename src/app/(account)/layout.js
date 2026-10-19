import { AuthGuard } from "@/components/auth/auth-guard";
import { AccountNav } from "@/components/dashboard/account-nav";
import { Container } from "@/components/ui/section";

export const metadata = { robots: { index: false, follow: false } };

export default function AccountLayout({ children }) {
  return (
    <AuthGuard>
      <Container className="grid gap-8 py-8 sm:py-12 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </Container>
    </AuthGuard>
  );
}
