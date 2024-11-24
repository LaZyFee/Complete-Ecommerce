import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    categoryName: { type: "string", unique: "true", required: true },
    categoryImg: { type: "string", required: true }
},
    { timestamps: "true" }
)
export const CategoryModel = mongoose.model("catagories", DataSchema)