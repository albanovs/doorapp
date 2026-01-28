import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "./../../../../models/users";
import { connectDB } from "../../../../lib/db";

export async function POST(req) {
    await connectDB();

    const body = await req.json();
    const { shopName, managerName, phone, email, password } = body;

    if (!shopName || !managerName || !phone || !email || !password) {
        return NextResponse.json(
            { message: "Заполните все поля" },
            { status: 400 }
        );
    }

    const exists = await User.findOne({ email });
    if (exists) {
        return NextResponse.json(
            { message: "Пользователь уже существует" },
            { status: 400 }
        );
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
        shopName,
        managerName,
        phone,
        email,
        password,
        apiKey,
        adress: {
            city: "",
            street: "",
            house: "",
        },
    });

    return NextResponse.json({
        message: "Успешная регистрация",
        apiKey: user.apiKey,
    });
}
