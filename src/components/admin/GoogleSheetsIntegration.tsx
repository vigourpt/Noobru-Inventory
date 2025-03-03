import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  importInventoryFromSheets,
  exportInventoryToSheets,
} from "@/lib/googleSheets";
import { useInventory } from "@/lib/inventory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GoogleSheetsIntegration = () => {
  const [apiKey, setApiKey] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [secondSpreadsheetId, setSecondSpreadsheetId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvent, setWebhookEvent] = useState("on-new-orders");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { items, addItem } = useInventory();

  useEffect(() => {
    // Load saved values from localStorage
    const savedApiKey = localStorage.getItem("googleSheetsApiKey");
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    const savedWebhookEvent = localStorage.getItem("webhookEvent");
    const savedSpreadsheetId = localStorage.getItem("spreadsheetId");
    const savedSecondSpreadsheetId = localStorage.getItem(
      "secondSpreadsheetId",
    );

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedWebhookEvent) setWebhookEvent(savedWebhookEvent);
    if (savedSpreadsheetId) setSpreadsheetId(savedSpreadsheetId);
    if (savedSecondSpreadsheetId)
      setSecondSpreadsheetId(savedSecondSpreadsheetId);
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("googleSheetsApiKey", apiKey);
    toast({
      title: "Success",
      description: "Google Sheets API key saved successfully",
    });
  };

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

  const handleImportData = async (sheetId: string) => {
    if (!apiKey || !sheetId) {
      toast({
        title: "Error",
        description: "Please enter both API key and Spreadsheet ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const items = await importInventoryFromSheets(sheetId, apiKey);

      // Add each item to the inventory
      for (const item of items) {
        await addItem({
          ...item,
          lastUpdated: new Date().toISOString(),
        });
      }

      toast({
        title: "Success",
        description: `Imported ${items.length} items from Google Sheets`,
      });

      // Save the spreadsheet ID
      if (sheetId === spreadsheetId) {
        localStorage.setItem("spreadsheetId", spreadsheetId);
      } else if (sheetId === secondSpreadsheetId) {
        localStorage.setItem("secondSpreadsheetId", secondSpreadsheetId);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Error",
        description:
          "Failed to import data from Google Sheets. Make sure your spreadsheet is shared with 'Anyone with the link can view' permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (sheetId: string) => {
    if (!apiKey || !sheetId) {
      toast({
        title: "Error",
        description: "Please enter both API key and Spreadsheet ID",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportInventoryToSheets(sheetId, apiKey, items);

      toast({
        title: "Success",
        description: `Exported ${items.length} items to Google Sheets. Note: Full write access requires OAuth setup.`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data to Google Sheets",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const extractSpreadsheetId = (url: string, isSecond = false) => {
    // Extract spreadsheet ID from URL
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      if (isSecond) {
        setSecondSpreadsheetId(match[1]);
      } else {
        setSpreadsheetId(match[1]);
      }
    } else {
      // If not a URL, assume it's the ID directly
      if (isSecond) {
        setSecondSpreadsheetId(url);
      } else {
        setSpreadsheetId(url);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Google Sheets Integration
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Make sure your Google Sheet is shared with "Anyone with the
                  link can view" permissions
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Connect to Google Sheets to import and export inventory data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">Google Sheets API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Google Sheets API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSaveApiKey} className="mt-2">
            Save API Key
          </Button>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Important:</p>
            <p>
              Make sure your Google Sheet is shared with "Anyone with the link
              can view" permissions and has the correct column headers.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open("/GOOGLE_SHEETS_SETUP.md", "_blank");
              }}
              className="text-blue-600 hover:underline"
            >
              View setup instructions
            </a>
          </div>
        </div>

        <Tabs defaultValue="workbook1" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workbook1">Workbook 1</TabsTrigger>
            <TabsTrigger value="workbook2">Workbook 2</TabsTrigger>
          </TabsList>

          <TabsContent value="workbook1" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spreadsheet-url">
                Google Spreadsheet URL or ID
              </Label>
              <Input
                id="spreadsheet-url"
                placeholder="Enter Google Spreadsheet URL or ID"
                value={spreadsheetId}
                onChange={(e) => extractSpreadsheetId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Spreadsheet ID: {spreadsheetId || "Not set"}
              </p>
              <div className="flex space-x-2 mt-2">
                <Button
                  onClick={() => handleImportData(spreadsheetId)}
                  disabled={isLoading || !spreadsheetId}
                >
                  {isLoading ? "Importing..." : "Import Data"}
                </Button>
                <Button
                  variant="outline"
                  disabled={isExporting || !spreadsheetId}
                  onClick={() => handleExportData(spreadsheetId)}
                >
                  {isExporting ? "Exporting..." : "Export Data"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workbook2" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="second-spreadsheet-url">
                Google Spreadsheet URL or ID
              </Label>
              <Input
                id="second-spreadsheet-url"
                placeholder="Enter Google Spreadsheet URL or ID"
                value={secondSpreadsheetId}
                onChange={(e) => extractSpreadsheetId(e.target.value, true)}
              />
              <p className="text-sm text-muted-foreground">
                Spreadsheet ID: {secondSpreadsheetId || "Not set"}
              </p>
              <div className="flex space-x-2 mt-2">
                <Button
                  onClick={() => handleImportData(secondSpreadsheetId)}
                  disabled={isLoading || !secondSpreadsheetId}
                >
                  {isLoading ? "Importing..." : "Import Data"}
                </Button>
                <Button
                  variant="outline"
                  disabled={isExporting || !secondSpreadsheetId}
                  onClick={() => handleExportData(secondSpreadsheetId)}
                >
                  {isExporting ? "Exporting..." : "Export Data"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Webhook Integration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use webhooks to automatically update your inventory when changes
            occur in external systems.
          </p>
          <div className="space-y-4">
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
              <select
                id="webhook-event"
                className="w-full p-2 border rounded-md"
                value={webhookEvent}
                onChange={(e) => setWebhookEvent(e.target.value)}
              >
                <option value="on-new-orders">On New Orders</option>
                <option value="on-new-items">On New Items</option>
                <option value="on-orders-shipped">On Orders Shipped</option>
                <option value="on-items-shipped">On Items Shipped</option>
                <option value="on-fulfillment-shipped">
                  On Fulfillment Shipped
                </option>
                <option value="on-fulfillment-rejected">
                  On Fulfillment Rejected
                </option>
              </select>
              <p className="text-xs text-muted-foreground">
                Select which event should trigger the webhook.
              </p>
            </div>
          </div>
          <Button className="mt-4" onClick={handleSaveWebhookSettings}>
            Save Webhook Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsIntegration;
