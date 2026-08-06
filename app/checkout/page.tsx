"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";

//payment api cevabı tipleri
type PayThorResponse = {
    status?: "success" | "error";
    message?: string;
    data?: {
        payment_link?: string;
        payment_token?: string;
    };
};

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCartStore();

    //setForm güncelleme
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
    });

    const [paymentLink, setPaymentLink] = useState("");
    const [paymentToken, setPaymentToken] = useState("");

    //database sipariş ıd null daha oluşturulmadı -hata
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //teşekküre bağlama
    useEffect(() => {
        async function handlePaymentMessage(event: MessageEvent) {
            if (!createdOrderId) return;
            //güvenlik kontrolü
            if (event.origin !== "https://pay.paythor.com") return;

            const data = event.data;

            if (
                data?.type === "opensource" &&
                data?.tdsForm &&
                data?.form_selector_id === "three_d_form"
            ) {
                //geçici form oluşturma ve submit etme
                const temp = document.createElement("div");
                temp.innerHTML = data.tdsForm;

                const form = temp.querySelector("form");

                //güvenlik
                if (form) {
                    document.body.appendChild(form);
                    form.submit();
                }

                return;
            }

            //paythor iframeden gelen postmessage 
            if (data?.isSuccess === true) {
                //console.log(data?.processID);

                if (!paymentToken) {
                    setMessage("Ödeme token bulunamadı, ödeme durumu sorgulanamadı.");
                    return;
                }
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow" as RequestRedirect,
                };

                const tokenResponse = await fetch(
                    `https://api.paythor.com/payment/getbytoken/${paymentToken}`,
                    requestOptions
                );
                const tokenResultText = await tokenResponse.text();

                //console.log("getByToken sonucu:", tokenResultText);

                const tokenResult = JSON.parse(tokenResultText);

                const isPaymentPaid =
                    tokenResult?.data?.transaction?.status === "completed" &&
                    Number(tokenResult?.data?.transaction?.captured) > 0;


                if (!isPaymentPaid) {
                    setMessage("Ödeme PayThor üzerinden doğrulanamadı.");
                    return;
                }

                //ödeme güncelle kendi database'im
                await fetch(`/api/orders/${createdOrderId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentStatus: "paid",
                    }),
                });

                clearCart();
                router.push(`/thank-you/${createdOrderId}`);
            }
        }

        window.addEventListener("message", handlePaymentMessage);

        return () => {
            window.removeEventListener("message", handlePaymentMessage);
        };
        //değişirse yenile
    }, [createdOrderId, paymentToken, clearCart, router]);

    const totalPrice = cart.reduce(
        (total, item: any) =>
            total + Number(item.price) * (item.quantity || 1),
        0
    );

    //ödemeyi başlat
    async function createPayment() {
        if (cart.length === 0) {
            setMessage("Ödeme oluşturmak için sepette ürün bulunmalıdır.");
            return;
        }

        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.phone ||
            !form.address ||
            !form.city ||
            !form.district ||
            !form.postalCode
        ) {
            setMessage("Lütfen tüm ödeyen ve adres bilgilerini doldurun.");
            return;
        }
        setIsLoading(true);
        setMessage("");

        try {
            const merchantReference = `ORDER-${Date.now()}`;

            //database kaydetme
            const orderBody = {
                merchantReference,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                district: form.district,
                postalCode: form.postalCode,
                totalPrice: totalPrice.toFixed(2),
                currency: "TRY",
                paymentStatus: "pending",
                //sepet->sipariş ????
                items: cart.map((item: any) => ({
                    productId: null,
                    productTitle: item.title,
                    unitPrice: Number(item.price).toFixed(2),
                    quantity: item.quantity || 1,
                    totalPrice: (Number(item.price) * (item.quantity || 1)).toFixed(2),
                })),
            };

            //siparişi kaydetme
            const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderBody),
            });

            if (!orderResponse.ok) {
                //400 500 catch->
                throw new Error("Sipariş database'e kaydedilemedi.");
            }
            const createdOrder = await orderResponse.json();
            setCreatedOrderId(createdOrder.id);

            const paymentBody = {
                payment: {
                    amount: totalPrice.toFixed(2),
                    currency: "TRY",
                    buyer_fee: "0",
                    method: "creditcard",
                    merchant_reference: merchantReference,
                },

                payer: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                    email: form.email,
                    phone: form.phone,
                    address: {
                        line_1: form.address,
                        city: form.city,
                        state: form.district,
                        postal_code: form.postalCode,
                        country: "TR",
                    },
                    ip: "127.0.0.1",
                },

                order: {
                    cart: cart.map((item: any, index: number) => ({
                        id: String(item.id ?? `PRODUCT-${index + 1}`),
                        name: item.title,
                        type: "product",
                        price: Number(item.price).toFixed(2),
                        quantity: item.quantity || 1,
                    })),

                    shipping: {
                        first_name: form.firstName,
                        last_name: form.lastName,
                        phone: form.phone,
                        email: form.email,
                        address: {
                            line_1: form.address,
                            city: form.city,
                            state: form.district,
                            postal_code: form.postalCode,
                            country: "TR",
                        },
                    },

                    invoice: {
                        id: merchantReference,
                        first_name: form.firstName,
                        last_name: form.lastName,
                        price: totalPrice.toFixed(2),
                        quantity: 1,
                    },
                },
            };

            //ödemelinki<-
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentBody),
            });

            const data: PayThorResponse = await response.json();

            if (!response.ok || data.status !== "success") {
                throw new Error(
                    data.message || `Ödeme oluşturulamadı. Status: ${response.status}`
                );
            }

            const link = data.data?.payment_link;

            const token = data.data?.payment_token;

            if (!link) {
                throw new Error("PayThor cevabında payment_link bulunamadı.");
            }
            if (!token) {
                throw new Error("PayThor cevabında payment_token bulunamadı.");
            }
            //token ve linki siparişe kaydetme
            await fetch(`/api/orders/${createdOrder.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentStatus: "active",
                    paymentLink: link,
                    paymentToken: token,
                }),
            });


            setPaymentLink(link);
            setPaymentToken(token);

            //throw new error
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";

            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="checkout-page">
            <div className="checkout-header">
                <h1>Ödeme</h1>
                <Link href="/">Ana Sayfaya Dön</Link>
            </div>

            <div className="checkout-content">
                <section className="checkout-form">
                    <h2>Ödeyen Bilgileri</h2>

                    <input
                        type="text"
                        placeholder="Ad"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Soyad"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />

                    <input
                        type="email"
                        placeholder="E-posta"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <input
                        type="tel"
                        placeholder="Telefon"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />

                    <textarea
                        placeholder="Açık Adres"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Şehir"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="İlçe"
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Posta Kodu"
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    />
                </section>

                <section className="checkout-summary">
                    <h2>Sipariş Özeti</h2>

                    {cart.length === 0 ? (
                        <p>Sepetiniz boş.</p>
                    ) : (
                        cart.map((item: any, index: number) => (
                            <div className="checkout-item" key={`${item.id}-${index}`}>
                                <span>
                                    {item.title} x{item.quantity || 1}
                                </span>

                                <strong>
                                    {(Number(item.price) * (item.quantity || 1)).toFixed(2)} ₺
                                </strong>
                            </div>
                        ))
                    )}

                    <h3>Toplam: {totalPrice.toFixed(2)} ₺</h3>

                    <button
                        type="button"
                        onClick={createPayment}
                        disabled={isLoading || cart.length === 0}
                    >
                        {isLoading ? "Ödeme hazırlanıyor..." : "Ödemeyi Başlat"}
                    </button>

                    {message && <p className="payment-error">{message}</p>}
                </section>
            </div>

            {paymentLink && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <div className="payment-modal-header">
                            <h2>Güvenli Ödeme</h2>

                            <button type="button" onClick={() => setPaymentLink("")}>
                                X
                            </button>
                        </div>

                        <iframe
                            src={paymentLink}
                            title="PayThor ödeme ekranı"
                            className="payment-modal-frame"
                            allow="payment"
                        />

                    </div>
                </div>
            )}
        </main>
    );
}
