import type { Product } from "../../types/product";

type AdminProductListProps = {
    products: Product[];
    categoryNames: Record<string, string>;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
};

export function AdminProductList({
    products,
    categoryNames,
    onEditProduct,
    onDeleteProduct,
}: AdminProductListProps) {
    return (
        <section className="admin-products-panel">
            <div className="admin-section-header">
                <h2>Ürünler</h2>
                <span>{products.length} ürün</span>
            </div>

            <div className="admin-products-list">
                {products.map((product) => (
                    <article className="admin-product-row" key={product.id}>
                        <div className="admin-product-info">
                            {product.image && <img src={product.image} alt={product.title} />}

                            <div>
                                <h3>{product.title}</h3>
                                <p>
                                    {product.category
                                        ? categoryNames[product.category] || product.category
                                        : "Kategori yok"}
                                </p>
                                <strong>{Number(product.price).toFixed(2)} TL</strong>
                            </div>
                        </div>

                        <div className="admin-product-actions">
                            <button
                                type="button"
                                className="edit-button"
                                onClick={() => onEditProduct(product)}
                            >
                                Düzenle
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => {
                                    const isConfirmed = window.confirm(
                                        "Bu ürünü silmek istediğine emin misin?"
                                    );

                                    if (isConfirmed) {
                                        onDeleteProduct(product.id);
                                    }
                                }}
                            >
                                Sil
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}