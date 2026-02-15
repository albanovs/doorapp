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
        })
    );

    return {
        name: file.name,
        url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        size: file.size,
        type: file.type,
        key,
    };
}

export async function PUT(req) {
    try {
        await connectDB();

        const formData = await req.formData();
        const id = formData.get("_id");

        if (!id) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }

        const existingOrder = await Order.findById(id);

        if (!existingOrder) {
            return NextResponse.json(
                { message: "Заявка не найдена" },
                { status: 404 }
            );
        }

        const updateData = {};

        const fields = [
            "clientName",
            "clientPhone",
            "orderType",
            "city",
            "street",
            "home",
            "comment",
            "commentManager",
            "specialistName",
            "specialistPhone",
            "managerName",
            "managerPhone",
            "status"
        ];

        fields.forEach(field => {
            const value = formData.get(field);
            if (value !== null) {
                updateData[field] = value;
            }
        });

        const price = formData.get("price");
        if (price !== null) {
            updateData.price = Number(price);
        }

        const complaint = formData.get("complaint");
        if (complaint !== null) {
            updateData.complaint = complaint === "true";
        }

        const workDate = formData.get("workDate");
        if (workDate !== null) {
            updateData.workDate = workDate
                ? new Date(workDate)
                : null;
        }

        const periodFrom = formData.get("periodFrom");
        const periodTo = formData.get("periodTo");

        if (periodFrom || periodTo) {
            updateData.periodDate = {
                from: periodFrom
                    ? new Date(periodFrom)
                    : existingOrder.periodDate?.from,
                to: periodTo
                    ? new Date(periodTo)
                    : existingOrder.periodDate?.to,
            };
        }

        const filesToDelete = JSON.parse(
            formData.get("filesToDelete") || "[]"
        );

        let updatedClientFiles = existingOrder.clientFile.filter(
            (file) => !filesToDelete.includes(file.key)
        );

        const newClientFiles = formData.getAll("clientFile");

        for (const file of newClientFiles) {
            if (file instanceof File) {
                const meta = await uploadToS3(file);
                updatedClientFiles.push(meta);
            }
        }

        updateData.clientFile = updatedClientFiles;

        let updatedManagerFiles = [...existingOrder.managerFile];

        const newManagerFiles = formData.getAll("managerFile");

        for (const file of newManagerFiles) {
            if (file instanceof File) {
                const meta = await uploadToS3(file, "manager");
                updatedManagerFiles.push(meta);
            }
        }

        updateData.managerFile = updatedManagerFiles;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        await Notification.create({
            title: "Заявка обновлена",
            message: `Заявка ${updatedOrder.orderName} была изменена`,
            orderId: updatedOrder._id,
            apiKey: existingOrder.apiKey,
            type: "update",
        });

        return NextResponse.json({
            message: "Заявка обновлена",
            order: updatedOrder,
        });
    } catch (err) {
        return NextResponse.json(
            {
                message: "Ошибка обновления заявки",
                error: err.message,
            },
            { status: 500 }
        );
    }
}


