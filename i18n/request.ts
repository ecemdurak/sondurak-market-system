import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "../i18n";

function isLocale(value: string | undefined): value is Locale {
    return locales.includes(value as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

    let locale = await requestLocale;

    if (!isLocale(locale)) {
        locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});