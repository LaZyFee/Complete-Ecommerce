import {
  SliderListService,
  ListByBrandService,
  ListByCategoryService,
  ListByRemarkService,
  DetailsService,
  ListByKeywordService,
} from "./../services/ProductServices.js";

import { ReviewModel } from "../models/ReviewModel.js"
import { ProfileModel } from "../models/ProfileModel.js";

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

export const ProductReviewListByID = async (req, res) => {
  try {
    const { productID } = req.params;

    // Validate if productID is provided
    if (!productID) {
      return res.status(400).json({
        status: "Fail",
        message: "Product ID is required to fetch reviews.",
      });
    }

    // Find all reviews for the specified product ID
    const reviews = await ReviewModel.find({ productID });

    // Extract user IDs from the reviews
    const userIds = reviews.map((review) => review.userID);

    // Fetch customer profiles for all userIDs and project only cus_name
    const customerProfiles = await ProfileModel.find(
      { userId: { $in: userIds } },
      "userId cus_name"
    );

    // Map reviews with corresponding customer names
    const reviewsWithCustomerNames = reviews.map((review) => {
      // Find matching profile for the review's userID
      const customer = customerProfiles.find(
        (profile) => profile.userId && profile.userId.toString() === review.userID.toString()
      );
      return {
        ...review.toObject(),
        customerName: customer ? customer.cus_name : "Unknown", // Add customer name or default to "Unknown"
      };
    });

    return res.status(200).json({
      status: "Success",
      message: "Reviews fetched successfully.",
      data: reviewsWithCustomerNames,
    });
  } catch (e) {
    console.error("Error fetching reviews:", e);
    return res.status(500).json({
      status: "Fail",
      message: e.toString(),
    });
  }
};



export const CreateProductReview = async (req, res) => {
  try {
    const { productID, userID, des, rating } = req.body;

    // Validate required fields
    if (!productID || !userID || !des || !rating) {
      return res.status(400).json({
        status: "Fail",
        message: "All fields (productID, userID, description, and rating) are required.",
      });
    }

    // Create a new review document
    const newReview = new ReviewModel({
      productID,
      userID,
      des,
      rating,
    });

    // Save the review to the database
    await newReview.save();

    return res.status(201).json({
      status: "Success",
      message: "Review created successfully.",
      data: newReview,
    });
  } catch (e) {
    return res.status(500).json({
      status: "Fail",
      message: e.toString(),
    });
  }
};
