import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { clearToken, decodeToken, getToken } from "@/lib/api";
import { useEffect, useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [token, setTok] = useState<string | null>(null);

  useEffect(() => {
    setTok(getToken());
  }, [routerState.location.pathname]);

  const payload = token ? decodeToken(token) : null;

  const handleLogout = () => {
    clearToken();
    setTok(null);
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            ◆
          </span>
          <span>Console</span>
        </Link>
        <nav className="flex items-center gap-1">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-foreground" }}
              >
                Dashboard
              </Link>
              <Link
                to="/items"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-foreground" }}
              >
                Items
              </Link>
              {payload?.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-foreground" }}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/settings"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-foreground" }}
              >
                Settings
              </Link>
              <Button size="sm" variant="outline" onClick={handleLogout} className="ml-2">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm" className="ml-1">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
