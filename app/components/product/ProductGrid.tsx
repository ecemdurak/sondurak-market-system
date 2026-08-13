import { ProductCard } from "./ProductCard";

type ProductGridProduct = {
    id: number;
    title: string;
    price: number | string;
    image?: string | null;
};

type ProductGridProps = {
    products: ProductGridProduct[];
    onAddToCart: (product: ProductGridProduct) => void;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    return (
        <div className="products-container">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}