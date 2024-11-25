import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    invoiceID: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
}, {
    timestamps: true,
});

export const InvoiceProductModel = mongoose.model("invoiceproduct", DataSchema);
