"use client";

import { useMenuItems, useToggleMenuItemAvailability, useDeleteMenuItem } from "@/hooks/admin/useMenuItems";
import { MenuItem } from "@repo/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function MenuItemsPage() {
  const { data, isLoading } = useMenuItems();
  const toggleAvailability = useToggleMenuItemAvailability();
  const deleteMenuItem = useDeleteMenuItem();

  const handleToggle = (id: number, current: boolean) => {
    toggleAvailability.mutate({ id, isAvailable: !current }, {
      onSuccess: () => toast.success("Availability updated"),
      onError: () => toast.error("Failed to update availability")
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMenuItem.mutate(id, {
        onSuccess: () => toast.success("Item deleted"),
        onError: () => toast.error("Failed to delete item")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Menu Items</h2>
          <p className="text-muted-foreground">Manage your menu offerings.</p>
        </div>
        <Button onClick={() => toast.info("Add dialog not fully implemented in demo")}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category ID</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : data?.data?.map((item: MenuItem) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                  {item.isFeatured && <Badge variant="secondary" className="ml-2">Featured</Badge>}
                </TableCell>
                <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                <TableCell>{item.categoryId}</TableCell>
                <TableCell>
                  <Switch 
                    checked={item.isAvailable} 
                    onCheckedChange={() => handleToggle(item.id, item.isAvailable)}
                    disabled={toggleAvailability.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {data?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
