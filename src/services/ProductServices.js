import mongoose from "mongoose";
import { BrandModel } from "../models/BrandModel.js";
import { CategoryModel } from "../models/CategoryModel.js";
import { ProductSliderModel } from "../models/ProductSliderModel.js";
import { ProductModel } from "../models/ProductModel.js";

export const BrandListService = async () => {
  try {
    let data = await BrandModel.find();
    return {
      status: true,
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
export const CategoryListService = async () => {
  try {
    let data = await CategoryModel.find();
    return {
      status: true,
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
export const SliderListService = async () => {
  try {
    let data = await ProductSliderModel.find();
    return {
      status: true,
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
export const ListByBrandService = async (req) => {
  try {
    let BrandID = new mongoose.Types.ObjectId(req.params.BrandID);
    let MatchStage = { $match: { brandID: BrandID } };
    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      MatchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);
    return {
      status: "success",
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: e.toString(),
    };
  }
};
export const ListByCategoryService = async (req) => {
  try {
    let CategoryID = new mongoose.Types.ObjectId(req.params.CategoryID);
    let MatchStage = { $match: { categoryID: CategoryID } };
    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      MatchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);
    return {
      status: "success",
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: e.toString(),
    };
  }
};
export const ListByRemarkService = async (req) => {
  try {
    let Remark = req.params.Remark;
    let MatchStage = { $match: { remark: Remark } };
    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      MatchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);
    return {
      status: "success",
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
export const ListByKeywordService = async (req) => {
  try {
    let keyword = req.params.keyword;

    let regex = { $regex: keyword, $options: "i" };
    let SearchParams = [{ title: regex }, { shortDes: regex }];
    let SearchQuery = { $or: SearchParams };
    let MatchStage = { $match: SearchQuery };

    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      MatchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);
    return {
      status: "success",
      data: data,
    };
  } catch (error) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
export const DetailsService = async (req) => {
  try {
    let ProductID = new mongoose.Types.ObjectId(req.params.ProductID);
    let MatchStage = { $match: { _id: ProductID } };
    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };
    let JoinWithDetailsStage = {
      $lookup: {
        from: "productdetails",
        localField: "_id",
        foreignField: "productID",
        as: "details",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };
    let UnwindDetailsStage = { $unwind: "$details" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      MatchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      JoinWithDetailsStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      UnwindDetailsStage,
      ProjectionStage,
    ]);
    return {
      status: "success",
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: e.toString(),
    };
  }
};
export const ReviewListService = async () => {
  try {
    let data = await BrandModel.find();
    return {
      status: true,
      data: data,
    };
  } catch (e) {
    return {
      status: "fail",
      data: error.toString(),
    };
  }
};
