//Prisma/database işlemleri burada 

import { prisma } from "@/lib/prisma";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export async function getProducts() {
    return prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createProduct(data: CreateProductDto) {
    return prisma.product.create({
        data: {
            title: data.title,
            price: data.price,
            image: data.image || null,
            category: data.category || null,
            barcode: data.barcode || null,
            description: data.description || null,
        },
    });
}

export async function updateProductById(id: number, data: UpdateProductDto) {
    return prisma.product.update({
        where: {
            id,
        },
        data: {
            title: data.title,
            price: data.price,
            image: data.image || null,
            category: data.category || null,
            barcode: data.barcode || null,
            description: data.description || null,
        },
    });
}

export async function deleteProductById(id: number) {
    return prisma.product.delete({
        where: {
            id,
        },
    });
}