import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { decodeToken, getToken } from "@/lib/api";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setRedirect("/login");
    } else if (adminOnly) {
      const payload = decodeToken(token);
      if (payload?.role !== "admin") setRedirect("/dashboard");
      else setAllowed(true);
    } else {
      setAllowed(true);
    }
    setChecked(true);
  }, [adminOnly]);

  if (!checked) return null;
  if (redirect) return <Navigate to={redirect} replace />;
  if (!allowed) return null;
  return <>{children}</>;
}
