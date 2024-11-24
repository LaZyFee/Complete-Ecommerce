import mongoose, { mongo } from "mongoose";

const DataSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    cus_add: { type: string },
    cus_city: { type: string },
    cus_country: { type: string },
    cus_fax: { type: string },
    cus_name: { type: string },
    cus_phone: { type: string },
    cus_postcode: { type: string },
    cus_state: { type: string },
    ship_add: { type: string },
    ship_city: { type: string },
    ship_country: { type: string },
    ship_name: { type: string },
    ship_phone: { type: string },
    ship_postcode: { type: string },
    ship_state: { type: string },
},
    { timestamps: true }

)

export const ProfileModel = mongoose.model("profilemodel", DataSchema)