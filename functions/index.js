const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.shipstationWebhook = functions.https.onRequest(async (req, res) => {
  // Verify the request is from ShipStation (you can add authentication here)

  try {
    // Get the webhook data
    const webhookData = req.body;
    const eventType = req.headers["x-shipstation-hook-event"] || "unknown";

    console.log(`Received webhook: ${eventType}`, webhookData);

    // Process based on event type
    switch (eventType) {
      case "ORDER_NOTIFY":
        // Handle new order
        await processNewOrder(webhookData);
        break;

      case "SHIP_NOTIFY":
        // Handle shipped order
        await processShippedOrder(webhookData);
        break;

      // Add other event types as needed

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    // Return success
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook");
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
    const inventoryRef = admin.firestore().collection("inventory");
    const snapshot = await inventoryRef.where("sku", "==", sku).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const currentQuantity = doc.data().quantity || 0;

      // Update the quantity (reserve the items)
      await doc.ref.update({
        quantity: currentQuantity - quantity,
        lastUpdated: new Date().toISOString(),
      });

      // Record the movement
      await admin
        .firestore()
        .collection("movements")
        .add({
          type: "order",
          itemId: sku,
          quantity: quantity,
          fromLocation: doc.data().location,
          userId: "webhook",
          notes: `Order ${orderData.orderNumber}`,
          timestamp: new Date().toISOString(),
          status: "completed",
        });
    }
  }
}

async function processShippedOrder(shipData) {
  // Similar logic to process shipped orders
  // This could update order status, record shipment, etc.
  const orderId = shipData.orderId || shipData.orderNumber;

  // Update order status in your database
  const ordersRef = admin.firestore().collection("orders");
  const orderSnapshot = await ordersRef.where("id", "==", orderId).get();

  if (!orderSnapshot.empty) {
    const orderDoc = orderSnapshot.docs[0];
    await orderDoc.ref.update({
      status: "shipped",
      shippedAt: new Date().toISOString(),
      trackingNumber: shipData.trackingNumber || "",
      carrier: shipData.carrier || "",
    });

    console.log(`Updated order ${orderId} to shipped status`);
  }
}

// Google Sheets sync function (scheduled to run daily)
exports.syncGoogleSheets = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    // This would contain the logic to sync data with Google Sheets
    // For now, we'll just log that it ran
    console.log("Running scheduled Google Sheets sync");
    return null;
  });

// Function to handle inventory updates and notify when stock is low
exports.checkLowStock = functions.firestore
  .document("inventory/{itemId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Check if quantity dropped below minimum stock level
    if (
      newValue.quantity <= newValue.minimumStock &&
      previousValue.quantity > previousValue.minimumStock
    ) {
      console.log(`Low stock alert for ${newValue.name} (${newValue.sku})`);

      // Here you would implement notification logic
      // For example, sending an email or push notification

      // For now, we'll just record it in a 'notifications' collection
      await admin.firestore().collection("notifications").add({
        type: "low_stock",
        itemId: context.params.itemId,
        sku: newValue.sku,
        name: newValue.name,
        currentQuantity: newValue.quantity,
        minimumStock: newValue.minimumStock,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  });
