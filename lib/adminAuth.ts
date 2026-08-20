export function isValidAdminRequest(request: Request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminSessionSecret) {
        return false;
    }

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

    const adminSessionCookie = cookies.find((cookie) =>
        cookie.startsWith("admin_session=")
    );

    if (!adminSessionCookie) {
        return false;
    }

    const adminSession = adminSessionCookie.split("=")[1];

    return adminSession === adminSessionSecret;
}