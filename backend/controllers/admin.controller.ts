import { NextResponse } from "next/server";
import * as adminService from "@/backend/services/admin.service";

export async function loginAdminController(request: Request) {
    const body = await request.json();

    const isValidAdmin = adminService.validateAdminLogin(body);

    if (!isValidAdmin) {
        return NextResponse.json(
            { message: "Kullanici adi veya sifre hatali." },
            { status: 401 }
        );
    }

    const response = NextResponse.json({
        message: "Giris basarili.",
    });

    response.cookies.set(
        "admin_session",
        "true",
        adminService.getAdminLoginCookieOptions()
    );

    return response;
}

export async function logoutAdminController() {
    const response = NextResponse.json({
        message: "Cikis yapildi.",
    });

    response.cookies.set(
        "admin_session",
        "",
        adminService.getAdminLogoutCookieOptions()
    );

    return response;
}