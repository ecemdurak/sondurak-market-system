"use client";

import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useLocale, useTranslations } from "next-intl";
import { CartDrawer } from "./cart/CartDrawer";

export default function Header() {
    const { cart, removeFromCart } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const t = useTranslations("header");
    const homeT = useTranslations("home");
    const locale = useLocale();
    const router = useRouter();
    const categoryLinks = [
        { value: "electronics", label: homeT("categoryElectronics") },
        { value: "clothing", label: homeT("categoryClothing") },
        { value: "shoes", label: homeT("categoryShoes") },
        { value: "accessories", label: homeT("categoryAccessories") },
        { value: "snacks", label: homeT("categorySnacks") },
        { value: "drinks", label: homeT("categoryDrinks") },
    ];

    function handleLanguageChange() {
        const nextLocale = locale === "tr" ? "en" : "tr";

        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
        router.refresh();
    }

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
                        <Icon icon="solar:signpost-2-bold" width={32} height={32} />
                        SonDurak
                    </Link>

                    <nav>
                        <Link href="/#products">
                            <Icon icon="solar:box-bold" width={18} height={18} />
                            {t("products")}
                        </Link>
                        <div className="header-category-menu">
                            <Link href="/#products" className="header-category-trigger">
                                <Icon icon="solar:widget-2-bold" width={18} height={18} />
                                {t("categories")}
                                <Icon icon="solar:alt-arrow-down-bold" width={14} height={14} />
                            </Link>

                            <div className="header-category-dropdown">
                                <Link href="/#products">{homeT("all")}</Link>

                                {categoryLinks.map((category) => (
                                    <Link
                                        key={category.value}
                                        href={`/?category=${category.value}#products`}
                                    >
                                        {category.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link href="/scanner">
                            <Icon icon="solar:scanner-bold" width={18} height={18} />
                            {t("barcode")}
                        </Link>



                        <button
                            type="button"
                            className="header-cart-button"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <Icon icon="solar:cart-large-bold" width={20} height={20} />
                            {t("cart")} ({cartCount})
                        </button>

                        <button
                            type="button"
                            className="language-toggle"
                            onClick={handleLanguageChange}
                            aria-label={t("changeLanguage")}
                        >
                            {locale === "tr" ? "EN" : "TR"}
                        </button>

                    </nav>
                </div>
            </header>

            {isCartOpen && (
                <CartDrawer
                    cart={cart}
                    totalPrice={totalPrice}
                    onClose={() => setIsCartOpen(false)}
                    onRemove={removeFromCart}
                    t={t}
                />
            )}
        </>
    );
}
