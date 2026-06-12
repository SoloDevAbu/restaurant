import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminMenuPage() {
  const menuItems = [
    { id: "M-101", name: "Hearth-Smoked Ribeye", category: "Mains", price: "$45.00", status: "Active", stock: 12 },
    { id: "M-102", name: "Traditional Margherita", category: "Mains", price: "$22.00", status: "Active", stock: "Unlimited" },
    { id: "S-201", name: "Wood-Fired Garlic Bread", category: "Starters", price: "$8.00", status: "Active", stock: "Unlimited" },
    { id: "S-202", name: "Heirloom Tomato Bruschetta", category: "Starters", price: "$12.00", status: "Low Stock", stock: 5 },
    { id: "D-301", name: "Chocolate Lava Cake", category: "Desserts", price: "$14.00", status: "Inactive", stock: 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="admin" />
      
      <main className="flex-1 pt-24 pb-12 max-w-7xl mx-auto w-full px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground mt-1">Manage categories, items, pricing, and availability.</p>
          </div>
          <Button className="gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New Item
          </Button>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
            <CardTitle className="text-xl">All Items</CardTitle>
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">search</span>
              <Input placeholder="Search items..." className="pl-10 bg-background" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === "Active" ? "default" : item.status === "Low Stock" ? "secondary" : "destructive"}
                        className={item.status === "Active" ? "bg-green-600/10 text-green-600 hover:bg-green-600/20 shadow-none" : item.status === "Low Stock" ? "bg-orange-500/10 text-orange-500 shadow-none hover:bg-orange-500/20" : ""}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
