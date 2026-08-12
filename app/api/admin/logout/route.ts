import { logoutAdminController } from "@/backend/controllers/admin.controller";

export async function POST() {
    return logoutAdminController();
}