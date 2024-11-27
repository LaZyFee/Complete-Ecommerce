import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        otp: { type: String, required: true, },
        verifiedAt: { type: Date, default: null },
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.model("user", DataSchema);
