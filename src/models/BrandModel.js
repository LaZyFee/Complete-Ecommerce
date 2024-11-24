import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    brandName: { type: "string", unique: "true", required: true },
    brandImg: { type: "string", required: true }
},
    { timestamps: "true" }
)
export const BrandModel = mongoose.model("brand", DataSchema)