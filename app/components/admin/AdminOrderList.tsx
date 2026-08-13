import type { Order } from "../../types/order";

type AdminOrderListProps = {
    orders: Order[];
};

export function AdminOrderList({ orders }: AdminOrderListProps) {
    return (
        <section className="admin-orders-panel">
            <div className="admin-section-header">
                <h2>Siparişler</h2>
                <span>{orders.length} sipariş</span>
            </div>

            <div className="admin-orders-list">
                {orders.length === 0 ? (
                    <p>Henüz sipariş yok.</p>
                ) : (
                    orders.map((order) => (
                        <article className="admin-order-row" key={order.id}>
                            <div>
                                <h3>
                                    #{order.id} - {order.firstName} {order.lastName}
                                </h3>
                                <p>{order.email}</p>
                                <p>
                                    Toplam: {Number(order.totalPrice).toFixed(2)}{" "}
                                    {order.currency}
                                </p>
                                <p>Durum: {order.paymentStatus}</p>
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="admin-order-items">
                                    {order.items.map((item) => (
                                        <p key={item.id}>
                                            {item.productTitle} x{item.quantity} -{" "}
                                            {Number(item.totalPrice).toFixed(2)} {order.currency}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}