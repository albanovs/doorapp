import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/orders";
import Notification from "../../../../models/Notification";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadToS3(file, folder = "client") {
    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `${folder}/${Date.now()}-${uuid()}-${file.name}`;

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

        const shopName = formData.get("shopName") || "";
        const clientName = formData.get("clientName") || "";
        const clientPhone = formData.get("clientPhone") || "";
        const orderType = formData.get("orderType") || "";
        const city = formData.get("city") || "";
        const street = formData.get("street") || "";
        const home = formData.get("home") || "";
        const comment = formData.get("comment") || "";
        const apiKey = formData.get("apiKey") || "";

        const periodFromRaw = formData.get("periodFrom");
        const periodToRaw = formData.get("periodTo");

        if (!clientName || !clientPhone || !orderType || !city || !street || !home || !periodFromRaw || !periodToRaw) {
            return NextResponse.json(
                { message: "Заполните все обязательные поля" },
                { status: 400 }
            );
        }

        const periodFrom = new Date(periodFromRaw);
        const periodTo = new Date(periodToRaw);

        const prefix = (shopName || "XX").substring(0, 2).toUpperCase();

        const lastOrder = await Order.findOne({
            orderName: { $regex: `^${prefix}\\d{4}$` },
        })
            .sort({ createdAt: -1 })
            .lean();

        let nextNumber = 1;

        if (lastOrder) {
            const lastNum = parseInt(lastOrder.orderName.slice(2), 10);
            if (!isNaN(lastNum)) nextNumber = lastNum + 1;
        }

        const orderName = `${prefix}${String(nextNumber).padStart(4, "0")}`;

        const clientFiles = formData.getAll("clientFile");
        const uploadedFiles = [];

        for (const file of clientFiles) {
            if (file instanceof File) {
                const meta = await uploadToS3(file);
                uploadedFiles.push(meta);
            }
        }

        const newOrder = await Order.create({
            orderName,
            clientName,
            clientPhone,
            orderType,
            city,
            street,
            home,
            comment,
            periodDate: {
                from: periodFrom,
                to: periodTo,
            },
            clientFile: uploadedFiles,
            managerFile: [],
            status: "Ожидает звонок",
            apiKey,
        });

        await Notification.create({
            title: "Новая заявка",
            message: `Создана заявка ${orderName}`,
            apiKey: apiKey,
            orderId: newOrder._id,
            type: "create",
        });

        return NextResponse.json(
            { message: "Заявка создана", order: newOrder },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка создания заявки", error: err.message },
            { status: 500 }
        );
    }
}

