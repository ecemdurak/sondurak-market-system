import {
    deleteProductController,
    updateProductController,
} from "@/backend/controllers/product.controller";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return updateProductController(request, id);
}

export async function DELETE(
    //silmek için body gerekmez
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return deleteProductController(id);
}