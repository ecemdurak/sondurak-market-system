import { create } from "zustand";

type CategoryStore = {
    categories: string[];
    getCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],

    getCategories: async () => {
        set({
            categories: [
                "electronics",
                "clothing",
                "shoes",
                "accessories",
                "snacks",
                "drinks",
            ],
        });
    },
}));