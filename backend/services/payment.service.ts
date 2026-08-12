import { createHash, randomInt } from "crypto";
import { CreatePaymentDto } from "../dtos/payment.dto";

const PAYTHOR_PAYMENT_CREATE_URL =
    "https://live-api.sanalpospro.com/payment/create";

function getPaythorCredentials() {
    const publicKey = process.env.PAYTHOR_PUBLIC_KEY;
    const secretKey = process.env.PAYTHOR_SECRET_KEY;

    if (!publicKey || !secretKey) {
        throw new Error("PayThor public or secret key is missing.");
    }

    return {
        publicKey,
        secretKey,
    };
}

function createPaythorAuthorizationHeader(
    publicKey: string,
    secretKey: string,
    timestamp: string,
    nonce: string
) {
    const hash = createHash("sha256")
        .update(`${publicKey}${secretKey}${timestamp}${nonce}`)
        .digest("hex");

    return `ApiKeys ${publicKey}:${hash}`;
}

function parsePaythorResponse(responseText: string) {
    try {
        return JSON.parse(responseText);
    } catch {
        return {
            status: "error",
            message:
                responseText || "SanalPosPRO did not return a valid JSON response.",
        };
    }
}

function isInvalidPaymentData(data: CreatePaymentDto) {
    return (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data) ||
        Object.keys(data).length === 0
    );
}

export async function createPayment(data: CreatePaymentDto) {
    if (isInvalidPaymentData(data)) {
        throw new Error("Payment data is required.");
    }

    const { publicKey, secretKey } = getPaythorCredentials();

    const timestamp = (Date.now() / 1000).toString();
    const nonce = randomInt(1_000_000, 10_000_000).toString();

    const authorization = createPaythorAuthorizationHeader(
        publicKey,
        secretKey,
        timestamp,
        nonce
    );

    const paythorResponse = await fetch(PAYTHOR_PAYMENT_CREATE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
            "X-Timestamp": timestamp,
            "X-Nonce": nonce,
        },
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const responseText = await paythorResponse.text();
    const responseData = parsePaythorResponse(responseText);

    return {
        data: responseData,
        status: paythorResponse.status,
    };
}