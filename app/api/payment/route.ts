import { createHash, randomInt } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

//post isteği karşılama gelen veri
export async function POST(request: Request) {
    try {
        const publicKey = process.env.PAYTHOR_PUBLIC_KEY;
        const secretKey = process.env.PAYTHOR_SECRET_KEY;

        //key kontrolü
        if (!publicKey || !secretKey) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "PayThor genel veya gizli anahtarı bulunamadı.",
                },
                { status: 500 }
            );
        }

        const requestBody = await request.json();

        const timestamp = (Date.now() / 1000).toString();

        const nonce = randomInt(1_000_000, 10_000_000).toString();


        const hash = createHash("sha256")
            .update(`${publicKey}${secretKey}${timestamp}${nonce}`)
            .digest("hex");


        const authorization = `ApiKeys ${publicKey}:${hash}`;
        
        //paythor bağlantısı
        const paythorResponse = await fetch(
            "https://live-api.sanalpospro.com/payment/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                    "X-Timestamp": timestamp,
                    "X-Nonce": nonce,
                },
                body: JSON.stringify(requestBody),
                cache: "no-store",
            }
        );

        const responseText = await paythorResponse.text();

        let data: unknown;

        try {
            data = JSON.parse(responseText);
        } catch {
            data = {
                status: "error",
                //cevap boşsa değilse 
                message:
                    responseText || "SanalPosPRO geçerli bir JSON cevabı döndürmedi.",
            };
        }

        //paythor durum koduyla aynı
        return NextResponse.json(data, {
            status: paythorResponse.status,
        });
        
    } catch (error) {
        console.error("SanalPosPRO ödeme hatası:", error);
        
        //genel hata cevabı
        return NextResponse.json(
            {
                status: "error",
                message: "Ödeme oluşturulurken beklenmeyen bir hata oluştu.",
            },
            { status: 500 }
        );
    }
}