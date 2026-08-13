import { useTranslations } from "next-intl";

type CategoryFilterProps = {
    categories: string[];
    selectedCategory: string;
    categoryNames: Record<string, string>;
    onSelectCategory: (category: string) => void;
};

export function CategoryFilter({
    categories,
    selectedCategory,
    categoryNames,
    onSelectCategory,
}: CategoryFilterProps) {
    const t = useTranslations("home");

    return (
        <>
            <h2 id="categories">{t("categories")}</h2>

            <div className="category-list">
                <button
                    type="button"
                    className={selectedCategory === "" ? "active" : ""}
                    onClick={() => onSelectCategory("")}
                >
                    {t("all")}
                </button>

                {categories.map((category) => (
                    <button
                        type="button"
                        key={category}
                        className={selectedCategory === category ? "active" : ""}
                        onClick={() => onSelectCategory(category)}
                    >
                        {categoryNames[category] || category}
                    </button>
                ))}
            </div>
        </>
    );
}
