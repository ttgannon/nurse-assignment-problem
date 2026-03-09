import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAuthStatus, logout } from "@/services/launch";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "Demo" },
  { to: "/contact", label: "Contact" },
];

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAuthStatus().then(({ authenticated }) => setLoggedIn(authenticated));
  }, []);

  async function handleLogout() {
    await logout();
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top navigation ── */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
              N
            </div>
            <span className="text-base tracking-tight">Nursify</span>
          </NavLink>

          {/* Center nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            {loggedIn && (
              <NavLink
                to="/assignment"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )
                }
              >
                Assignment
              </NavLink>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <NavLink to="/demo">
                  <Button variant="ghost" size="sm">Try demo</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1">
        <Outlet context={[loggedIn, setLoggedIn]} />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-white text-[10px] font-bold">
                N
              </div>
              <span className="font-medium text-foreground">Nursify</span>
              <span>· Safer patient assignments</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Nursify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
