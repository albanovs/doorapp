import { NextResponse } from "next/server";
import User from "../../../../models/users";
import { connectDB } from "../../../../lib/db";

export async function POST(req) {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
            { message: "Введите email и пароль" },
            { status: 400 }
        );
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
        return NextResponse.json(
            { message: "Неверный email или пароль" },
            { status: 401 }
        );
    }

    const { password: _password, __v, ...userData } = user.toObject();

    return NextResponse.json({
        message: "Успешный вход",
        apiKey: user.apiKey,
        user: userData,
    });
}
