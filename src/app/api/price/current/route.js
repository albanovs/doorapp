import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import PriceList from "../../../../models/priceList";

export async function GET() {
    try {
        await connectDB();

        const currentPrice = await PriceList.findOne({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();

        if (!currentPrice) {
            return NextResponse.json(
                { message: "Прайс не найден" },
                { status: 404 }
            );
        }

        return NextResponse.json(currentPrice);
    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка получения прайса" },
            { status: 500 }
        );
    }
}
