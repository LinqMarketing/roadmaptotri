import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const [location, navigate] = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Mission", path: "/my-mission" },
    { label: "Log Meals", path: "/meals" },
    { label: "Log Training", path: "/training" },
    { label: "Supplements", path: "/supplements" },
    { label: "Training Plans", path: "/training-library" },
  ];

  return (
    <nav className="border-b border-foreground bg-background sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          70.3 Tracker
        </div>

        {/* Nav Items */}
        {isAuthenticated && (
          <div className="flex gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  location === item.path
                    ? "text-foreground font-bold border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        )}

        {/* Login Button */}
        {!isAuthenticated && (
          <a href={getLoginUrl()}>
            <Button className="btn-primary">Login</Button>
          </a>
        )}
      </div>
    </nav>
  );
}
