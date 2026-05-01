import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, getToken } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/items")({
  component: ProductsPage,
});

type Product = {
  _id: string;
  name: string;
  price: number;
};

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ LOAD PRODUCTS
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api<Product[]>("/api/products", { auth: true });
      setProducts(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/login" });
      return;
    }
    loadProducts();
  }, []);

  // ✅ OPEN CREATE
  const openCreate = () => {
    setEditing(null);
    setName("");
    setPrice("");
    setDialogOpen(true);
  };

  // ✅ OPEN EDIT
  const openEdit = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setPrice(String(product.price));
    setDialogOpen(true);
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price);
    if (!name.trim() || isNaN(priceNum)) {
      toast.error("Invalid input");
      return;
    }

    setSubmitting(true);

    try {
      const body = { name: name.trim(), price: priceNum };

      if (editing) {
        await api(`/api/products/${editing._id}`, {
          method: "PUT",
          body,
          auth: true,
        });
        toast.success("Product updated");
      } else {
        await api("/api/products", {
          method: "POST",
          body,
          auth: true,
        });
        toast.success("Product created");
      }

      setDialogOpen(false);
      loadProducts();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api(`/api/products/${deleteId}`, {
        method: "DELETE",
        auth: true,
      });

      toast.success("Product deleted");
      setDeleteId(null);
      loadProducts();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex gap-2">
          <Button onClick={loadProducts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr><td colSpan={4}>Loading...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={4}>No products</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p._id}</td>
                <td>
                  <Button onClick={() => openEdit(p)} size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => setDeleteId(p._id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Product" : "New Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}