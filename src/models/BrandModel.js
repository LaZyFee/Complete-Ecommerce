import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    brandName: { type: String, unique: true, required: true },
    brandImg: { type: String, required: true },
}, {
    timestamps: true,
});

export const BrandModel = mongoose.model("brand", DataSchema);
