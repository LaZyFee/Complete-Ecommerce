import mongoose from "mongoose";
import axios from "axios"
import FormData from "form-data"

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

    let cus_details = `
                Name: ${Profile.cus_name},
                Email: ${cus_email},
                Address: ${Profile.cus_add},
                Phone: ${Profile.cus_phone},
                `;

    let ship_details = `
                Name: ${Profile.ship_name},
                City: ${Profile.ship_city},
                Address: ${Profile.ship_add},
                Phone: ${Profile.ship_phone},
                `;


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




    // Response to the client
    return res.status(200).json({
      status: "Success",
      Message: "Invoice calculated successfully.",
      data: {
        totalAmount,
        vat,
        payable,
        cartProducts,
      },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({
      status: "Fail",
      Message: error.message || "Internal Server Error",
    });
  }
};



export const ReadInvoiceDetails = async (req, res) => {
  try {
    return res.json({
      status: "Success",
      Message: "User Successfully Registered",
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};
