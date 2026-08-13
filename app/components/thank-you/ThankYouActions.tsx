import Link from "next/link";

type ThankYouActionsProps = {
    continueShoppingText: string;
};

export function ThankYouActions({
    continueShoppingText,
}: ThankYouActionsProps) {
    return (
        <div className="thank-you-actions">
            <Link href="/">{continueShoppingText}</Link>
        </div>
    );
}