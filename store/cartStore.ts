import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
    cart: any[];
    addToCart: (product: any) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: [],

            addToCart: (product) => {
                set((state) => {
                    const existingProduct = state.cart.find(
                        (item: any) => item.id === product.id
                    );

                    if (existingProduct) {
                        return {
                            cart: state.cart.map((item: any) =>
                                item.id === product.id
                                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        cart: [...state.cart, { ...product, quantity: 1 }],
                    };
                });
            },

            removeFromCart: (index) => {
                set((state) => ({
                    cart: state.cart
                        .map((item: any, i: number) =>
                            i === index
                                ? {
                                    ...item,
                                    quantity: (item.quantity || 1) - 1,
                                }
                                : item
                        )
                        .filter((item: any) => item.quantity > 0),
                }));
            },
            clearCart: () => {
                set({ cart: [] });
            },
        }),
        {
            name: "cart-storage", // unique name for the storage
        }
    )
);