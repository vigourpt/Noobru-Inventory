import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useInventory } from "@/lib/inventory";
import { Package, TrendingUp, AlertTriangle, Truck } from "lucide-react";

interface InventoryStatsProps {
  stats?: {
    totalItems: number;
    lowStock: number;
    incomingStock: number;
    pendingTransfers: number;
  };
}

const InventoryStats = () => {
  const { items, movements, loading } = useInventory();

  const stats = {
    totalItems: items.length,
    lowStock: items.filter((item) => item.quantity <= item.minimumStock).length,
    incomingStock: movements.filter(
      (m) => m.type === "receive" && m.status === "pending",
    ).length,
    pendingTransfers: movements.filter(
      (m) => m.type === "transfer" && m.status === "pending",
    ).length,
  };

  if (loading) {
    return (
      <div className="w-full bg-background p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm animate-pulse">
            <CardContent className="h-[100px]" />
          </Card>
        ))}
      </div>
    );
  }
  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Incoming Stock",
      value: stats.incomingStock,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Pending Transfers",
      value: stats.pendingTransfers,
      icon: Truck,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="w-full bg-background p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {stat.value.toLocaleString()}
              </h3>
            </div>
            <div className={`${stat.color} bg-background/10 p-3 rounded-full`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStats;
