import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearToken, decodeToken, getToken } from "@/lib/api";
import { useEffect, useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
  }, [location.pathname]);

  const payload = token ? decodeToken(token) : null;
  const isAdmin = payload?.role === "admin";

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-foreground ${
      location.pathname === path ? "text-foreground" : "text-muted-foreground"
    }`;

  const onLogout = () => {
    clearToken();
    setTokenState(null);
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-base font-semibold tracking-tight">
          Console
        </Link>
        <nav className="flex items-center gap-5">
          {token ? (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
              <Link to="/items" className={linkClass("/items")}>Items</Link>
              {isAdmin && <Link to="/admin" className={linkClass("/admin")}>Admin</Link>}
              <Link to="/settings" className={linkClass("/settings")}>Settings</Link>
              <Button size="sm" variant="outline" onClick={onLogout}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/settings" className={linkClass("/settings")}>Settings</Link>
              <Link to="/login" className={linkClass("/login")}>Sign in</Link>
              <Link to="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
