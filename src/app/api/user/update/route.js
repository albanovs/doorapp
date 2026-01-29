import { NextResponse } from "next/server";
import User from "../../../../models/users";
import { connectDB } from "../../../../lib/db";

export async function PUT(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                shopName: updateData.shopName,
                managerName: updateData.managerName,
                phone: updateData.phone,
                email: updateData.email,
                adress: {
                    city: updateData.adress?.city || "",
                    street: updateData.adress?.street || "",
                    house: updateData.adress?.house || ""
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const { password, __v, ...safeUser } = updatedUser.toObject();

        return NextResponse.json({
            message: "Профиль обновлён",
            user: safeUser
        });

    } catch (err) {
        return NextResponse.json(
            { message: "Ошибка обновления профиля", error: err.message },
            { status: 500 }
        );
    }
}
