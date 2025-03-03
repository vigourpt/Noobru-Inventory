import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

const GoogleSheetsSetup = () => {
  const [apiKey, setApiKey] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSaveSpreadsheetId = () => {
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Please enter a Spreadsheet ID",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("spreadsheetId", spreadsheetId);
    toast({
      title: "Success",
      description: "Spreadsheet ID saved successfully",
    });
  };

  const extractSpreadsheetId = (url: string) => {
    // Extract spreadsheet ID from URL
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setSpreadsheetId(match[1]);
    } else {
      // If not a URL, assume it's the ID directly
      setSpreadsheetId(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="spreadsheet-url">Google Spreadsheet URL or ID</Label>
          <Input
            id="spreadsheet-url"
            placeholder="Enter Google Spreadsheet URL or ID"
            value={spreadsheetId}
            onChange={(e) => extractSpreadsheetId(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Spreadsheet ID: {spreadsheetId || "Not set"}
          </p>
          <Button onClick={handleSaveSpreadsheetId} className="mt-2">
            Save Spreadsheet ID
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Testing Connection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Test your connection to Google Sheets by fetching a sample of your
            data.
          </p>
          <Button
            onClick={() => {
              toast({
                title: "Connection Test",
                description:
                  "This would test the connection to your Google Sheet in a real implementation.",
              });
            }}
            disabled={!apiKey || !spreadsheetId}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsSetup;
