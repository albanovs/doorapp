import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        title: String,
        message: String,
        apiKey: String,
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        type: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isReadAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Notification ||
    mongoose.model("Notification", NotificationSchema);
