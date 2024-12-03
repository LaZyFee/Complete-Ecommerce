import mongoose from "mongoose";
import axios from "axios"
import FormData from "form-data"
import { ObjectId } from 'mongodb';


import { CartModel } from "../models/CartModel.js";
import { ProfileModel } from "../models/ProfileModel.js";
import { InvoiceModel } from "../models/InvoiceModel.js"
import { InvoiceProductModel } from "../models/InvoiceProductModel.js";
import { PaymentSettingsModel } from "../models/PaymentSettingsModel.js";

export const CreateInvoice = async (req, res) => {
  try {
    const { user_id, email: cus_email } = req.headers;

    // Validate required headers
    if (!user_id || !cus_email) {
      return res.status(400).json({
        status: "Fail",
        Message: "User ID and email are required in headers.",
      });
    }

    const userId = new mongoose.Types.ObjectId(user_id);

    // S-1: Calculate total payable & VAT by fetching cart details
    const cartProducts = await CartModel.aggregate([
      { $match: { userID: userId } }, // Match user by userID
      {
        $lookup: {
          from: "products",
          localField: "productID",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, // Flatten the product array
    ]);
    // console.log(cartProducts);


    // If the cart is empty
    if (!cartProducts.length) {
      return res.status(404).json({
        status: "Fail",
        Message: "No products found in the user's cart.",
      });
    }

    // Calculate totals (example of calculating VAT and total amount)
    let totalAmount = 0;

    cartProducts.forEach((element) => {
      let price;
      if (element['product']['discount'] && !isNaN(parseFloat(element['product']['discount']))) {
        price = parseFloat(element['product']['discount']);
      } else if (element['product']['price'] && !isNaN(parseFloat(element['product']['price']))) {
        price = parseFloat(element['product']['price']);
      } else {
        return; // Skip this element if no valid price
      }

      const qty = parseFloat(element['qty']);
      if (isNaN(qty)) {
        console.error("Invalid quantity detected:", element['qty']);
        return; // Skip this element if qty is invalid
      }

      totalAmount += qty * price;
    });

    let vat = totalAmount * 0.05; // 5% VAT
    let payable = totalAmount + vat;


    // S-2: Prepare Customer Details & Shipping Details

    const Profile = await ProfileModel.findOne({ userId: user_id });
    // console.log("User ID:", user_id);
    // console.log("Profile:", Profile);


    let cus_details = JSON.stringify({
      Name: Profile.cus_name,
      Email: cus_email,
      Address: Profile.cus_add,
      Phone: Profile.cus_phone,
    });

    let ship_details = JSON.stringify({
      Name: Profile.ship_name,
      City: Profile.ship_city,
      Address: Profile.ship_add,
      Phone: Profile.ship_phone,
    });



    // S-3: Transaction & other's ID

    let tran_id = Math.floor(10000000 + Math.random() * 90000000)
    let val_id = 0;
    let delivery_status = "pending";
    let payment_status = "pending";

    // S-4: Create Invoice
    let createInvoice = await InvoiceModel.create({
      userID: user_id,
      payable: payable,
      cus_details: cus_details,
      ship_details: ship_details,
      tran_id: tran_id,
      val_id: val_id,
      delivery_status: delivery_status,
      payment_status: payment_status,
      total: totalAmount,
      vat: vat,
    })

    // S-5: Create Invoice Product

    let invoice_id = createInvoice['_id']
    cartProducts.forEach(async (element) => {
      await InvoiceProductModel.create({
        userID: user_id,
        productID: element['productID'],
        invoiceID: invoice_id,
        qty: element['qty'],
        price: element['product']['discount'] ? element['product']['discountPrice'] : element['product']['price'],
        color: element['color'],
        size: element['size'],

      })

    })

    // S-6: Remove Carts
    await CartModel.deleteMany({ userID: user_id })

    // S-7: Prepare SSL Payment

    let PaymentSettings = await PaymentSettingsModel.find();
    // console.log(PaymentSettings);

    const form = new FormData();

    // Payment info
    form.append("store_id", PaymentSettings[0].store_id);
    form.append("store_passwd", PaymentSettings[0].store_passwd);
    form.append("total_amount", payable.toString());
    form.append("currency", PaymentSettings[0].currency);
    form.append("tran_id", tran_id);
    form.append("success_url", `${PaymentSettings[0].success_url}/${tran_id}`);
    form.append("fail_url", ` ${PaymentSettings[0].fail_url}/${tran_id}`);
    form.append("cancel_url", `${PaymentSettings[0].cancel_url}/${tran_id}`);
    form.append("ipn_url", `${PaymentSettings[0].ipn_url}/${tran_id}`);

    // Customer info
    form.append("cus_name", Profile.cus_name);
    form.append("cus_email", cus_email);
    form.append("cus_add1", Profile.cus_add);
    form.append("cus_add2", Profile.cus_add);
    form.append("cus_city", Profile.cus_city);
    form.append("cus_state", Profile.cus_state);
    form.append("cus_postcode", Profile.cus_postcode);
    form.append("cus_country", Profile.cus_country);
    form.append("cus_phone", Profile.cus_phone);
    form.append("cus_fax", Profile.cus_fax);

    // Ship details
    form.append("ship_name", Profile.ship_name);
    form.append("ship_add1", Profile.ship_add);
    form.append("ship_add2", Profile.ship_add);
    form.append("ship_city", Profile.ship_city);
    form.append("ship_state", Profile.ship_state);
    form.append("ship_postcode", Profile.ship_postcode);
    form.append("ship_country", Profile.ship_country);
    form.append("shipping_method", "courier");

    // Product details
    form.append("product_name", "product name");
    form.append("product_category", "product category");
    form.append("product_profile", "product profile");


    // SSLCOMMERZ response
    let SSLres = await axios.post(PaymentSettings[0]['init_url'], form);

    // Extract only the serializable data from the response
    const SSLResponse = {
      data: SSLres.data,
      status: SSLres.status,
      headers: SSLres.headers,
    };

    // Response to the client
    return res.status(200).json({
      status: "Success",
      Message: "Invoice calculated successfully.",
      data: {
        totalAmount,
        vat,
        payable,
        cartProducts,
        SSLResponse
      },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({
      status: "Fail",
    });
  }
};


// Successful Transaction handling 
export const PaymentSuccess = async (req, res) => {
  try {
    let trxID = req.params.trxID;
    await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "Success" });

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
    });
  }
};


//Cancelled Payment handling
export const PaymentCancel = async (req, res) => {
  try {
    let trxID = req.params.trxID;
    await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "Cancelled" });

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
    });
  }
};


//Failed Payment handling
export const PaymentFail = async (req, res) => {
  try {
    let trxID = req.params.trxID;
    await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "Failed" });

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
    });
  }
};

export const PaymentIPN = async (req, res) => {
  try {
    let trxID = req.params.trxID;
    let status = req.body['status']

    await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: status });

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
    });
  }
};



export const InvoiceList = async (req, res) => {
  try {
    const { user_id } = req.headers;
    let invoice = await InvoiceModel.find({ userID: user_id })

    return res.json({
      status: "Success",
      invoice
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};



export const InvoiceProductList = async (req, res) => {
  try {
    let { user_id } = req.headers;
    let { invoice_id } = req.params;

    // console.log("User ID:", user_id);
    // console.log("Invoice ID:", invoice_id);

    // Aggregation Pipeline
    let matchStage = {
      $match: {
        userID: new ObjectId(user_id),
        invoiceID: new ObjectId(invoice_id),
      },
    };
    let joinStageProduct = {
      $lookup: {
        from: "products",
        localField: "productID", // Ensure this matches the field in your schema
        foreignField: "_id",
        as: "product",
      },
    };
    let unwindStage = {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    };

    // Final Aggregation Result
    let products = await InvoiceProductModel.aggregate([matchStage, joinStageProduct, unwindStage]);
    // console.log("Final Aggregation Result:", products);

    // Send Response
    return res.status(200).json({
      status: "Success",
      products,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "Fail",
      message: e.message || "Internal Server Error",
    });
  }
};
