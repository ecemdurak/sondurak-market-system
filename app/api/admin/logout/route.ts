import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        message: "Çıkış yapıldı.",
    });

    response.cookies.set("admin_session", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}