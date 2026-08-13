type ScannerDebugPanelProps = {
    lastBarcodeLabel: string;
    statusLabel: string;
    barcode: string;
    status: string;
};

export function ScannerDebugPanel({
    lastBarcodeLabel,
    statusLabel,
    barcode,
    status,
}: ScannerDebugPanelProps) {
    return (
        <div style={{ marginTop: "16px" }}>
            <p>
                {lastBarcodeLabel}: {barcode || "-"}
            </p>
            <p>
                {statusLabel}: {status || "-"}
            </p>
        </div>
    );
}