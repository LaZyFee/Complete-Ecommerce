import mongoose from "mongoose";
const DataSchema = mongoose.Schema({
    title: { type: string, required: true },
    shortDes: { type: string, required: true },
    price: { type: string, required: true },
    discount: { type: Boolean, required: true },
    discountPrice: { type: string, required: true },
    image: { type: string, required: true },
    star: { type: string, required: true },
    stock: { type: Boolean, required: true },
    remark: { type: string, required: true },
    categoryID: { type: mongoose.Schema.Types.ObjectId, required: true },
    brandID: { type: mongoose.Schema.Types.ObjectId, required: true },
},
    { timestamps: "true" }
)

export const ProductModel = mongoose.model("products", DataSchema)