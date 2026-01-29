import { NextResponse } from "next/server";
import Order from "../../../../models/orders";
import { connectDB } from "../../../../lib/db";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get("apikey");

        if (!apiKey) {
            return NextResponse.json(
                { message: "API key is required" },
                { status: 400 }
            );
        }

        const orders = await Order.find({ apiKey }).sort({ orderDate: -1 });
        return NextResponse.json({ orders }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка получения заявок", error: err.message },
            { status: 500 }
        );
    }
}
