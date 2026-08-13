type AdminProductFormProps = {
  title: string;
  price: string;
  image: string;
  barcode: string;
  category: string;
  categories: string[];
  categoryNames: Record<string, string>;
  editingProductId: number | null;
  isSaving: boolean;
  message: string;
  onTitleChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export function AdminProductForm({
  title,
  price,
  image,
  barcode,
  category,
  categories,
  categoryNames,
  editingProductId,
  isSaving,
  message,
  onTitleChange,
  onPriceChange,
  onImageChange,
  onBarcodeChange,
  onCategoryChange,
  onSubmit,
  onReset,
}: AdminProductFormProps) {
  return (
    <section className="admin-form-panel">
      <h2>{editingProductId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>

      <form onSubmit={onSubmit}>
        <label>
          Ürün Adı
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </label>

        <label>
          Fiyat
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => onPriceChange(event.target.value)}
          />
        </label>

        <label>
          Resim URL
          <input
            type="text"
            value={image}
            onChange={(event) => onImageChange(event.target.value)}
          />
        </label>

        <label>
          Barkod
          <input
            type="text"
            value={barcode}
            onChange={(event) => onBarcodeChange(event.target.value)}
          />
        </label>

        <label>
          Kategori
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">Kategori Seç</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {categoryNames[item] || item}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving
              ? "Kaydediliyor..."
              : editingProductId
                ? "Ürünü Güncelle"
                : "Ürün Ekle"}
          </button>

          {editingProductId && (
            <button type="button" className="secondary-button" onClick={onReset}>
              Vazgeç
            </button>
          )}
        </div>
      </form>

      {message && <p className="admin-message">{message}</p>}
    </section>
  );
}