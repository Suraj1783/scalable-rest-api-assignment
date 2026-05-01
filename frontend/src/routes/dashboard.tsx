import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api, decodeToken, getToken } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Console" }] }),
});

type ProtectedResponse = { msg: string; user: { id: string; role: string } };

function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProtectedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? getToken() : null;
  const payload = token ? decodeToken(token) : null;

  useEffect(() => {
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    api<ProtectedResponse>("/auth/protected", { auth: true })
      .then(setData)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your authenticated session overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="User ID" value={payload?.id ?? "—"} mono />
        <Card label="Role" value={payload?.role ?? "—"} />
        <Card label="Status" value={loading ? "Verifying…" : data ? "Authenticated" : "Error"} />
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Protected endpoint</h2>
            <p className="text-sm text-muted-foreground">GET /api/v1/auth/protected</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              api<ProtectedResponse>("/auth/protected", { auth: true })
                .then((r) => {
                  setData(r);
                  toast.success("Refreshed");
                })
                .catch((e: Error) => toast.error(e.message))
                .finally(() => setLoading(false));
            }}
          >
            Refresh
          </Button>
        </div>
        <pre className="mt-4 overflow-auto rounded-md bg-muted p-4 text-xs text-foreground">
{JSON.stringify(data ?? { loading }, null, 2)}
        </pre>
      </section>
    </main>
  );
}

function Card({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-2 text-lg font-semibold text-foreground ${mono ? "font-mono text-sm" : ""}`}>
        {value}
      </div>
    </div>
  );
}
