# Setting Up Google Sheets API for Inventory Management

## Overview
This guide explains how to set up the Google Sheets API to work with your inventory management system.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project:
   - In the sidebar, click on "APIs & Services" > "Library"
   - Search for "Google Sheets API" and click on it
   - Click "Enable"

## Step 2: Create API Key

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "API Key"
3. Copy the generated API key
4. (Optional but recommended) Restrict the API key to only the Google Sheets API

## Step 3: Set Up Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. **IMPORTANT**: Make sure to set the sharing settings to "Anyone with the link can view"
   - Click the "Share" button in the top right
   - Change the permissions to "Anyone with the link"
   - Set the role to "Viewer"
   - Click "Done"

3. Set up your sheet with the following columns in the first row:
   - A: SKU
   - B: Name
   - C: Quantity
   - D: Location
   - E: Minimum Stock
   - F: Category
   - G: Price
   - H: Supplier
   - I: Last Updated

4. Add your inventory data starting from row 2

## Step 4: Get Your Spreadsheet ID

1. The spreadsheet ID is in the URL of your Google Sheet:
   - Example URL: `https://docs.google.com/spreadsheets/d/1X7E_JCLU-ivZm7_qjTkqM0CpjppR8K-Lo5SBZV1RM3o/edit#gid=0`
   - The spreadsheet ID is: `1X7E_JCLU-ivZm7_qjTkqM0CpjppR8K-Lo5SBZV1RM3o`

## Step 5: Configure the App

1. In the app's Settings > Integrations tab, enter your API key
2. Enter your spreadsheet ID or full URL
3. Click "Save API Key"

## Troubleshooting

### 403 Forbidden Error

If you see a 403 error when trying to access your spreadsheet, check the following:

1. Make sure your API key is correct
2. Ensure the Google Sheets API is enabled for your project
3. **Most importantly**: Verify that your Google Sheet is shared with "Anyone with the link can view" permissions

### No Data Found Error

If you see "No data found in the specified range" error:

1. Make sure your sheet is named "Inventory" (case-sensitive)
2. Ensure your data starts from row 2 (with headers in row 1)
3. Check that you have data in columns A through I

## For Advanced Users: OAuth Setup

For full read/write access to Google Sheets (including exporting data back to sheets), you'll need OAuth2 authentication:

1. Create OAuth 2.0 credentials in the Google Cloud Console
2. Set up a consent screen
3. Implement OAuth2 flow in your application
4. Use the obtained access token with the writeToGoogleSheets function

This is more complex and requires server-side implementation, which is beyond the scope of the current MVP.