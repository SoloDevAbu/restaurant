"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/admin/useCategories";
import { Category } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", imageUrl: "" });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({ name: "", imageUrl: "", isActive: true, displayOrder: 0 });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { 
        name: createForm.name, 
        imageUrl: createForm.imageUrl || undefined,
        slug: createForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') // Basic slug generation
      }, 
      {
        onSuccess: () => {
          toast.success("Category created successfully");
          setIsCreateOpen(false);
          setCreateForm({ name: "", imageUrl: "" });
        },
        onError: () => toast.error("Failed to create category")
      }
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    updateCategory.mutate(
      { 
        id: editingCategory.id, 
        name: editForm.name,
        imageUrl: editForm.imageUrl || null,
        isActive: editForm.isActive,
        displayOrder: editForm.displayOrder
      },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
          setEditingCategory(null);
        },
        onError: () => toast.error("Failed to update category")
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id, {
        onSuccess: () => toast.success("Category deleted"),
        onError: () => toast.error("Failed to delete category")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Categories</h2>
          <p className="text-muted-foreground">Manage your menu categories.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Appetizers" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" type="url" value={createForm.imageUrl} onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <Button type="submit" disabled={createCategory.isPending} className="w-full">
                {createCategory.isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input id="edit-imageUrl" type="url" value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active</Label>
              <Switch id="edit-active" checked={editForm.isActive} onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input id="edit-displayOrder" type="number" value={editForm.displayOrder} onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 0 })} required />
            </div>
            <Button type="submit" disabled={updateCategory.isPending} className="w-full">
              {updateCategory.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.map((category: Category) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-video w-full bg-muted relative overflow-hidden flex items-center justify-center">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold text-muted-foreground opacity-50">
                      {category.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Display Order: {category.displayOrder}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingCategory(category);
                        setEditForm({ name: category.name, imageUrl: category.imageUrl || "", isActive: category.isActive, displayOrder: category.displayOrder });
                      }}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
          {data?.data?.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              No categories found. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

