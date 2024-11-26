import express from "express";
export const router = express.Router();

import * as UsersController from "../controllers/UsersController.js";
import * as BrandController from "../controllers/BrandController.js";
import * as CartListController from "../controllers/CartListController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as ProductController from "../controllers/ProductController.js";
import * as WishListController from "../controllers/WishListController.js";

// Users
router.post("/Login", UsersController.Login);
router.post("/VerifyLogin", UsersController.VerifyLogin);
router.post("/CreateUserProfile", UsersController.CreateUserProfile);
router.post("/UpdateUserProfile", UsersController.UpdateUserProfile);
router.get("/ReadUserProfile", UsersController.ReadUserProfile);

// Brands
router.get("/BrandList", BrandController.BrandList);

// Category
router.get("/CategoryList", CategoryController.CategoryList);

// Cart
router.post("/CreateCart", CartListController.CreateCart);
router.get("/ReadCartList", CartListController.ReadCartList);
router.post("/UpdateCart", CartListController.UpdateCart);
router.post("/RemoveCart", CartListController.RemoveCart);

//Review
router.get("/reviews/:productID", ProductController.ProductReviewListByID);
router.post("/CreateProductReview", ProductController.CreateProductReview);

// Wish
router.post("/CreateWish", WishListController.CreateWish);
router.get("/ReadWishList", WishListController.ReadWishList);
router.post("/RemoveWish", WishListController.RemoveWish);

// ProductList
router.get("/ProductListBySlider", ProductController.ProductListBySlider);
router.get("/ProductListByCategory/:CategoryID", ProductController.ProductListByCategory);
router.get("/ProductListByRemark/:Remark", ProductController.ProductListByRemark);
router.get("/ProductListByBrand/:BrandID", ProductController.ProductListByBrand);
router.get("/ProductDetailsID/:ProductID", ProductController.ProductDetailsID);
router.get("/ProductListByKeyword/:keyword", ProductController.ProductListByKeyword);
router.get("/ProductReviewListByID", ProductController.ProductReviewListByID);

// Invoice
router.post("/CreateInvoice", InvoiceController.CreateInvoice);
router.get("/ReadInvoiceList", InvoiceController.ReadInvoiceList);
router.get("/ReadInvoiceDetails", InvoiceController.ReadInvoiceDetails);

export default router;
