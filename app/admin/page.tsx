"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "../../store/categoryStore";
import { useProductStore } from "../../store/productStore";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminTabs } from "../components/admin/AdminTabs";
import { AdminProductForm } from "../components/admin/AdminProductForm";
import { AdminProductList } from "../components/admin/AdminProductList";
import { AdminOrderList } from "../components/admin/AdminOrderList";
import type { Product } from "../types/product";
import type { Order } from "../types/order";


export default function AdminPage() {
  const { products, getProducts, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState<"products" | "orders">("products");

  async function getOrders() {
    const response = await fetch("/api/orders");

    if (!response.ok) {
      setMessage("Siparişler getirilemedi.");
      return;
    }

    const data: Order[] = await response.json();
    setOrders(data);
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getOrders();
  }, [getProducts, getCategories]);


  const categoryNames: { [key: string]: string } = {
    electronics: "Elektronik",
    clothing: "Giyim",
    shoes: "Ayakkabı",
    accessories: "Aksesuar",
    snacks: "Atıştırmalık",
    drinks: "İçecek",
  };


  function resetForm() {
    setTitle("");
    setPrice("");
    setImage("");
    setCategory("");
    setBarcode("");
    setEditingProductId(null);
    //düzenleme modundan çık
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //yenilemeyi engelle
    event.preventDefault();

    if (!title || !price || !category) {
      setMessage("Ürün adı, fiyat ve kategori zorunludur.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const productData = {
        title,
        price: Number(price),
        image,
        category,
        barcode,
      };

      //editingProductId varsa güncelle, yoksa ekle
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        setMessage("Ürün güncellendi.");
      } else {
        await addProduct(productData);
        setMessage("Ürün eklendi.");
      }

      async function getOrders() {
        const response = await fetch("/api/orders");

        if (!response.ok) {
          setMessage("Siparişler getirilemedi.");
          return;
        }

        const data: Order[] = await response.json();
        setOrders(data);
      }

      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "İşlem sırasında hata oluştu.";

      setMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setMessage("");

    try {
      await deleteProduct(id);
      setMessage("Ürün silindi.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ürün silinemedi.";

      setMessage(errorMessage);
    }
  }
  function handleEditProduct(product: Product) {
    setEditingProductId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
    setImage(product.image || "");
    setCategory(product.category || "");
    setBarcode(product.barcode || "");
    setMessage("");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
  }

  return (
    <main className="admin-page">
      <AdminHeader onLogout={handleLogout} />

      <AdminTabs
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />
      <div className="admin-content">
        {activeSection === "products" && (
          <>
            <AdminProductForm
              title={title}
              price={price}
              image={image}
              barcode={barcode}
              category={category}
              categories={categories}
              categoryNames={categoryNames}
              editingProductId={editingProductId}
              isSaving={isSaving}
              message={message}
              onTitleChange={setTitle}
              onPriceChange={setPrice}
              onImageChange={setImage}
              onBarcodeChange={setBarcode}
              onCategoryChange={setCategory}
              onSubmit={handleSubmit}
              onReset={resetForm}
            />

            <AdminProductList
              products={products}
              categoryNames={categoryNames}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDelete}
            />
          </>
        )}
        {activeSection === "orders" && (
          <AdminOrderList orders={orders} />
        )}
      </div>
    </main>
  );
}
