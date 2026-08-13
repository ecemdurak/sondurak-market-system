"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { BarcodeForm } from "./components/product/BarcodeForm";
import { ProductGrid } from "./components/product/ProductGrid";
import { useTranslations } from "next-intl";

export default function Home() {
  const searchParams = useSearchParams();
  const { products, getProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const t = useTranslations("home");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    setSelectedCategory(categoryFromUrl || "");
  }, [searchParams]);

  const categoryNames: Record<string, string> = {
    electronics: t("categoryElectronics"),
    clothing: t("categoryClothing"),
    shoes: t("categoryShoes"),
    accessories: t("categoryAccessories"),
    snacks: t("categorySnacks"),
    drinks: t("categoryDrinks"),
  };

  const productSectionTitle = selectedCategory
    ? categoryNames[selectedCategory] || t("products")
    : t("products");

  const filteredProducts = selectedCategory
    ? products.filter((product: any) => product.category === selectedCategory)
    : products;

  function showCartMessage(message: string) {
    setCartMessage(message);

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  }

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
      showCartMessage(t("barcodeNotFound"));
      setBarcodeInput("");
      return;
    }

    addToCart(foundProduct);
    showCartMessage(`${foundProduct.title} ${t("addedToCart")}`);
    setBarcodeInput("");
  }

  function handleAddToCart(product: any) {
    addToCart(product);
    showCartMessage(`${product.title} ${t("addedToCart")}`);
  }

  return (
    <main>
      <BarcodeForm
        barcodeInput={barcodeInput}
        onBarcodeInputChange={setBarcodeInput}
        onSubmit={handleBarcodeSubmit}
      />

      <h2 id="products">{productSectionTitle}</h2>

      <ProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
      />

      {cartMessage && <div className="cart-toast">{cartMessage}</div>}
    </main>
  );
}
