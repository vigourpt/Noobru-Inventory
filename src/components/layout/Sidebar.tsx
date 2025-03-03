import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  ClipboardList,
  Users,
  Settings,
  BarChart3,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  userRole?: "warehouse" | "fulfillment" | "management" | "admin";
  onLogout?: () => void;
}

const menuItems = {
  warehouse: [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: Truck, label: "Stock Movements", path: "/stock-movement" },
    { icon: ClipboardList, label: "Orders", path: "/orders" },
  ],
  fulfillment: [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Orders", path: "/orders" },
    { icon: Truck, label: "Stock Movements", path: "/stock-movement" },
  ],
  management: [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Package, label: "Inventory", path: "/inventory" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "User Management", path: "/users" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: Truck, label: "Stock Movements", path: "/stock-movement" },
    { icon: ClipboardList, label: "Orders", path: "/orders" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
};

const Sidebar = ({
  userRole = "warehouse",
  onLogout = () => {},
}: SidebarProps) => {
  const items = menuItems[userRole] || menuItems.warehouse;

  return (
    <div className="flex h-full w-[280px] flex-col bg-background border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Inventory App</h2>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {userRole} Portal
        </p>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2 py-4">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
