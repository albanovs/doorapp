import { NextResponse } from "next/server";
import Order from "../../../../models/orders";
import { connectDB } from "../../../../lib/db";

export async function DELETE(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }

        const deletedOrder = await Order.findByIdAndDelete(_id);

        if (!deletedOrder) {
            return NextResponse.json(
                { message: "Заявка не найдена" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Заявка удалена",
            orderId: _id
        });

    } catch (err) {
        return NextResponse.json(
            {
                message: "Ошибка удаления заявки",
                error: err.message
            },
            { status: 500 }
        );
    }
}
