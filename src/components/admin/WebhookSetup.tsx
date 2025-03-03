import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WebhookSetup = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvent, setWebhookEvent] = useState("on-new-orders");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved values from localStorage
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    const savedWebhookEvent = localStorage.getItem("webhookEvent");

    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedWebhookEvent) setWebhookEvent(savedWebhookEvent);
  }, []);

  const handleSaveWebhookSettings = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("webhookUrl", webhookUrl);
    localStorage.setItem("webhookEvent", webhookEvent);
    toast({
      title: "Success",
      description: "Webhook settings saved successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Use webhooks to automatically update your inventory when changes occur
          in external systems like ShipStation or your e-commerce platform.
        </p>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="Enter webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This URL will receive POST requests with inventory updates from
            external systems.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-event">Trigger Event</Label>
          <Select value={webhookEvent} onValueChange={setWebhookEvent}>
            <SelectTrigger id="webhook-event">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-new-orders">On New Orders</SelectItem>
              <SelectItem value="on-new-items">On New Items</SelectItem>
              <SelectItem value="on-orders-shipped">
                On Orders Shipped
              </SelectItem>
              <SelectItem value="on-items-shipped">On Items Shipped</SelectItem>
              <SelectItem value="on-fulfillment-shipped">
                On Fulfillment Shipped
              </SelectItem>
              <SelectItem value="on-fulfillment-rejected">
                On Fulfillment Rejected
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select which event should trigger the webhook.
          </p>
        </div>

        <div className="pt-4">
          <Button onClick={handleSaveWebhookSettings}>
            Save Webhook Settings
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Testing Webhook</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Send a test payload to your webhook URL to verify it's working
            correctly.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Test Webhook",
                description:
                  "This would send a test payload to your webhook URL in a real implementation.",
              });
            }}
            disabled={!webhookUrl}
          >
            Send Test Payload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookSetup;
