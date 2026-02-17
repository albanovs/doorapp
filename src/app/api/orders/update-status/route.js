import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/orders";
import Notification from "../../../../models/Notification";

export async function PUT(req) {
    try {
        await connectDB();

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json(
                { message: "ID и статус обязательны" },
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

        if (existingOrder.status === status) {
            return NextResponse.json({
                message: "Статус не изменён",
                order: existingOrder,
            });
        }

        existingOrder.status = status;
        await existingOrder.save();

        await Notification.create({
            title: "Статус изменён",
            message: `Статус заявки ${existingOrder.orderName} изменён на ${status}`,
            orderId: existingOrder._id,
            apiKey: existingOrder.apiKey,
            type: "status",
        });

        return NextResponse.json({
            message: "Статус успешно обновлён",
            order: existingOrder,
        });

    } catch (err) {
        return NextResponse.json(
            {
                message: "Ошибка обновления статуса",
                error: err.message,
            },
            { status: 500 }
        );
    }
}