// This file will handle Google Sheets API integration

// Function to fetch data from Google Sheets
export async function fetchFromGoogleSheets(
  spreadsheetId: string,
  range: string,
  apiKey: string,
) {
  try {
    // Make sure the spreadsheet is publicly accessible with the link
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`,
    );

    if (!response.ok) {
      console.error(
        `Google Sheets API error: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
}

// Function to import inventory data from Google Sheets
export async function importInventoryFromSheets(
  spreadsheetId: string,
  apiKey: string,
) {
  try {
    // Fetch inventory data from the 'Inventory' sheet
    const range = "Inventory!A2:I"; // Assuming headers are in row 1
    const values = await fetchFromGoogleSheets(spreadsheetId, range, apiKey);

    if (!values || values.length === 0) {
      throw new Error("No data found in the specified range");
    }

    // Transform the data into inventory items
    const items = values.map((row: any[]) => ({
      sku: row[0] || "",
      name: row[1] || "",
      quantity: parseInt(row[2]) || 0,
      location: row[3] || "",
      minimumStock: parseInt(row[4]) || 0,
      category: row[5] || "",
      price: parseFloat(row[6]) || 0,
      supplier: row[7] || "",
      lastUpdated: row[8] || new Date().toISOString(),
    }));

    return items;
  } catch (error) {
    console.error("Error importing inventory from Google Sheets:", error);
    throw error;
  }
}

// Function to export inventory data to Google Sheets
export async function exportInventoryToSheets(
  spreadsheetId: string,
  apiKey: string,
  items: any[],
) {
  try {
    // Convert items to rows format
    const headers = [
      "SKU",
      "Name",
      "Quantity",
      "Location",
      "Minimum Stock",
      "Category",
      "Price",
      "Supplier",
      "Last Updated",
    ];
    const rows = [
      headers,
      ...items.map((item) => [
        item.sku,
        item.name,
        item.quantity.toString(),
        item.location,
        item.minimumStock.toString(),
        item.category,
        item.price.toString(),
        item.supplier,
        item.lastUpdated,
      ]),
    ];

    // Use the Google Sheets API to update the sheet
    // Note: This requires OAuth2 authentication, not just an API key
    // For simplicity in this demo, we'll just return the data that would be sent
    console.log("Data to export:", rows);
    return rows;
  } catch (error) {
    console.error("Error exporting inventory to Google Sheets:", error);
    throw error;
  }
}

// Function to write data to Google Sheets (requires OAuth, not just API key)
export async function writeToGoogleSheets(
  spreadsheetId: string,
  range: string,
  values: any[][],
  accessToken: string,
) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: values,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Error writing data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    throw error;
  }
}
