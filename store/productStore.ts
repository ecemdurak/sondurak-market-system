import { create } from "zustand";

type ProductStore = {
    products: any[];
    getProducts: () => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    updateProduct: (id: number, product: any) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
    products: [],

    getProducts: async () => {
        const response = await fetch("/api/products");

        const data = await response.json();

        set({ products: data });
    },
    addProduct: async (product) => {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            throw new Error("Product could not be created.");
        }

        const data = await response.json();

        set((state) => ({
            products: [data, ...state.products],
        }));

    },
    updateProduct: async (id, product) => {
        const response = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error("Product could not be updated.");
        }

        const data = await response.json();

        set((state) => ({
            products: state.products.map((item) =>
                item.id === id ? data : item
            ),
        }));
    },

    deleteProduct: async (id) => {
        const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Product could not be deleted.");
        }

        set((state) => ({
            products: state.products.filter((product) => product.id !== id),
        }));
    },
}));