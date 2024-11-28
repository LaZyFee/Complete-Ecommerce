import mongoose from "mongoose";
import { WishModel } from "../models/WishlistModel.js";

//add to wishlist
export const CreateWish = async (req, res) => {
  try {
    const { productID, userID } = req.body;

    await WishModel.updateOne(
      { productID, userID },
      { $set: { productID, userID } },
      { upsert: true }
    );

    return res.json({
      status: "Success",
      Message: "Product successfully added to Wishlist",
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};

//get wishlist
export const ReadWishList = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.json({
        status: "Fail",
        Message: "UserID is required to fetch the wishlist",
      });
    }

    const wishList = await WishModel.aggregate([
      {
        $match: {
          userID: new mongoose.Types.ObjectId(userID),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productID",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "brands",
          localField: "productDetails.brandID",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      { $unwind: "$brandDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.categoryID",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 1,
          userID: 1,
          productID: 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.description": 1,
          "brandDetails.brandName": 1,
          "brandDetails.brandImg": 1,
          "categoryDetails.categoryName": 1,
          "categoryDetails.categoryImg": 1,
        },
      },
    ]);

    return res.json({
      status: "Success",
      Message: "Wishlist retrieved successfully",
      data: wishList,
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};


//delete wishlist
export const RemoveWish = async (req, res) => {
  try {
    const { productID, userID } = req.body;

    const result = await WishModel.deleteOne({ productID, userID });

    if (result.deletedCount > 0) {
      return res.json({
        status: "Success",
        Message: "Product successfully removed from Wishlist",
      });
    } else {
      return res.json({
        status: "Fail",
        Message: "No matching product found in Wishlist",
      });
    }
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};