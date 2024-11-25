import {
  SliderListService,
  ListByBrandService,
  ListByCategoryService,
  ListByRemarkService,
  DetailsService,
  ListByKeywordService,
} from "./../service/ProductServices.js";
export const ProductListBySlider = async (req, res) => {
  let result = await SliderListService();
  return res.json(result);
};
export const ProductListByCategory = async (req, res) => {
  let result = await ListByCategoryService(req);
  return res.json(result);
};
export const ProductListByRemark = async (req, res) => {
  let result = await ListByRemarkService(req);
  return res.json(result);
};
export const ProductListByBrand = async (req, res) => {
  let result = await ListByBrandService(req);
  return res.json(result);
};
export const ProductDetailsID = async (req, res) => {
  let result = await DetailsService(req);
  return res.json(result);
};
export const ProductListByKeyword = async (req, res) => {
  let result = await ListByKeywordService(req);
  res.json(result);
};
export const ProductReviewListByID = async (req, res) => {};
export const CreateProductReview = async (req, res) => {};
