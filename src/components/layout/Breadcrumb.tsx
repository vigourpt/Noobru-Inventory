import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbMap: { [key: string]: string } = {
    inventory: "Inventory",
    users: "User Management",
    reports: "Reports",
    settings: "Settings",
    "stock-transfer": "Stock Transfer",
    "stock-check": "Stock Check",
    "process-orders": "Process Orders",
    returns: "Returns",
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={name} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">
                {breadcrumbMap[name] || name}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumbMap[name] || name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
