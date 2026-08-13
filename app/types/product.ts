export type Product = {
  id: number;
  title: string;
  price: number | string;
  image?: string | null;
  category?: string | null;
  barcode?: string | null;
  description?: string | null;
};

export type CartItem = Product & {
  quantity?: number;
};
