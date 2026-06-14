"use client";

import { useState } from "react";
import { 
  useMenuItems, 
  useToggleMenuItemAvailability, 
  useDeleteMenuItem,
  useCreateMenuItem,
  useUpdateMenuItem
} from "@/hooks/admin/useMenuItems";
import { useCategories } from "@/hooks/admin/useCategories";
import { MenuItem, Category, DIET_TYPES, FEATURED_TAGS } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Edit, Trash2, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatTag = (str: string) => str.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function MenuItemsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [dietType, setDietType] = useState<string>("all");
  const [featuredTag, setFeaturedTag] = useState<string>("all");

  const filters = {
    page,
    limit: 12,
    ...(categoryId !== "all" && { categoryId: Number(categoryId) }),
    ...(dietType !== "all" && { dietType }),
    ...(featuredTag !== "all" && { featuredTag }),
  };

  const { data, isLoading } = useMenuItems(filters);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const toggleAvailability = useToggleMenuItemAvailability();
  const deleteMenuItem = useDeleteMenuItem();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
    isFeatured: false,
    featuredTag: "none",
    dietType: "none",
    displayOrder: 0
  });

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
    isFeatured: false,
    featuredTag: "none",
    dietType: "none",
    displayOrder: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.categoryId) {
      return toast.error("Please select a category");
    }
    
    createMenuItem.mutate({
      categoryId: Number(createForm.categoryId),
      name: createForm.name,
      description: createForm.description || undefined,
      price: createForm.price,
      imageUrl: createForm.imageUrl || undefined,
      isAvailable: createForm.isAvailable,
      isFeatured: createForm.isFeatured,
      featuredTag: (createForm.featuredTag !== "none" ? createForm.featuredTag : undefined) as any,
      dietType: (createForm.dietType !== "none" ? createForm.dietType : undefined) as any,
      displayOrder: createForm.displayOrder
    }, {
      onSuccess: () => {
        toast.success("Menu item created successfully");
        setIsCreateOpen(false);
        setCreateForm({
          categoryId: "", name: "", description: "", price: "", imageUrl: "",
          isAvailable: true, isFeatured: false, featuredTag: "none", dietType: "none", displayOrder: 0
        });
      },
      onError: () => toast.error("Failed to create menu item")
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    updateMenuItem.mutate({
      id: editingItem.id,
      categoryId: Number(editForm.categoryId),
      name: editForm.name,
      description: editForm.description || null,
      price: editForm.price,
      imageUrl: editForm.imageUrl || null,
      isAvailable: editForm.isAvailable,
      isFeatured: editForm.isFeatured,
      featuredTag: (editForm.featuredTag !== "none" ? editForm.featuredTag : null) as any,
      dietType: (editForm.dietType !== "none" ? editForm.dietType : null) as any,
      displayOrder: editForm.displayOrder
    }, {
      onSuccess: () => {
        toast.success("Menu item updated successfully");
        setEditingItem(null);
      },
      onError: () => toast.error("Failed to update menu item")
    });
  };

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

  const resetFilters = () => {
    setCategoryId("all");
    setDietType("all");
    setFeaturedTag("all");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Menu Items</h2>
          <p className="text-muted-foreground">Manage your menu offerings.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={createForm.price} onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={createForm.categoryId} onValueChange={(val) => setCreateForm({ ...createForm, categoryId: val })}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: Category) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input type="url" value={createForm.imageUrl} onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <Select value={createForm.dietType} onValueChange={(val) => setCreateForm({ ...createForm, dietType: val })}>
                    <SelectTrigger><SelectValue placeholder="Select Diet" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {DIET_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Featured Tag</Label>
                  <Select value={createForm.featuredTag} onValueChange={(val) => setCreateForm({ ...createForm, featuredTag: val })}>
                    <SelectTrigger><SelectValue placeholder="Select Tag" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {FEATURED_TAGS.map(t => (
                        <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={createForm.isAvailable} onCheckedChange={(val) => setCreateForm({ ...createForm, isAvailable: val })} />
                  <Label>Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={createForm.isFeatured} onCheckedChange={(val) => setCreateForm({ ...createForm, isFeatured: val })} />
                  <Label>Featured</Label>
                </div>
              </div>

              <Button type="submit" disabled={createMenuItem.isPending} className="w-full">
                {createMenuItem.isPending ? "Creating..." : "Create Menu Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editForm.categoryId} onValueChange={(val) => setEditForm({ ...editForm, categoryId: val })}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c: Category) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input type="url" value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Diet Type</Label>
                <Select value={editForm.dietType} onValueChange={(val) => setEditForm({ ...editForm, dietType: val })}>
                  <SelectTrigger><SelectValue placeholder="Select Diet" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {DIET_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Featured Tag</Label>
                <Select value={editForm.featuredTag} onValueChange={(val) => setEditForm({ ...editForm, featuredTag: val })}>
                  <SelectTrigger><SelectValue placeholder="Select Tag" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {FEATURED_TAGS.map(t => (
                      <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch checked={editForm.isAvailable} onCheckedChange={(val) => setEditForm({ ...editForm, isAvailable: val })} />
                <Label>Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={editForm.isFeatured} onCheckedChange={(val) => setEditForm({ ...editForm, isFeatured: val })} />
                <Label>Featured</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={editForm.displayOrder} onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 0 })} required />
            </div>

            <Button type="submit" disabled={updateMenuItem.isPending} className="w-full">
              {updateMenuItem.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-md border">
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: Category) => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dietType} onValueChange={(v) => { setDietType(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Diet Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diet Types</SelectItem>
            {DIET_TYPES.map(t => (
              <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={featuredTag} onValueChange={(v) => { setFeaturedTag(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Featured Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {FEATURED_TAGS.map(t => (
              <SelectItem key={t} value={t}>{formatTag(t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(categoryId !== "all" || dietType !== "all" || featuredTag !== "all") && (
          <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">
            <FilterX className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.map((item: MenuItem) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="aspect-square w-full bg-muted relative overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-5xl font-bold text-muted-foreground opacity-30">
                      {item.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {item.isFeatured && <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>}
                  {item.featuredTag && <Badge variant="secondary">{formatTag(item.featuredTag)}</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  {item.dietType === "veg" && <Badge className="bg-green-600 hover:bg-green-700">Veg</Badge>}
                  {item.dietType === "non_veg" && <Badge className="bg-red-600 hover:bg-red-700">Non-Veg</Badge>}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1" title={item.name}>{item.name}</h3>
                    <span className="font-bold text-primary">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2" title={item.description || ""}>
                    {item.description || "No description"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {item.categoryName || `Category #${item.categoryId}`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={item.isAvailable} 
                      onCheckedChange={() => handleToggle(item.id, item.isAvailable)}
                      disabled={toggleAvailability.isPending}
                    />
                    <span className="text-sm text-muted-foreground">{item.isAvailable ? "Available" : "Hidden"}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingItem(item);
                        setEditForm({
                          categoryId: item.categoryId.toString(),
                          name: item.name,
                          description: item.description || "",
                          price: item.price,
                          imageUrl: item.imageUrl || "",
                          isAvailable: item.isAvailable,
                          isFeatured: item.isFeatured,
                          featuredTag: item.featuredTag || "none",
                          dietType: item.dietType || "none",
                          displayOrder: item.displayOrder
                        });
                      }}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {data?.data?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl bg-card">
              <p className="text-lg font-medium">No menu items found.</p>
              <p className="text-sm">Try adjusting your filters or add a new item.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {data?.total > 0 && (
        <div className="flex justify-between items-center bg-card p-4 rounded-md border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((page - 1) * 12) + 1}</span> to <span className="font-medium">{Math.min(page * 12, data.total)}</span> of <span className="font-medium">{data.total}</span> items
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={page * 12 >= data.total}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
