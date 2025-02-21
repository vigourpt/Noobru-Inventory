import { createContext, useContext } from "react";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  location: string;
  minimumStock: number;
  lastUpdated: string;
}

export interface InventoryMovement {
  id: string;
  type: "receive" | "transfer" | "check" | "fulfillment" | "return";
  itemId: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  userId: string;
  notes?: string;
  timestamp: string;
  status: "completed" | "pending" | "cancelled";
}

export interface InventoryContextType {
  items: InventoryItem[];
  movements: InventoryMovement[];
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addMovement: (
    movement: Omit<InventoryMovement, "id" | "timestamp">,
  ) => Promise<void>;
  updateMovement: (
    id: string,
    movement: Partial<InventoryMovement>,
  ) => Promise<void>;
  loading: boolean;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
