import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/orders";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { message: "ID не передан" },
                { status: 400 }
            );
        }

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return NextResponse.json(
                { message: "Заявка не найдена" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Заявка успешно удалена",
        });

    } catch (error) {
        return NextResponse.json(
            {
                message: "Ошибка удаления заявки",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
