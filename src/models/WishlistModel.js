import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },

},
    {
        timestamps: true,
    }
)

export const WishModel = mongoose.model("wish", DataSchema)