import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
    {
        orderName: { type: String, required: true },
        clientName: { type: String, required: true },
        clientPhone: { type: String, required: true },
        orderType: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        home: { type: String, required: true },
        comment: { type: String },
        orderDate: { type: Date },
        workDate: { type: Date, default: null },
        status: { type: String, default: "Новая" },
        periodDate: {
            from: { type: Date, required: true },
            to: { type: Date, required: true }
        },
        clientFile: {},
        managerFile: {},
        apiKey: { type: String }
    },
    { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);