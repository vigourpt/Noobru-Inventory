import React from "react";
import { useInventory } from "@/lib/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "receive" | "transfer" | "check" | "fulfillment" | "return";
  description: string;
  quantity: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  user: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "receive",
    description: "Received stock - SKU123",
    quantity: 100,
    status: "completed",
    date: "2024-03-20 09:30",
    user: "John Doe",
  },
  {
    id: "2",
    type: "transfer",
    description: "Transfer to Warehouse B - SKU456",
    quantity: 50,
    status: "pending",
    date: "2024-03-20 10:15",
    user: "Jane Smith",
  },
  {
    id: "3",
    type: "check",
    description: "Stock check - Zone A",
    quantity: 200,
    status: "completed",
    date: "2024-03-20 11:00",
    user: "Mike Johnson",
  },
  {
    id: "4",
    type: "fulfillment",
    description: "Order #12345 fulfilled",
    quantity: 25,
    status: "completed",
    date: "2024-03-20 11:30",
    user: "Sarah Wilson",
  },
  {
    id: "5",
    type: "return",
    description: "Return processing - Order #12340",
    quantity: 5,
    status: "pending",
    date: "2024-03-20 12:00",
    user: "Tom Brown",
  },
];

const getStatusColor = (status: Activity["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const RecentActivity = () => {
  const { movements, loading } = useInventory();

  // Sort movements by timestamp and take latest 5
  const activities = movements
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 5)
    .map((movement) => ({
      id: movement.id,
      type: movement.type,
      description: `${movement.type.charAt(0).toUpperCase() + movement.type.slice(1)} - ${movement.itemId}`,
      quantity: movement.quantity,
      status: movement.status,
      date: new Date(movement.timestamp).toLocaleString(),
      user: movement.userId,
    }));

  if (loading) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="capitalize">{activity.type}</TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>{activity.quantity}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(activity.status)} text-white`}
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
