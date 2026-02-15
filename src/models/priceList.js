import mongoose from "mongoose";

const PriceListSchema = new mongoose.Schema(
    {
        name: String,
        url: String,
        size: Number,
        type: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.PriceList ||
    mongoose.model("PriceList", PriceListSchema);