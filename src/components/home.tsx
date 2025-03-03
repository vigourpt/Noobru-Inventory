import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "./layout/DashboardLayout";
import InventoryStats from "./dashboard/InventoryStats";
import ActionCards from "./dashboard/ActionCards";
import RecentActivity from "./dashboard/RecentActivity";
import InventoryForm from "./forms/InventoryForm";

const Home = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const userRole = role as "warehouse" | "fulfillment" | "management" | "admin";
  const userName = user?.email?.split("@")[0] || "User";

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"receive" | "transfer" | "check">(
    "receive",
  );

  const handleActionClick = (action: string) => {
    // Handle navigation actions
    switch (action) {
      case "users":
        navigate("/users");
        return;
      case "reports":
        navigate("/reports");
        return;
      case "settings":
        navigate("/settings");
        return;
      case "inventory":
        navigate("/inventory");
        return;
      case "stock-movement":
        navigate("/stock-movement");
        return;
      case "orders":
        navigate("/orders");
        return;
      case "receive-stock":
        setFormType("receive");
        setFormOpen(true);
        break;
      case "stock-transfer":
        setFormType("transfer");
        setFormOpen(true);
        break;
      case "stock-check":
        setFormType("check");
        setFormOpen(true);
        break;
      default:
        console.log(`Action ${action} clicked`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={handleLogout}
    >
      <div className="space-y-6 bg-background min-h-screen">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}. Here's your inventory overview.
          </p>
        </div>

        <InventoryStats />

        <ActionCards userRole={userRole} onActionClick={handleActionClick} />

        <RecentActivity />

        <InventoryForm
          open={formOpen}
          onOpenChange={setFormOpen}
          formType={formType}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;
