import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Package, TruckIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import OrderForm from "./OrderForm";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-05-15",
    status: "pending",
    total: 299.99,
    items: [
      {
        id: "1",
        sku: "PHONE-001",
        name: "iPhone 13 Pro",
        quantity: 1,
        price: 299.99,
      },
    ],
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-05-14",
    status: "processing",
    total: 1599.98,
    items: [
      {
        id: "2",
        sku: "LAPTOP-001",
        name: 'MacBook Pro 14"',
        quantity: 1,
        price: 1599.98,
      },
    ],
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    date: "2023-05-13",
    status: "shipped",
    total: 399.97,
    items: [
      {
        id: "3",
        sku: "TABLET-001",
        name: 'iPad Pro 12.9"',
        quantity: 1,
        price: 399.97,
      },
    ],
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    date: "2023-05-12",
    status: "delivered",
    total: 159.96,
    items: [
      {
        id: "4",
        sku: "AUDIO-001",
        name: "AirPods Pro",
        quantity: 1,
        price: 159.96,
      },
    ],
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    date: "2023-05-11",
    status: "returned",
    total: 89.95,
    items: [
      {
        id: "5",
        sku: "ACC-001",
        name: "iPhone 13 Pro Case",
        quantity: 1,
        price: 89.95,
      },
    ],
  },
];

// Mock data for returns
const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-005",
    customer: "Charlie Wilson",
    date: "2023-05-16",
    status: "pending",
    reason: "Wrong size",
    items: [
      {
        id: "5",
        sku: "ACC-001",
        name: "iPhone 13 Pro Case",
        quantity: 1,
        price: 89.95,
      },
    ],
  },
  {
    id: "RET-002",
    orderId: "ORD-004",
    customer: "Alice Brown",
    date: "2023-05-15",
    status: "approved",
    reason: "Defective product",
    items: [
      {
        id: "4",
        sku: "AUDIO-001",
        name: "AirPods Pro",
        quantity: 1,
        price: 159.96,
      },
    ],
  },
];

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState(mockOrders);
  const [returns, setReturns] = useState(mockReturns);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredReturns = returns.filter(
    (ret) =>
      ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setFormOpen(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: "secondary", label: "Pending" },
      processing: { variant: "default", label: "Processing" },
      shipped: { variant: "primary", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" },
      returned: { variant: "destructive", label: "Returned" },
      approved: { variant: "success", label: "Approved" },
    };

    const statusInfo = statusMap[status] || {
      variant: "secondary",
      label: status,
    };

    return (
      <Badge variant={statusInfo.variant} className="capitalize">
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Create, process, and manage customer orders
          </p>
        </div>
        <Button onClick={handleCreateOrder}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Orders</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            View
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(order.id, "processing")
                              }
                            >
                              <Package className="h-4 w-4 mr-1" /> Process
                            </Button>
                          )}
                          {order.status === "processing" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(order.id, "shipped")
                              }
                            >
                              <TruckIcon className="h-4 w-4 mr-1" /> Ship
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(order.id, "returned")
                              }
                            >
                              <RefreshCw className="h-4 w-4 mr-1" /> Return
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Returns</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search returns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell>{ret.id}</TableCell>
                      <TableCell>{ret.orderId}</TableCell>
                      <TableCell>{ret.customer}</TableCell>
                      <TableCell>{ret.date}</TableCell>
                      <TableCell>{getStatusBadge(ret.status)}</TableCell>
                      <TableCell>{ret.reason}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          {ret.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReturns(
                                  returns.map((r) =>
                                    r.id === ret.id
                                      ? { ...r, status: "approved" }
                                      : r,
                                  ),
                                );
                                toast({
                                  title: "Return Approved",
                                  description: `Return ${ret.id} has been approved`,
                                });
                              }}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {formOpen && (
        <OrderForm
          open={formOpen}
          onOpenChange={setFormOpen}
          initialData={selectedOrder}
          onSuccess={() => {
            toast({
              title: selectedOrder ? "Order Updated" : "Order Created",
              description: selectedOrder
                ? `Order ${selectedOrder.id} has been updated`
                : "New order has been created",
            });
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
