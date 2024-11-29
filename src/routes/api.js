import express from "express";
export const router = express.Router();

import * as UsersController from "../controllers/UsersController.js";
import * as BrandController from "../controllers/BrandController.js";
import * as CartListController from "../controllers/CartListController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as ProductController from "../controllers/ProductController.js";
import * as WishListController from "../controllers/WishListController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

// Users
router.post("/Login", UsersController.Login);
router.post("/VerifyLogin", UsersController.VerifyLogin);
router.post("/CreateUserProfile", UsersController.CreateUserProfile);
router.put("/UpdateUserProfile", UsersController.UpdateUserProfile);
router.get("/ReadUserProfile", UsersController.ReadUserProfile);

// Brands
router.get("/BrandList", BrandController.BrandList);

// Category
router.get("/CategoryList", CategoryController.CategoryList);

// Cart
router.post("/CreateCart", AuthMiddleware, CartListController.CreateCart);
router.get("/ReadCartList", AuthMiddleware, CartListController.ReadCartList);
router.put("/UpdateCart", AuthMiddleware, CartListController.UpdateCart);
router.delete("/RemoveCart", AuthMiddleware, CartListController.RemoveCart);

//Review
router.post("/CreateProductReview", ProductController.CreateProductReview);

// Wish
router.post("/CreateWish", WishListController.CreateWish);
router.get("/ReadWishList", WishListController.ReadWishList);
router.delete("/RemoveWish", WishListController.RemoveWish);

// ProductList
router.get("/ProductListBySlider", ProductController.ProductListBySlider);
router.get("/ProductListByCategory/:CategoryID", ProductController.ProductListByCategory);
router.get("/ProductListByRemark/:Remark", ProductController.ProductListByRemark);
router.get("/ProductListByBrand/:BrandID", ProductController.ProductListByBrand);
router.get("/ProductDetailsID/:ProductID", ProductController.ProductDetailsID);
router.get("/ProductListByKeyword/:keyword", ProductController.ProductListByKeyword);
router.get("/ProductReviewListByID/:productID", ProductController.ProductReviewListByID);

// Invoice
router.post("/CreateInvoice", AuthMiddleware, InvoiceController.CreateInvoice);
// router.get("/ReadInvoiceList", AuthMiddleware, InvoiceController.ReadInvoiceList);
// router.get("/ReadInvoiceProductList/:invoice_id", InvoiceController.InvoiceProductList);


// //payments
// router.post("/PaymentSuccess/:trxID", InvoiceController.PaymentSuccess)
// router.post("/PaymentCancel/:trxID", InvoiceController.PaymentCancel)
// router.post("/PaymentFail/:trxID", InvoiceController.PaymentFail)
// router.post("/PaymentIPN/:trxID", InvoiceController.PaymentIPN)





export default router;
