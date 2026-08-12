//Ürünle ilgili iş mantığı burada olacak.

import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import * as productRepository from "../repository/product.repository";

export async function getProducts() {
    return productRepository.getProducts();
}

function isInvalidId(id: number) {
    return !Number.isInteger(id) || id <= 0;
}

function isBlank(value: string) {
    return typeof value !== "string" || value.trim().length === 0;
}

function isInvalidPrice(price: number) {
    return typeof price !== "number" || !Number.isFinite(price) || price <= 0;
}

export async function createProduct(data: CreateProductDto) {
    if (!data) {
        throw new Error("Product data is required.");
    }

    if (isBlank(data.title)) {
        throw new Error("Product title is required.");
    }

    if (isInvalidPrice(data.price)) {
        throw new Error("Product price must be greater than 0.");
    }

    return productRepository.createProduct(data);
}

//ürün güncellemeden önce kontrol
export async function updateProductById(id: number, data: UpdateProductDto) {
    if (isInvalidId(id)) {
        throw new Error("Product id must be a positive number.");
    }

    if (!data) {
        throw new Error("Product data is required.");
    }

    if (isBlank(data.title)) {
        throw new Error("Product title is required.");
    }

    if (isInvalidPrice(data.price)) {
        throw new Error("Product price must be greater than 0.");
    }

    return productRepository.updateProductById(id, data);
}

export async function deleteProductById(id: number) {
    if (isInvalidId(id)) {
        throw new Error("Product id must be a positive number.");
    }

    return productRepository.deleteProductById(id);
}

