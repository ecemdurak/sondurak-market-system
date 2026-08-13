import { useTranslations } from "next-intl";

type CheckoutFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
};

type CheckoutFormProps = {
    form: CheckoutFormData;
    setForm: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
};

export function CheckoutForm({ form, setForm }: CheckoutFormProps) {
    const t = useTranslations("checkout");

    return (
        <section className="checkout-form">
            <h2>{t("payerInfo")}</h2>

            <input
                type="text"
                placeholder={t("firstName")}
                value={form.firstName}
                onChange={(event) =>
                    setForm({ ...form, firstName: event.target.value })
                }
            />

            <input
                type="text"
                placeholder={t("lastName")}
                value={form.lastName}
                onChange={(event) =>
                    setForm({ ...form, lastName: event.target.value })
                }
            />

            <input
                type="email"
                placeholder={t("email")}
                value={form.email}
                onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                }
            />

            <input
                type="tel"
                placeholder={t("phone")}
                value={form.phone}
                onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                }
            />

            <textarea
                placeholder={t("address")}
                value={form.address}
                onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                }
            />

            <input
                type="text"
                placeholder={t("city")}
                value={form.city}
                onChange={(event) =>
                    setForm({ ...form, city: event.target.value })
                }
            />

            <input
                type="text"
                placeholder={t("district")}
                value={form.district}
                onChange={(event) =>
                    setForm({ ...form, district: event.target.value })
                }
            />

            <input
                type="text"
                placeholder={t("postalCode")}
                value={form.postalCode}
                onChange={(event) =>
                    setForm({ ...form, postalCode: event.target.value })
                }
            />
        </section>
    );
}
