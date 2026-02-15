import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Notification from "../../../../models/Notification";

export async function PUT(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "ID обязателен" }, { status: 400 });
        }

        await Notification.findByIdAndUpdate(id, { isReadAdmin: true });

        return NextResponse.json({ message: "Прочитано" });
    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка обновления", error: err.message },
            { status: 500 }
        );
    }
}
