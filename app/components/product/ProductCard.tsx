import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

type ProductCardProduct = {
    id: number;
    title: string;
    price: number | string;
    image?: string | null;
    category?: string | null;
    barcode?: string | null;
};

type ProductCardProps = {
    product: ProductCardProduct;
    onAddToCart: (product: ProductCardProduct) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const t = useTranslations("home");

    return (
        <article className="product-card">
            <div className="product-image-frame">
                {product.image ? (
                    <img src={product.image} alt={product.title} />
                ) : (
                    <Icon icon="solar:box-bold" width={48} height={48} />
                )}
            </div>

            <h2>{product.title}</h2>

            <div className="product-card-footer">
                <p className="product-price">{Number(product.price).toFixed(2)} TL</p>
                {product.barcode && <span className="product-barcode">#{product.barcode}</span>}
            </div>

            <div className="product-actions">
                <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                >
                    <Icon icon="solar:cart-plus-bold" width={20} height={20} />
                    {t("addToCart")}
                </button>
            </div>
        </article>
    );
}
