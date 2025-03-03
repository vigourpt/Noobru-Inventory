# Setting Up Firebase Cloud Functions for Webhooks

## Overview
This guide explains how to set up a Firebase Cloud Function to receive webhook data from ShipStation and update your inventory accordingly.

## Step 1: Set Up Firebase Cloud Functions

1. Install Firebase CLI if you haven't already:
   ```
   npm install -g firebase-tools
   ```

2. Initialize Firebase Functions in your project:
   ```
   firebase login
   firebase init functions
   ```

3. Create a new function in `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.shipstationWebhook = functions.https.onRequest(async (req, res) => {
  // Verify the request is from ShipStation (you can add authentication here)
  
  try {
    // Get the webhook data
    const webhookData = req.body;
    const eventType = req.headers['x-shipstation-hook-event'] || 'unknown';
    
    console.log(`Received webhook: ${eventType}`, webhookData);
    
    // Process based on event type
    switch (eventType) {
      case 'ORDER_NOTIFY':
        // Handle new order
        await processNewOrder(webhookData);
        break;
      
      case 'SHIP_NOTIFY':
        // Handle shipped order
        await processShippedOrder(webhookData);
        break;
      
      // Add other event types as needed
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    // Return success
    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

async function processNewOrder(orderData) {
  // Extract order items
  const items = orderData.items || [];
  
  // Update inventory for each item
  for (const item of items) {
    const sku = item.sku;
    const quantity = item.quantity;
    
    // Get the inventory item
    const inventoryRef = admin.firestore().collection('inventory');
    const snapshot = await inventoryRef.where('sku', '==', sku).get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const currentQuantity = doc.data().quantity || 0;
      
      // Update the quantity (reserve the items)
      await doc.ref.update({
        quantity: currentQuantity - quantity,
        lastUpdated: new Date().toISOString()
      });
      
      // Record the movement
      await admin.firestore().collection('movements').add({
        type: 'order',
        itemId: sku,
        quantity: quantity,
        fromLocation: doc.data().location,
        userId: 'webhook',
        notes: `Order ${orderData.orderNumber}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
    }
  }
}

async function processShippedOrder(shipData) {
  // Similar logic to process shipped orders
  // This could update order status, record shipment, etc.
}
```

4. Deploy your function:
   ```
   firebase deploy --only functions
   ```

5. After deployment, Firebase will provide you with a URL for your function. It will look something like:
   ```
   https://us-central1-your-project-id.cloudfunctions.net/shipstationWebhook
   ```

## Step 2: Set Up ShipStation Webhook

1. Log in to your ShipStation account

2. Go to Account Settings > Integration > Webhooks

3. Click "Add Webhook"

4. Configure the webhook:
   - Name: Inventory Update
   - URL: (Your Firebase function URL from step 5 above)
   - Event: Select the events you want to trigger the webhook (e.g., "On Order Notify", "On Ship Notify")
   - Active: Yes

5. Click "Save"

## Testing the Webhook

1. In ShipStation, you can test the webhook by clicking the "Test" button next to your webhook configuration.

2. Check the Firebase Functions logs to see if the webhook was received and processed correctly:
   ```
   firebase functions:log
   ```

## Security Considerations

1. Add authentication to your webhook to ensure only ShipStation can call it:
   - You can use a secret key in the headers or query parameters
   - Verify the IP address of the request

2. Use environment variables for sensitive information:
   ```javascript
   // Set environment variables
   firebase functions:config:set shipstation.secret="your-secret-key"
   
   // Access in your function
   const secret = functions.config().shipstation.secret;
   ```

## Troubleshooting

1. Check Firebase Function logs for errors:
   ```
   firebase functions:log
   ```

2. Ensure your function has the necessary permissions to read/write to Firestore

3. Verify the webhook URL is correctly configured in ShipStation

4. Test with a simple webhook that just logs the request to ensure connectivity