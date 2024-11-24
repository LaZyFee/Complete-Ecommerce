import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID: { types: mongoose.Schema.Types.ObjectId, required: true },
    payable: { types: string, required: true },
    cus_details: { types: string, required: true },
    ship_details: { types: string, required: true },
    tran_id: { types: string, required: true },
    val_id: { types: string, required: true },
    delivery_status: { types: string, required: true },
    payment_status: { types: string, required: true },
    total: { types: string, required: true },
    vat: { types: string, required: true },
},
    {
        tiemstamps: true
    }
)
export const InvoiceModel = ("invoice", DataSchema)