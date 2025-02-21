import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  InventoryContext,
  InventoryItem,
  InventoryMovement,
} from "@/lib/inventory";

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsQuery = query(collection(db, "inventory"));
    const movementsQuery = query(collection(db, "movements"));

    const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setItems(itemsData);
    });

    const unsubMovements = onSnapshot(movementsQuery, (snapshot) => {
      const movementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryMovement[];
      setMovements(movementsData);
    });

    setLoading(false);
    return () => {
      unsubItems();
      unsubMovements();
    };
  }, []);

  const value = {
    items,
    movements,
    loading,
    addItem: async (item: Omit<InventoryItem, "id" | "lastUpdated">) => {
      await addDoc(collection(db, "inventory"), {
        ...item,
        lastUpdated: new Date().toISOString(),
      });
    },
    updateItem: async (id: string, item: Partial<InventoryItem>) => {
      await updateDoc(doc(db, "inventory", id), {
        ...item,
        lastUpdated: new Date().toISOString(),
      });
    },
    deleteItem: async (id: string) => {
      await deleteDoc(doc(db, "inventory", id));
    },
    addMovement: async (
      movement: Omit<InventoryMovement, "id" | "timestamp">,
    ) => {
      await addDoc(collection(db, "movements"), {
        ...movement,
        timestamp: new Date().toISOString(),
      });
    },
    updateMovement: async (
      id: string,
      movement: Partial<InventoryMovement>,
    ) => {
      await updateDoc(doc(db, "movements", id), movement);
    },
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
