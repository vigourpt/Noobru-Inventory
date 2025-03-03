import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useInventory } from "@/lib/inventory";
import { Plus, Trash } from "lucide-react";

const orderFormSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  status: z.string(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, "Item is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        price: z.coerce.number().min(0, "Price must be non-negative"),
      }),
    )
    .min(1, "At least one item is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

const OrderForm = ({
  open = true,
  onOpenChange = () => {},
  initialData = null,
  onSuccess,
}: OrderFormProps) => {
  const { items: inventoryItems } = useInventory();
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState(
    initialData?.items
      ? initialData.items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      : [{ itemId: "", quantity: 1, price: 0 }],
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: initialData?.customer || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      status: initialData?.status || "pending",
      notes: initialData?.notes || "",
      items: orderItems,
    },
  });

  const handleSubmit = async (data: OrderFormValues) => {
    try {
      // In a real app, this would save to the database
      console.log("Order data:", data);

      toast({
        title: initialData ? "Order Updated" : "Order Created",
        description: initialData
          ? `Order ${initialData.id} has been updated`
          : "New order has been created successfully",
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      });
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { itemId: "", quantity: 1, price: 0 }]);
    const currentItems = form.getValues().items || [];
    form.setValue("items", [
      ...currentItems,
      { itemId: "", quantity: 1, price: 0 },
    ]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length === 1) return; // Keep at least one item

    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
    form.setValue("items", newItems);
  };

  const handleItemChange = (index: number, itemId: string) => {
    const selectedItem = inventoryItems.find((item) => item.id === itemId);
    if (selectedItem) {
      const newItems = [...orderItems];
      newItems[index] = {
        ...newItems[index],
        itemId,
        price: selectedItem.price || 0,
      };
      setOrderItems(newItems);
      form.setValue(`items.${index}.price`, selectedItem.price || 0);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-background">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Edit Order ${initialData.id}` : "Create New Order"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter shipping address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrderItem}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>

              {orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.itemId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleItemChange(index, value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inventoryItems.map((invItem) => (
                                <SelectItem key={invItem.id} value={invItem.id}>
                                  {invItem.name} ({invItem.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const newItems = [...orderItems];
                                newItems[index] = {
                                  ...newItems[index],
                                  quantity: parseInt(e.target.value) || 1,
                                };
                                setOrderItems(newItems);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const newItems = [...orderItems];
                                newItems[index] = {
                                  ...newItems[index],
                                  price: parseFloat(e.target.value) || 0,
                                };
                                setOrderItems(newItems);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOrderItem(index)}
                      disabled={orderItems.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-medium">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Order" : "Create Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
