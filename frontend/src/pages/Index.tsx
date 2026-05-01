import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> API connected
      </span>
      <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        A simple console for your backend
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        Authenticate, manage your session, and access role-protected routes — all wired up to your
        Express + MongoDB API.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/login"><Button size="lg">Sign in</Button></Link>
        <Link to="/register"><Button size="lg" variant="outline">Create account</Button></Link>
      </div>

      <div className="mt-20 grid w-full gap-4 sm:grid-cols-3">
        {[
          { t: "Auth", d: "JWT-based register & login." },
          { t: "Protected", d: "Token-guarded routes." },
          { t: "Admin", d: "Role-based access control." },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-border bg-card p-5 text-left">
            <div className="text-sm font-semibold text-foreground">{f.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.d}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Index;
