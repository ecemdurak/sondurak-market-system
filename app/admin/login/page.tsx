"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Giris yapilamadi.");
            }

            router.push("/admin");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Bilinmeyen hata olustu.";

            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="admin-login-page">
            <form className="admin-login-form" onSubmit={handleSubmit}>
                <h1>
                    <Icon icon="solar:shield-user-bold" width={28} height={28} />
                    Admin Giris
                </h1>

                <input
                    type="text"
                    placeholder="Kullanici adi"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Sifre"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit" disabled={isLoading}>
                    <Icon icon="solar:login-3-bold" width={20} height={20} />
                    {isLoading ? "Giris yapiliyor..." : "Giris Yap"}
                </button>

                {message && <p className="admin-message">{message}</p>}
            </form>
        </main>
    );
}
