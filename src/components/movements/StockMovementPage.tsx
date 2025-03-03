import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  ArrowDownToLine,
  ArrowRightLeft,
  ClipboardCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StockMovementForm from "../forms/StockMovementForm";

const StockMovementPage = () => {
  const { movements, loading } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [movementType, setMovementType] = useState<
    "receive" | "transfer" | "check"
  >("receive");
  const { toast } = useToast();

  const filteredMovements = movements.filter(
    (movement) =>
      movement.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenForm = (type: "receive" | "transfer" | "check") => {
    setMovementType(type);
    setFormOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "receive":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <ArrowDownToLine className="mr-1 h-3 w-3" /> Receive
          </Badge>
        );
      case "transfer":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <ArrowRightLeft className="mr-1 h-3 w-3" /> Transfer
          </Badge>
        );
      case "check":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <ClipboardCheck className="mr-1 h-3 w-3" /> Check
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-muted-foreground">
            Track and manage inventory movements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleOpenForm("receive")}>
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive Stock
          </Button>
          <Button variant="outline" onClick={() => handleOpenForm("transfer")}>
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Stock
          </Button>
          <Button variant="outline" onClick={() => handleOpenForm("check")}>
            <ClipboardCheck className="mr-2 h-4 w-4" /> Stock Check
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Movements</TabsTrigger>
          <TabsTrigger value="receive">Receiving</TabsTrigger>
          <TabsTrigger value="transfer">Transfers</TabsTrigger>
          <TabsTrigger value="check">Stock Checks</TabsTrigger>
        </TabsList>

        {["all", "receive", "transfer", "check"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {tabValue === "all"
                      ? "All Stock Movements"
                      : tabValue === "receive"
                        ? "Stock Receiving"
                        : tabValue === "transfer"
                          ? "Stock Transfers"
                          : "Stock Checks"}
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search movements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements
                      .filter(
                        (movement) =>
                          tabValue === "all" || movement.type === tabValue,
                      )
                      .map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {new Date(movement.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>{getTypeBadge(movement.type)}</TableCell>
                          <TableCell>{movement.itemId}</TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.fromLocation || "-"}</TableCell>
                          <TableCell>{movement.toLocation || "-"}</TableCell>
                          <TableCell>
                            {getStatusBadge(movement.status)}
                          </TableCell>
                          <TableCell>{movement.userId}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <StockMovementForm
        open={formOpen}
        onOpenChange={setFormOpen}
        type={movementType}
        onSuccess={() => {
          toast({
            title: "Success",
            description: `Stock ${movementType} recorded successfully`,
          });
        }}
      />
    </div>
  );
};

export default StockMovementPage;
