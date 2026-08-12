import { NextResponse } from "next/server";
import * as productService from "@/backend/services/product.service";
//product.service.ts dosyasındaki export edilmiş bütün fonksiyonları alıyo

//Ürünleri service’den alıyo
export async function getProductsController() {
    try {
        const products = await productService.getProducts();
        //product.service.ts içindeki getProducts fonksiyonunu çalıştır

        return NextResponse.json(products);
    } catch (error) {
        console.error("Products fetch error:", error);

        return NextResponse.json(
            { message: "Products could not be fetched." },
            { status: 500 }
        );
    }
}


//şimdii ürün oluştururken Request lazım çünkü hangi ürünü oluşturacağımızın bilgileri request body'de geliyo
export async function createProductController(request: Request) {
    try {
        const body = await request.json();
        const product = await productService.createProduct(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Product create error:", error);

        return NextResponse.json(
            { message: "Product could not be created." },
            { status: 500 }
        );
    }
}

export async function updateProductController(
    request: Request,
    id: string
) {
    try {
        const body = await request.json();

        const product = await productService.updateProductById(Number(id), body);
        //Şu id’ye sahip ürünü, bu body bilgileriyle güncelle.

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product update error:", error);

        return NextResponse.json(
            { message: "Product could not be updated." },
            { status: 500 }
        );
    }
}

export async function deleteProductController(id: string) {
    try {
        await productService.deleteProductById(Number(id));

        return NextResponse.json({ message: "Product deleted." });
    } catch (error) {
        console.error("Product delete error:", error);

        return NextResponse.json(
            { message: "Product could not be deleted." },
            { status: 500 }
        );
    }
}