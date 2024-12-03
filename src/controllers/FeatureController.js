import { FeaturesModel } from "../models/FeaturesModel.js"


export const FeatureList = async (req, res) => {
    try {
        let data = await FeaturesModel.find()
        return res.status(200).json({
            status: "Success",
            data
        });
    } catch (e) {
        return res.status(500).json({ status: "Fail", message: e.toString() });
    }
};