import mongoose, { Schema, models } from "mongoose";


const FileSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    size: Number,
    type: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderName: { type: String, required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    specialistName: { type: String, default: "" },
    specialistPhone: { type: String, default: "" },
    managerName: { type: String, default: "" },
    managerPhone: { type: String, default: "" },
    orderType: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    home: { type: String, required: true },
    comment: { type: String, default: "" },
    commentManager: { type: String, default: "" },
    price: { type: Number, default: 0 },
    complaint: { type: Boolean, default: false },
    orderDate: { type: Date, default: Date.now() },
    workDate: { type: Date, default: null },
    status: { type: String, default: "Ожидает звонок" },
    periodDate: {
      from: { type: Date, required: true },
      to: { type: Date, required: true }
    },
    clientFile: [FileSchema],
    managerFile: [FileSchema],
    apiKey: { type: String }
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);