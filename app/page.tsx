"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../store/productStore";
import { useCategoryStore } from "../store/categoryStore";
import { useCartStore } from "../store/cartStore";

export default function Home() {
  const { products, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const categoryNames: { [key: string]: string } = {
    electronics: "Elektronik",
    clothing: "Giyim",
    shoes: "Ayakkabı",
    accessories: "Aksesuar",
    snacks: "Atıştırmalık",
    drinks: "İçecek",
  };

  const filteredProducts = selectedCategory
    ? products.filter((product: any) => product.category === selectedCategory)
    : products;

  function handleBarcodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const scannedBarcode = barcodeInput.trim();

    if (!scannedBarcode) {
      return;
    }

    const foundProduct = products.find(
      (product: any) => product.barcode === scannedBarcode
    );

    if (!foundProduct) {
      setCartMessage("Bu barkoda ait ürün bulunamadı.");
      setBarcodeInput("");

      setTimeout(() => {
        setCartMessage("");
      }, 2000);

      return;
    }

    addToCart(foundProduct);
    setCartMessage(`${foundProduct.title} sepete eklendi.`);
    setBarcodeInput("");

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  }

  return (
    <main>
      <form id="barcode" onSubmit={handleBarcodeSubmit} className="barcode-form">
        <input
          type="text"
          placeholder="Barkod yaz"
          value={barcodeInput}
          onChange={(event) => setBarcodeInput(event.target.value)}
        />

        <button type="submit">Barkodla Sepete Ekle</button>
      </form>


      <h2 id="categories">Kategoriler</h2>

      <div className="category-list">
        <button onClick={() => setSelectedCategory("")}>Tümü</button>

        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}>
            {categoryNames[category] || category}
          </button>
        ))}
      </div>

      <h2 id="products">Ürünler</h2>

      <div className="products-container">
        {filteredProducts.map((product: any) => (
          <div className="product-card" key={product.id}>
            {product.image && <img src={product.image} alt={product.title} />}

            <h2>{product.title} {product.id}</h2>

            <p>Fiyat: {Number(product.price).toFixed(2)} TL</p>

            <div className="product-actions">
              <button
                type="button"
                onClick={() => {
                  addToCart(product);
                  setCartMessage(`${product.title} sepete eklendi.`);

                  setTimeout(() => {
                    setCartMessage("");
                  }, 2000);
                }}
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>

      {cartMessage && <div className="cart-toast">{cartMessage}</div>}
    </main>
  );
}
