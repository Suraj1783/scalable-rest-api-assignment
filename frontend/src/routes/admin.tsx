import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Console" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    api<string>("/admin", { auth: true })
      .then((r) => setMessage(typeof r === "string" ? r : JSON.stringify(r)))
      .catch((err: Error) => {
        setForbidden(true);
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Role-restricted area for administrators.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking access…</p>
        ) : forbidden ? (
          <div>
            <div className="text-base font-semibold text-destructive">Access denied</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account does not have admin privileges.
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Admin access verified
            </div>
            <p className="mt-4 text-sm text-foreground">{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
