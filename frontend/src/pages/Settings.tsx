import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearBaseUrl, getBaseUrl, setBaseUrl } from "@/lib/api";
import { toast } from "sonner";

const Settings = () => {
  const [url, setUrl] = useState(getBaseUrl());

  const save = () => {
    setBaseUrl(url);
    toast.success("API URL saved. Reloading…");
    setTimeout(() => window.location.reload(), 600);
  };

  const reset = () => {
    clearBaseUrl();
    window.location.reload();
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure how the frontend connects to your backend.
      </p>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Backend server URL</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The server origin only — do <strong>not</strong> include <code className="rounded bg-muted px-1">/api/v1</code>.
          The client appends the right path for each endpoint (e.g. <code className="rounded bg-muted px-1">/api/v1/auth/login</code> and <code className="rounded bg-muted px-1">/api/products</code>).
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="url">Server URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:5000"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={save}>Save</Button>
          <Button variant="outline" onClick={reset}>Reset</Button>
        </div>
      </section>
    </main>
  );
};

export default Settings;
