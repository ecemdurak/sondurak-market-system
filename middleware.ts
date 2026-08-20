import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//NextResponse, kullanıcıyı devam ettirmek veya başka sayfaya yönlendirmek için.

export function middleware(request: NextRequest) {
    //kullanıcının girmek istediği yolu açıyor. Örn: /admin/login
    const pathname = request.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login";
    //kullanıcı login sayfasına mı gitme istiyo

    //Bu route zaten serbest, kontrol etme.
    if (!isAdminRoute || isLoginPage) {
        return NextResponse.next();
    }

    const adminSession = request.cookies.get("admin_session")?.value;

    if (adminSession !== process.env.ADMIN_SESSION_SECRET) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};