import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: "warehouse" | "fulfillment" | "management" | "admin";
  userName?: string;
  onLogout?: () => void;
}

const DashboardLayout = ({
  children,
  userRole = "warehouse",
  userName = "John Doe",
  onLogout = () => {},
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      <Header userName={userName} userRole={userRole} onLogout={onLogout} />
      <main className="pl-[280px] pt-16 min-h-screen">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
