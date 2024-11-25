import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    title: { type: String, required: true },
    des: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
}, {
    timestamps: true,
});

export const ProductSliderModel = mongoose.model("productslider", DataSchema);