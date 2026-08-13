import Link from "next/link";

type AdminHeaderProps = {
    onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    return (
        <div className="admin-header">
            <div>
                <p>Yönetim</p>
                <h1>Admin Paneli</h1>
            </div>

            <div className="admin-header-actions">
                <Link href="/">Mağazaya dön</Link>

                <button type="button" onClick={onLogout}>
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}