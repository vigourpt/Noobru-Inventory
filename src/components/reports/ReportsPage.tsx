import React from "react";
import { useInventory } from "@/lib/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, AlertTriangle, Truck } from "lucide-react";

const ReportsPage = () => {
  const { items, movements, loading } = useInventory();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Calculate statistics
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.minimumStock,
  ).length;
  const totalMovements = movements.length;
  const completedMovements = movements.filter(
    (m) => m.status === "completed",
  ).length;

  // Group movements by type
  const movementsByType = movements.reduce(
    (acc, movement) => {
      acc[movement.type] = (acc[movement.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Group items by location
  const stockByLocation = items.reduce(
    (acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + item.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View inventory analytics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Stock
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {totalStock.toLocaleString()}
              </h3>
            </div>
            <div className="text-blue-600 bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </p>
              <h3 className="text-2xl font-bold mt-2">{lowStockItems}</h3>
            </div>
            <div className="text-red-600 bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Movements
              </p>
              <h3 className="text-2xl font-bold mt-2">{totalMovements}</h3>
            </div>
            <div className="text-green-600 bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {((completedMovements / totalMovements) * 100).toFixed(1)}%
              </h3>
            </div>
            <div className="text-orange-600 bg-orange-100 p-3 rounded-full">
              <Truck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movements">Movement Analysis</TabsTrigger>
          <TabsTrigger value="stock">Stock Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movements by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(movementsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(count / totalMovements) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((count / totalMovements) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stockByLocation).map(([location, quantity]) => (
                  <div
                    key={location}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{location}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(quantity / totalStock) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((quantity / totalStock) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
