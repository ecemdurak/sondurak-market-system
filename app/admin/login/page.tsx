"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //giriş yapa basınca çalışacak fonksiyon
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
                throw new Error(data.message || "Giriş yapılamadı.");
            }

            router.push("/admin");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Bilinmeyen hata oluştu.";

            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="admin-login-page">
            <form className="admin-login-form" onSubmit={handleSubmit}>
                <h1>Admin Giriş</h1>

                <input
                    type="text"
                    placeholder="Kullanıcı adı"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>

                {message && <p className="admin-message">{message}</p>}
            </form>
        </main>
    );
}