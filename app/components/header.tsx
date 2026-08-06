"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { usePathname } from "next/navigation";

export default function Header() {
    const { cart, removeFromCart } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    const cartCount = cart.reduce(
        (total, item: any) => total + (item.quantity || 1),
        0
    );
    const totalPrice = cart.reduce(
        (total, item: any) =>
            total + Number(item.price) * (item.quantity || 1),
        0
    );


    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <Link href="/" className="header-logo">
                        SonDurak
                    </Link>

                    <nav>
                        <Link href="/#products">Ürünler</Link>
                        <Link href="/#categories">Kategoriler</Link>
                        <Link href="/scanner">Barkod Okut</Link>

                        <button
                            type="button"
                            className="header-cart-button"
                            onClick={() => setIsCartOpen(true)}
                        >
                            Sepet ({cartCount})
                        </button>
                    </nav>
                </div>
            </header>

            {isCartOpen && (
                <>
                    <div
                        className="cart-overlay"
                        onClick={() => setIsCartOpen(false)}
                    />

                    <aside className="cart-drawer">
                        <div className="cart-drawer-header">
                            <h2>Sepetim</h2>

                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                            >
                                X
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p>Sepetiniz boş.</p>
                        ) : (
                            cart.map((item: any, index: number) => (
                                <div className="cart-drawer-item" key={`${item.id}-${index}`}>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p>
                                            {Number(item.price).toFixed(2)} ₺
                                            {" "}x{item.quantity || 1}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="cart-remove-button"
                                        onClick={() => removeFromCart(index)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            ))
                        )}

                        {cart.length > 0 && (
                            <div className="cart-drawer-footer">
                                <h3>Toplam: {totalPrice.toFixed(2)} ₺</h3>

                                <Link
                                    href="/checkout"
                                    className="checkout-button"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    Ödemeye Geç
                                </Link>
                            </div>
                        )}
                    </aside>
                </>
            )}
        </>
    );
}
