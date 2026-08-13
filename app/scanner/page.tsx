"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useTranslations } from "next-intl";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { ScannerVideo } from "../components/scanner/ScannerVideo";
import { ScannerDebugPanel } from "../components/scanner/ScannerDebugPanel";
import type { Product } from "../types/product";


export default function ScannerPage() {
    const t = useTranslations("scanner");
    const videoRef = useRef<HTMLVideoElement>(null);

    const { products, getProducts } = useProductStore();
    const { addToCart } = useCartStore();

    const [message, setMessage] = useState("");
    const [isFlashing, setIsFlashing] = useState(false);
    //son okunan barkod zaman
    const lastScanRef = useRef({
        barcode: "",
        time: 0,
    });
    const [debugBarcode, setDebugBarcode] = useState("");
    const [debugStatus, setDebugStatus] = useState("");

    function triggerFlash() {
        setIsFlashing(true);

        setTimeout(() => {
            setIsFlashing(false);
        }, 300);
    }


    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        if (!videoRef.current) return;

        const codeReader = new BrowserMultiFormatReader();
        let controls: { stop: () => void } | undefined;

        async function startScanner() {
            controls = await codeReader.decodeFromVideoDevice(
                undefined,
                videoRef.current!,
                //kamera barkod gördükçe bu fonksiyon çalışır

                (result) => {
                    if (!result) return;

                    const barcode = result.getText();
                    setDebugBarcode(barcode);

                    const now = Date.now();

                    if (
                        barcode === lastScanRef.current.barcode &&
                        now - lastScanRef.current.time < 2000
                    ) {
                        setDebugStatus(t("duplicateScan"));
                        return;
                    }

                    lastScanRef.current = {
                        barcode,
                        time: now,
                    };

                    const foundProduct = products.find(
                        (product: Product) => product.barcode === barcode
                    );

                    if (!foundProduct) {
                        setMessage(t("barcodeNotFound"));
                        setDebugStatus(t("notMatched"));
                        return;
                    }

                    addToCart(foundProduct);
                    setMessage(`${foundProduct.title} ${t("addedToCart")}`);
                    setDebugStatus(t("productAdded"));
                    triggerFlash();
                }
            );
        }

        startScanner();

        return () => {
            controls?.stop();
        };
    }, [products, addToCart, t]);

    return (
        <main>
            {isFlashing && <div className="scanner-flash" />}
            <h1>{t("title")}</h1>

            <ScannerVideo videoRef={videoRef} />

            {message && <p>{message}</p>}
            <ScannerDebugPanel
                lastBarcodeLabel={t("lastBarcode")}
                statusLabel={t("status")}
                barcode={debugBarcode}
                status={debugStatus}
            />
        </main>
    );
}
