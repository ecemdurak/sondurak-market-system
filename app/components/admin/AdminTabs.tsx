type AdminTabsProps = {
    activeSection: "products" | "orders";
    onChangeSection: (section: "products" | "orders") => void;
};

export function AdminTabs({
    activeSection,
    onChangeSection,
}: AdminTabsProps) {
    return (
        <div className="admin-tabs">
            <button
                type="button"
                className={activeSection === "products" ? "active" : ""}
                onClick={() => onChangeSection("products")}
            >
                Ürünler
            </button>

            <button
                type="button"
                className={activeSection === "orders" ? "active" : ""}
                onClick={() => onChangeSection("orders")}
            >
                Siparişler
            </button>
        </div>
    );
}