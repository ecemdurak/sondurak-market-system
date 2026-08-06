"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";

export default function ScannerPage() {
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
                        setDebugStatus("Aynı barkod çok hızlı tekrar okundu, eklenmedi.");
                        return;
                    }

                    lastScanRef.current = {
                        barcode,
                        time: now,
                    };

                    const foundProduct = products.find(
                        (product: any) => product.barcode === barcode
                    );

                    if (!foundProduct) {
                        setMessage("Bu barkoda ait ürün bulunamadı.");
                        setDebugStatus("Barkod okundu ama ürünlerde eşleşme yok.");
                        return;
                    }

                    addToCart(foundProduct);
                    setMessage(`${foundProduct.title} sepete eklendi.`);
                    setDebugStatus("Ürün bulundu ve sepete eklendi.");
                    triggerFlash();
                }
            );
        }

        startScanner();

        return () => {
            controls?.stop();
        };
    }, [products, addToCart]);

    return (
        <main>
            {isFlashing && <div className="scanner-flash" />}
            <h1>Barkod Okut</h1>

            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "12px",
                    backgroundColor: "black",
                }}
            />

            {message && <p>{message}</p>}
            <div style={{ marginTop: "16px" }}>
                <p>Son okunan barkod: {debugBarcode || "-"}</p>
                <p>Durum: {debugStatus || "-"}</p>
            </div>
        </main>
    );
}