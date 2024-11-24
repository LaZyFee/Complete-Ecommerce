import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    name: { types: string, required: true },
    des: { types: string, required: true },
    img: { types: string, required: true },



},
    {
        tiemstamps: true
    }
)
export const FeaturesModel = ("feature", DataSchema)