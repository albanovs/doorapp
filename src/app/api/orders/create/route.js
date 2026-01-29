import { NextResponse } from "next/server";
import Order from "../../../../models/orders";
import { connectDB } from "../../../../lib/db";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            clientName,
            clientPhone,
            orderType,
            city,
            street,
            home,
            comment,
            orderDate,
            workDate,
            status,
            periodDate,
            shopName,
            apiKey
        } = body;

        const prefix = (shopName || "XX").substring(0, 2).toUpperCase();

        const lastOrder = await Order.findOne({ orderName: { $regex: `^${prefix}\\d{4}$` } })
            .sort({ createdAt: -1 })
            .lean();

        let nextNumber = 1;
        if (lastOrder) {
            const lastNum = parseInt(lastOrder.orderName.slice(2), 10);
            if (!isNaN(lastNum)) nextNumber = lastNum + 1;
        }

        const orderName = `${prefix}${String(nextNumber).padStart(4, "0")}`;

        const newOrder = await Order.create({
            orderName,
            clientName: clientName || "Не указано",
            clientPhone: clientPhone || "Не указано",
            orderType,
            city,
            street,
            home,
            comment: comment || "",
            orderDate: orderDate || new Date(),
            workDate: workDate || null,
            status: status || "Новая",
            periodDate: {
                from: periodDate.from,
                to: periodDate.to
            },
            clientFile: {},
            managerFile: {},
            apiKey
        });

        return NextResponse.json(
            {
                message: "Заявка создана",
                order: newOrder
            },
            { status: 201 }
        );

    } catch (err) {
        return NextResponse.json(
            {
                message: "Ошибка создания заявки",
                error: err.message
            },
            { status: 500 }
        );
    }
}
