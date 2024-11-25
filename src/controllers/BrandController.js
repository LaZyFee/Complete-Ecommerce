import { BrandListService } from "../services/ProductServices.js";

export const BrandList = async (req, res) => {
  let result = await BrandListService();
  return res.json(result);
};
