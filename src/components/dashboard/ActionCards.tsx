import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

interface ActionCard {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  onClick?: () => void;
}

interface ActionCardsProps {
  userRole?: "warehouse" | "fulfillment" | "management" | "admin";
  onActionClick?: (action: string) => void;
}

const roleActions: Record<string, ActionCard[]> = {
  warehouse: [
    {
      icon: Package,
      title: "Receive Stock",
      description: "Log new inventory arrivals",
      action: "receive-stock",
    },
    {
      icon: Truck,
      title: "Stock Transfer",
      description: "Manage inventory movement",
      action: "stock-transfer",
    },
    {
      icon: ClipboardList,
      title: "Stock Check",
      description: "Perform inventory counts",
      action: "stock-check",
    },
  ],
  fulfillment: [
    {
      icon: Package,
      title: "Process Orders",
      description: "Handle order fulfillment",
      action: "process-orders",
    },
    {
      icon: Truck,
      title: "Returns",
      description: "Process return requests",
      action: "returns",
    },
  ],
  management: [
    {
      icon: BarChart3,
      title: "Reports",
      description: "View inventory analytics",
      action: "reports",
    },
    {
      icon: Package,
      title: "Stock Levels",
      description: "Monitor inventory levels",
      action: "stock-levels",
    },
  ],
  admin: [
    {
      icon: Users,
      title: "User Management",
      description: "Manage system users",
      action: "users",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure system settings",
      action: "settings",
    },
    {
      icon: BarChart3,
      title: "Reports",
      description: "View system analytics",
      action: "reports",
    },
  ],
};

const ActionCards = ({
  userRole = "warehouse",
  onActionClick = () => {},
}: ActionCardsProps) => {
  const actions = roleActions[userRole] || roleActions.warehouse;

  return (
    <div className="w-full bg-background p-6">
      <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onActionClick(action.action)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-normal hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(action.action);
                    }}
                  >
                    Get Started →
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActionCards;
