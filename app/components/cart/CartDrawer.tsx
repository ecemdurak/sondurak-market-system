"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

type CartDrawerProps = {
    cart: any[];
    totalPrice: number;
    onClose: () => void;
    onRemove: (index: number) => void;
    onItemRemoved: (title: string) => void;
    t: (key: string) => string;
};

export function CartDrawer({
    cart,
    totalPrice,
    onClose,
    onRemove,
    onItemRemoved,
    t,
}: CartDrawerProps) {
    return (
        <>
            <div className="cart-overlay" onClick={onClose} />

            <aside className="cart-drawer">
                <div className="cart-drawer-header">
                    <h2>
                        <Icon icon="solar:cart-large-bold" width={24} height={24} />
                        {t("myCart")}
                    </h2>

                    <button type="button" onClick={onClose} aria-label={t("closeCart")}>
                        <Icon icon="solar:close-circle-bold" width={24} height={24} />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p>{t("emptyCart")}</p>
                ) : (
                    cart.map((item: any, index: number) => (
                        <div className="cart-drawer-item" key={`${item.id}-${index}`}>
                            <div>
                                <strong>{item.title}</strong>
                                <p>
                                    {Number(item.price).toFixed(2)} TL x{item.quantity || 1}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="cart-remove-button"
                                onClick={() => {
                                    onRemove(index);
                                    onItemRemoved(item.title);
                                }}
                            >
                                <Icon icon="solar:trash-bin-trash-bold" width={18} height={18} />
                                {t("remove")}
                            </button>
                        </div>
                    ))
                )}

                {cart.length > 0 && (
                    <div className="cart-drawer-footer">
                        <h3>
                            {t("total")}: {totalPrice.toFixed(2)} TL
                        </h3>

                        <Link
                            href="/checkout"
                            className="checkout-button"
                            onClick={onClose}
                        >
                            <Icon icon="solar:card-bold" width={20} height={20} />
                            {t("goToCheckout")}
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}