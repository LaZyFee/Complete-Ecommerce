import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    title: { type: string, required: true },
    des: { type: string, required: true },
    color: { type: string, required: true },
    size: { type: string, required: true },

    productID: { type: mongoose.Schema.Types.objectId, required: true }

},
    {
        timestamps: "true"
    }
)
export const ProductSliderModel = mongoose.model("productslider", DataSchema)