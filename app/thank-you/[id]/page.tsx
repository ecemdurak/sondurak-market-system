import Link from "next/link";

type OrderItem = {
    id: number;
    productTitle: string;
    unitPrice: string;
    quantity: number;
    totalPrice: string;
};

type Order = {
    id: number;
    merchantReference: string;
    firstName: string;
    lastName: string;
    email: string;
    totalPrice: string;
    currency: string;
    paymentStatus: string;
    items: OrderItem[];
};

async function getOrder(id: string): Promise<Order | null> {
    const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export default async function ThankYouPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <main className="thank-you-page">
                <section className="thank-you-card">
                    <h1>Sipariş bulunamadı</h1>
                    <p>Aradığınız sipariş bilgisine ulaşılamadı.</p>
                    <Link href="/">Ana sayfaya dön</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="thank-you-page">
            <section className="thank-you-card">
                <p className="thank-you-status">Siparişiniz  oluşturuldu</p>

                <h1>Teşekkürler, {order.firstName}!</h1>

                <p>
                    Siparişiniz başarıyla kaydedildi. Ödeme durumunuzu aşağıdaki
                    bilgilerle takip edebilirsiniz.
                </p>

                <div className="thank-you-details">
                    <div>
                        <span>Sipariş No</span>
                        <strong>{order.merchantReference}</strong>
                    </div>

                    <div>
                        <span>Ödeme Durumu</span>
                        <strong>
                            {order.paymentStatus === "paid"
                                ? "Ödeme onaylandı"
                                : order.paymentStatus === "active"
                                    ? "Ödeme bekleniyor"
                                    : order.paymentStatus}
                        </strong>
                    </div>

                    <div>
                        <span>E-posta</span>
                        <strong>{order.email}</strong>
                    </div>

                    <div>
                        <span>Toplam</span>
                        <strong>
                            {Number(order.totalPrice).toFixed(2)} {order.currency}
                        </strong>
                    </div>
                </div>

                <h2>Alınan Ürünler</h2>

                <div className="thank-you-items">
                    {order.items.map((item) => (
                        <div className="thank-you-item" key={item.id}>
                            <div>
                                <strong>{item.productTitle}</strong>
                                <span>
                                    {Number(item.unitPrice).toFixed(2)} {order.currency} x
                                    {item.quantity}
                                </span>
                            </div>

                            <strong>
                                {Number(item.totalPrice).toFixed(2)} {order.currency}
                            </strong>
                        </div>
                    ))}
                </div>

                <div className="thank-you-actions">
                    <Link href="/">Alışverişe devam et</Link>
                </div>
            </section>
        </main>
    );
}