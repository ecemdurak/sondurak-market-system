export type ProductEntity = {
    id: number;
    title: string;
    price: number;
    image: string | null;
    category: string | null;
    barcode: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};