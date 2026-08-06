"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCategoryStore } from "../../store/categoryStore";
import { useProductStore } from "../../store/productStore";


type Product = {
  id: number;
  title: string;
  price: number | string;
  image?: string | null;
  category?: string | null;
  barcode?: string;
};

type OrderItem = {
  id: number;
  productTitle: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
};

type Order = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  totalPrice: number | string;
  currency: string;
  paymentStatus: string;
  createdAt: string;
  items?: OrderItem[];
};

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

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <p>Yönetim</p>
          <h1>Admin Paneli</h1>
        </div>
        <div className="admin-header-actions">
          <Link href="/">Mağazaya dön</Link>

          <button type="button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={activeSection === "products" ? "active" : ""}
          onClick={() => setActiveSection("products")}
        >
          Ürünler
        </button>

        <button
          type="button"
          className={activeSection === "orders" ? "active" : ""}
          onClick={() => setActiveSection("orders")}
        >
          Siparişler
        </button>
      </div>
      <div className="admin-content">
        {activeSection === "products" && (
          <>
            <section className="admin-form-panel">
              <h2>{editingProductId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>

              <form onSubmit={handleSubmit}>
                <label>
                  Ürün Adı
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </label>

                <label>
                  Fiyat
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </label>

                <label>
                  Resim URL
                  <input
                    type="text"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                  />
                </label>

                <label>
                  Barkod
                  <input
                    type="text"
                    value={barcode}
                    onChange={(event) => setBarcode(event.target.value)}
                  />
                </label>

                <label>
                  Kategori
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Kategori Seç </option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {categoryNames[item] || item}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="admin-form-actions">
                  <button type="submit" disabled={isSaving}>
                    {isSaving
                      ? "Kaydediliyor..."
                      : editingProductId
                        ? "Ürünü Güncelle"
                        : "Ürün Ekle"}
                  </button>

                  {editingProductId && (
                    <button type="button" className="secondary-button" onClick={resetForm}>
                      Vazgec
                    </button>
                  )}
                </div>
              </form>

              {message && <p className="admin-message">{message}</p>}
            </section>

            <section className="admin-products-panel">
              <div className="admin-section-header">
                <h2>Ürünler</h2>
                <span>{products.length} ürün</span>
              </div>

              <div className="admin-products-list">
                {products.map((product: Product) => (
                  <article className="admin-product-row" key={product.id}>
                    <div className="admin-product-info">
                      {product.image && <img src={product.image} alt={product.title} />}

                      <div>
                        <h3>{product.title}</h3>
                        <p>
                          {product.category
                            ? categoryNames[product.category] || product.category
                            : "Kategori yok"}
                        </p>
                        <strong>{Number(product.price).toFixed(2)} TL</strong>
                      </div>
                    </div>

                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => {
                          setEditingProductId(product.id);
                          setTitle(product.title);
                          setPrice(String(product.price));
                          setImage(product.image || "");
                          setCategory(product.category || "");
                          setBarcode(product.barcode || "");
                          setMessage("");
                        }}
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "Bu ürünü silmek istediğine emin misin?"
                          );

                          if (isConfirmed) {
                            handleDelete(product.id);
                          }
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
        {activeSection === "orders" && (
          <section className="admin-orders-panel">
            <div className="admin-section-header">
              <h2>Siparişler</h2>
              <span>{orders.length} sipariş</span>
            </div>

            <div className="admin-orders-list">
              {orders.length === 0 ? (
                <p>Henüz sipariş yok.</p>
              ) : (
                orders.map((order) => (
                  <article className="admin-order-row" key={order.id}>
                    <div>
                      <h3>#{order.id} - {order.firstName} {order.lastName}</h3>
                      <p>{order.email}</p>
                      <p>
                        Toplam: {Number(order.totalPrice).toFixed(2)} {order.currency}
                      </p>
                      <p>Durum: {order.paymentStatus}</p>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="admin-order-items">
                        {order.items.map((item) => (
                          <p key={item.id}>
                            {item.productTitle} x{item.quantity} -{" "}
                            {Number(item.totalPrice).toFixed(2)} {order.currency}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
