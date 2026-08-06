import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    if (
        body.username !== process.env.ADMIN_USERNAME ||
        body.password !== process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json(
            { message: "Kullanıcı adı veya şifre hatalı." },
            { status: 401 }
        );
    }

    const response = NextResponse.json({
        message: "Giriş başarılı.",
    });

    //tarayıcıya admin_session adında bir cookie gönderiyoruz. Bu cookie admin sayfasına giriş yapıldığını gösteriyor.
    response.cookies.set("admin_session", "true", {
        //cookie sadece http üzerinden gönderilecek. Bu sayede javascript ile cookieye erişilemez.
        httpOnly: true,
        //cookie sadece bu site üzerinden gönderilecek. Bu sayede başka sitelerden cookieye erişilemez.
        sameSite: "lax",
        path: "/",
    });

    return response;
}