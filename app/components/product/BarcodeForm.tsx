import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

type BarcodeFormProps = {
    barcodeInput: string;
    onBarcodeInputChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function BarcodeForm({
    barcodeInput,
    onBarcodeInputChange,
    onSubmit,
}: BarcodeFormProps) {
    const t = useTranslations("home");

    return (
        <form id="barcode" onSubmit={onSubmit} className="barcode-form">
            <input
                type="text"
                placeholder={t("barcodePlaceholder")}
                value={barcodeInput}
                onChange={(event) => onBarcodeInputChange(event.target.value)}
            />

            <button type="submit">
                <Icon icon="solar:barcode-bold" width={20} height={20} />
                {t("barcodeButton")}
            </button>
        </form>
    );
}
