import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const inventoryItems = [
  {
    sku: "PHONE-IPHONE15-128",
    name: "iPhone 15 128GB",
    quantity: 50,
    location: "warehouse-a",
    minimumStock: 10,
    lastUpdated: new Date().toISOString(),
    category: "Phones",
    price: 999.99,
    supplier: "Apple"
  },
  {
    sku: "PHONE-IPHONE15-256",
    name: "iPhone 15 256GB",
    quantity: 30,
    location: "warehouse-a",
    minimumStock: 5,
    lastUpdated: new Date().toISOString(),
    category: "Phones",
    price: 1099.99,
    supplier: "Apple"
  },
  {
    sku: "PHONE-S23-256",
    name: "Samsung Galaxy S23 256GB",
    quantity: 45,
    location: "warehouse-b",
    minimumStock: 8,
    lastUpdated: new Date().toISOString(),
    category: "Phones",
    price: 899.99,
    supplier: "Samsung"
  },
  {
    sku: "LAPTOP-M2-512",
    name: "MacBook Air M2 512GB",
    quantity: 25,
    location: "warehouse-a",
    minimumStock: 5,
    lastUpdated: new Date().toISOString(),
    category: "Laptops",
    price: 1499.99,
    supplier: "Apple"
  },
  {
    sku: "TABLET-IPAD-256",
    name: "iPad Pro 12.9\" 256GB",
    quantity: 35,
    location: "warehouse-c",
    minimumStock: 7,
    lastUpdated: new Date().toISOString(),
    category: "Tablets",
    price: 1299.99,
    supplier: "Apple"
  }
  {
    sku: "PHONE-001",
    name: "iPhone 13 Pro",
    quantity: 50,
    location: "warehouse-a",
    minimumStock: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "PHONE-002",
    name: "Samsung Galaxy S21",
    quantity: 75,
    location: "warehouse-b",
    minimumStock: 15,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "LAPTOP-001",
    name: 'MacBook Pro 14"',
    quantity: 25,
    location: "warehouse-a",
    minimumStock: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "LAPTOP-002",
    name: "Dell XPS 15",
    quantity: 30,
    location: "warehouse-b",
    minimumStock: 8,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "TABLET-001",
    name: 'iPad Pro 12.9"',
    quantity: 40,
    location: "warehouse-a",
    minimumStock: 12,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "WATCH-001",
    name: "Apple Watch Series 7",
    quantity: 60,
    location: "warehouse-c",
    minimumStock: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "AUDIO-001",
    name: "AirPods Pro",
    quantity: 100,
    location: "warehouse-c",
    minimumStock: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "AUDIO-002",
    name: "Sony WH-1000XM4",
    quantity: 45,
    location: "warehouse-b",
    minimumStock: 15,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "ACC-001",
    name: "iPhone 13 Pro Case",
    quantity: 150,
    location: "warehouse-c",
    minimumStock: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    sku: "ACC-002",
    name: "USB-C Charging Cable",
    quantity: 200,
    location: "warehouse-a",
    minimumStock: 75,
    lastUpdated: new Date().toISOString(),
  },
];

const movements = [
  {
    type: "receive",
    itemId: "PHONE-001",
    quantity: 50,
    toLocation: "warehouse-a",
    userId: "system",
    notes: "Initial stock delivery",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    type: "transfer",
    itemId: "LAPTOP-001",
    quantity: 10,
    fromLocation: "warehouse-b",
    toLocation: "warehouse-a",
    userId: "system",
    notes: "Stock rebalancing",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    type: "receive",
    itemId: "AUDIO-001",
    quantity: 100,
    toLocation: "warehouse-c",
    userId: "system",
    notes: "New shipment arrival",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    type: "transfer",
    itemId: "TABLET-001",
    quantity: 15,
    fromLocation: "warehouse-a",
    toLocation: "warehouse-b",
    userId: "system",
    notes: "Warehouse optimization",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    type: "check",
    itemId: "ACC-001",
    quantity: 150,
    location: "warehouse-c",
    userId: "system",
    notes: "Monthly inventory check",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
];

async function seedData() {
  try {
    // Add inventory items
    for (const item of inventoryItems) {
      await addDoc(collection(db, "inventory"), item);
    }
    console.log("Added inventory items");

    // Add movements
    for (const movement of movements) {
      await addDoc(collection(db, "movements"), movement);
    }
    console.log("Added movements");

    console.log("Seed data added successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
