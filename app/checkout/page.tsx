"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCartStore } from "../../store/cartStore";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary";
import { PaymentModal } from "../components/checkout/PaymentModal";

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
    const t = useTranslations("checkout");
    const router = useRouter();
    const { cart, clearCart } = useCartStore();
    console.log("CheckoutPage cart:", cart); // Sepet içeriğini kontrol etmek için log ekledim
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
                    setMessage(t("missingPaymentToken"));
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
                    setMessage(t("paymentNotVerified"));
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
    }, [createdOrderId, paymentToken, clearCart, router, t]);

    const totalPrice = cart.reduce(
        (total, item: any) =>
            total + Number(item.price) * (item.quantity || 1),
        0
    );

    //ödemeyi başlat
    async function createPayment() {
        if (cart.length === 0) {
            setMessage(t("cartRequired"));
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
            setMessage(t("payerInfoRequired"));
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
                totalPrice: Number(totalPrice.toFixed(2)),
                currency: "TRY",
                paymentStatus: "pending",
                //sepet->sipariş ????
                items: cart.map((item: any) => ({
                    productId: item.id,
                    productTitle: item.title,
                    unitPrice: Number(Number(item.price).toFixed(2)),
                    quantity: item.quantity || 1,
                    totalPrice: Number((Number(item.price) * (item.quantity || 1)).toFixed(2)),
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
                throw new Error(t("orderCreateFailed"));
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
                    data.message || t("paymentCreateFailed", { status: response.status })
                );
            }


            const link = data.data?.payment_link;

            const token = data.data?.payment_token;

            if (!link) {
                throw new Error(t("paymentLinkMissing"));
            }
            if (!token) {
                throw new Error(t("paymentTokenMissing"));
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
                error instanceof Error ? error.message : t("unknownError");

            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="checkout-page">
            <div className="checkout-header">
                <h1>{t("title")}</h1>
                <Link href="/">{t("backToHome")}</Link>
            </div>

            <div className="checkout-content">
                <CheckoutForm form={form} setForm={setForm} />

                <CheckoutSummary
                    cart={cart}
                    totalPrice={totalPrice}
                    isLoading={isLoading}
                    message={message}
                    onCreatePayment={createPayment}
                />
            </div>

            <PaymentModal
                paymentLink={paymentLink}
                onClose={() => setPaymentLink("")}
            />
        </main>
    );
}
