import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useInventory } from "@/lib/inventory";

const MockWebhookService = () => {
  const [orderNumber, setOrderNumber] = useState(
    "ORD-" + Math.floor(Math.random() * 10000),
  );
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { items, updateItem, addMovement } = useInventory();

  const handleSimulateOrderShipped = async () => {
    if (!sku || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid SKU and quantity",
        variant: "destructive",
      });
      return;
    }

    // Find the item in inventory
    const item = items.find((item) => item.sku === sku);
    if (!item) {
      toast({
        title: "Error",
        description: `Item with SKU ${sku} not found in inventory`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Update inventory quantity
      const newQuantity = Math.max(0, item.quantity - quantity);
      await updateItem(item.id, {
        quantity: newQuantity,
        lastUpdated: new Date().toISOString(),
      });

      // Record the movement
      await addMovement({
        type: "fulfillment",
        itemId: sku,
        quantity: quantity,
        fromLocation: item.location,
        userId: "webhook-simulation",
        notes: `Order ${orderNumber} shipped`,
        status: "completed",
      });

      toast({
        title: "Webhook Simulated",
        description: `Simulated shipment of ${quantity} units of ${sku} for order ${orderNumber}`,
      });

      // Generate a new random order number for next simulation
      setOrderNumber("ORD-" + Math.floor(Math.random() * 10000));
    } catch (error) {
      console.error("Error simulating webhook:", error);
      toast({
        title: "Error",
        description: "Failed to simulate webhook",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Since we can't set up actual Firebase Functions in this environment,
          use this tool to simulate webhook events from external systems like
          ShipStation.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-number">Order Number</Label>
            <Input
              id="order-number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">Item SKU</Label>
            <Input
              id="sku"
              placeholder="Enter item SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSimulateOrderShipped}>
            Simulate Order Shipped Event
          </Button>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mt-4">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Note:</span> This simulation directly
            updates your inventory and creates movement records, mimicking what
            would happen when a real webhook is received. In a production
            environment, this would be handled by Firebase Cloud Functions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockWebhookService;
