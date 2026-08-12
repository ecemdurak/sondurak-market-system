import { loginAdminController } from "@/backend/controllers/admin.controller";

export async function POST(request: Request) {
    return loginAdminController(request);
}