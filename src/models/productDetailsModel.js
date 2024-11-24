import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    img1: { type: string, required: true },
    img2: { type: string, required: true },
    img3: { type: string, required: true },
    img4: { type: string, required: true },
    img5: { type: string },
    img6: { type: string },
    img7: { type: string },
    img8: { type: string },

    des: { type: string, required: true },
    color: { type: string, required: true },
    size: { type: string, required: true },

    productID: { type: mongoose.Schema.Types.objectId, required: true }

},
    {
        timestamps: "true"
    }
)
export const ProductDetailsModel = mongoose.model("productdetails", DataSchema)