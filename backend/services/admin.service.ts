import { AdminLoginDto } from "../dtos/admin.dto";

function isBlank(value: string) {
    return typeof value !== "string" || value.trim().length === 0;
}

export function validateAdminLogin(data: AdminLoginDto) {
    if (!data) {
        return false;
    }

    if (isBlank(data.username) || isBlank(data.password)) {
        return false;
    }

    return (
        data.username === process.env.ADMIN_USERNAME &&
        data.password === process.env.ADMIN_PASSWORD
    );
}

export function getAdminLogoutCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
    };
}

export function getAdminLoginCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
    };
}