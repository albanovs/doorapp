import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
    {
        shopName: { type: String, required: true },
        managerName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        apiKey: { type: String, unique: true },
        admin: { type: Boolean, default: false },
        adress: {
            city: { type: String },
            street: { type: String },
            house: { type: String },
        }
    },
    { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
