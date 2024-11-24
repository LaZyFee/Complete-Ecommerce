import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    email: { type: string, required: true, unique: true, lowwercase: true },
    otp: { type: string, required: true }
},
    {
        timestamps: true
    }
)

export const UserModel = mongoose.model("user", DataSchema)