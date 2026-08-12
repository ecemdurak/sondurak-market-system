//Dışarıdan gelen ürün verisinin tipini tutacak.

//ürün oluştururken gelen veri
export type CreateProductDto = {
    title: string;
    price: number;
    image?: string | null;
    category?: string | null;
    barcode?: string | null;
    description?: string | null;
};

//ürün güncellenirken gelen veri
export type UpdateProductDto = {
    title: string;
    price: number;
    image?: string | null;
    category?: string | null;
    barcode?: string | null;
    description?: string | null;
};