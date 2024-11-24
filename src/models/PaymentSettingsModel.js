import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    store_id: { types: string, required: true },
    store_passwd: { types: string, required: true },
    currency: { types: string, required: true },
    success_url: { types: string, required: true },
    fail_url: { types: string, required: true },
    cancel_url: { types: string, required: true },
    ipn_url: { types: string, required: true },
    init_url: { types: string, required: true },


},
    {
        tiemstamps: true
    }
)
export const PaymrntSettingsModel = ("paymentsetting", DataSchema)