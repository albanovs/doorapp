import { NextResponse } from "next/server";
import Order from "../../../../models/orders";
import { connectDB } from "../../../../lib/db";

export async function PUT(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }

        const existingOrder = await Order.findById(_id);
        if (!existingOrder) {
            return NextResponse.json(
                { message: "Заявка не найдена" },
                { status: 404 }
            );
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            {
                orderName: updateData.orderName,
                clientName: updateData.clientName,
                clientPhone: updateData.clientPhone,
                orderType: updateData.orderType,
                city: updateData.city,
                street: updateData.street,
                home: updateData.home,
                comment: updateData.comment,
                orderDate: updateData.orderDate,
                workDate: updateData.workDate,
                status: updateData.status,
                periodDate: {
                    from: updateData.periodDate?.from,
                    to: updateData.periodDate?.to
                },
                clientFile: existingOrder.clientFile || {},
                managerFile: existingOrder.managerFile || {},
                apikey: existingOrder.apikey
            },
            { new: true }
        );

        return NextResponse.json({
            message: "Заявка обновлена",
            order: updatedOrder
        });

    } catch (err) {
        return NextResponse.json(
            {
                message: "Ошибка обновления заявки",
                error: err.message
            },
            { status: 500 }
        );
    }
}
