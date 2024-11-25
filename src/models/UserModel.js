import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, lowwercase: true },
    otp: { type: String, required: true }
},
    {
        timestamps: true,
    }
)

export const UserModel = mongoose.model("user", DataSchema)