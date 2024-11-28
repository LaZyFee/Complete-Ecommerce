import { CartModel } from "../models/CartModel.js";

// Create a new cart item
export const CreateCart = async (req, res) => {
  try {
    let userID = req.headers.user_id;
    if (!userID) {
      return res.json({ status: "Fail", Message: "UserID is required in headers" });
    }

    const { productID, color, qty, size } = req.body;
    if (!productID || !color || !qty || !size) {
      return res.json({ status: "Fail", Message: "All fields (productID, color, qty, size) are required" });
    }

    const reqBody = { userID, productID, color, qty, size };

    // Check if the cart item already exists, then update quantity instead of adding a duplicate
    const existingItem = await CartModel.findOne({ userID, productID, color, size });
    if (existingItem) {
      existingItem.qty = parseInt(existingItem.qty) + parseInt(qty);
      await existingItem.save();
    } else {
      await CartModel.create(reqBody);
    }

    return res.json({
      status: "Success",
      Message: "Product successfully added to Cart",
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};

// Read all cart items for a user
export const ReadCartList = async (req, res) => {
  try {
    let userID = req.headers.user_id;
    if (!userID) {
      return res.json({ status: "Fail", Message: "UserID is required in headers" });
    }

    // Fetch all cart items for the user
    const cartItems = await CartModel.find({ userID }).populate("productID");

    if (cartItems.length === 0) {
      return res.json({
        status: "Success",
        Message: "Cart is empty",
        data: [],
      });
    }

    return res.json({
      status: "Success",
      Message: "Cart retrieved successfully",
      data: cartItems,
    });
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};

// Update a cart item
export const UpdateCart = async (req, res) => {
  try {
    let userID = req.headers.user_id;
    if (!userID) {
      return res.json({ status: "Fail", Message: "UserID is required in headers" });
    }

    const { productID, qty, color, size } = req.body;
    if (!productID || !qty || !color || !size) {
      return res.json({ status: "Fail", Message: "All fields (productID, qty, color, size) are required" });
    }

    const query = { userID, productID, color, size, qty };

    // Update the cart item
    const result = await CartModel.updateOne(query);

    if (result.modifiedCount > 0) {
      return res.json({
        status: "Success",
        Message: "Cart item updated successfully",
      });
    } else {
      return res.json({
        status: "Fail",
        Message: "No matching cart item found to update",
      });
    }
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};

// Remove a cart item
export const RemoveCart = async (req, res) => {
  try {
    let userID = req.headers.user_id;
    if (!userID) {
      return res.json({ status: "Fail", Message: "UserID is required in headers" });
    }

    const { productID, color, size } = req.body;
    if (!productID || !color || !size) {
      return res.json({ status: "Fail", Message: "All fields (productID, color, size) are required" });
    }

    const query = { userID, productID, color, size };

    // Delete the matching cart item
    const result = await CartModel.deleteOne(query);

    if (result.deletedCount > 0) {
      return res.json({
        status: "Success",
        Message: "Product successfully removed from Cart",
      });
    } else {
      return res.json({
        status: "Fail",
        Message: "No matching product found in Cart",
      });
    }
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};

// Clear all cart items for a user
export const ClearCart = async (req, res) => {
  try {
    let userID = req.headers.user_id;
    if (!userID) {
      return res.json({ status: "Fail", Message: "UserID is required in headers" });
    }

    // Remove all cart items for the user
    const result = await CartModel.deleteMany({ userID });

    if (result.deletedCount > 0) {
      return res.json({
        status: "Success",
        Message: "All items successfully removed from Cart",
      });
    } else {
      return res.json({
        status: "Fail",
        Message: "No items found in the cart to clear",
      });
    }
  } catch (e) {
    return res.json({ status: "Fail", Message: e.toString() });
  }
};
