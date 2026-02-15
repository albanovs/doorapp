import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import PriceList from "../../../../models/priceList";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadToS3(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `price/${Date.now()}-${uuid()}-${file.name}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read",
        })
    );

    return {
        name: file.name,
        url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        size: file.size,
        type: file.type,
    };
}

export async function POST(req) {
    try {
        await connectDB();

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { message: "Файл не найден" },
                { status: 400 }
            );
        }

        const uploaded = await uploadToS3(file);

        await PriceList.updateMany({}, { isActive: false });

        const newPrice = await PriceList.create({
            ...uploaded,
            isActive: true,
        });

        return NextResponse.json(
            { message: "Прайс загружен", price: newPrice },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка загрузки", error: err.message },
            { status: 500 }
        );
    }
}
