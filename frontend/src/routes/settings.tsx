import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Console" }] }),
});

function SettingsPage() {
  const [url, setUrl] = useState(
    (typeof window !== "undefined" && localStorage.getItem("api_base_url")) ||
      "http://localhost:5000/api/v1",
  );

  const save = () => {
    localStorage.setItem("api_base_url", url.replace(/\/$/, ""));
    toast.success("API URL saved. Reloading…");
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Configure how the frontend connects to your backend.</p>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Backend API base URL</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Point this at your Express server. Include the <code className="rounded bg-muted px-1">/api/v1</code> prefix.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="url">API URL</Label>
          <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={save}>Save</Button>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("api_base_url");
              window.location.reload();
            }}
          >
            Reset
          </Button>
        </div>
      </section>
    </main>
  );
}
