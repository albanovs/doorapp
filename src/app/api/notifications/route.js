import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Notification from "../../../models/Notification";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const apikey = searchParams.get("apikey");

        let notifications = [];

        if (apikey) {
            notifications = await Notification.find({ apiKey: apikey })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        } else {
            notifications = await Notification.find()
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        }

        return NextResponse.json({ notifications });

    } catch (error) {
        console.error("Notifications GET error:", error);
        return NextResponse.json(
            { message: "Server error", notifications: [] },
            { status: 500 }
        );
    }
}
