import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID: { types: mongoose.Schema.Types.ObjectId, required: true },
    productID: { types: mongoose.Schema.Types.ObjectId, required: true },
    invoiceID: { types: mongoose.Schema.Types.ObjectId, required: true },
    price: { types: string, required: true },
    color: { types: string, required: true },
    size: { types: string, required: true },


},
    {
        tiemstamps: true
    }
)
export const InvoiceProductModel = ("invoiceproduct", DataSchema)