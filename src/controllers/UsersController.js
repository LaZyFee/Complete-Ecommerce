import { UserModel } from "../models/UserModel.js";
import { ProfileModel } from "../models/ProfileModel.js"
import { sendVerificationEmail } from "../utility/emailUtility.js";
import { TokenEncode } from "../utility/tokenUtility.js";

export const Login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: "Fail", message: "Email is required." });
    }
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "Fail",
        message: "User already exists. Please verify your login.",
      });
    }

    // Generate a new OTP
    const verificationToken = Math.floor(1000 + Math.random() * 900000).toString();

    // Create a new user with the email and OTP
    const user = await UserModel.create({ email, otp: verificationToken });

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      status: "Success",
      message: "User successfully registered. Proceed to verify login.",
    });
  } catch (e) {
    console.error("Error in Login function:", e);
    return res.status(500).json({ status: "Fail", message: e.message });
  }
};

export const VerifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "Fail",
        message: "Email and OTP are required.",
      });
    }

    // Find and update the user by email and OTP
    const user = await UserModel.findOneAndUpdate(
      { email, otp },
      { $unset: { otp: "" }, $set: { verifiedAt: new Date() } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid email or OTP. Please try again.",
      });
    }

    // Generate a JWT token using the TokenEncode utility
    const token = TokenEncode(user.email, user._id);

    return res.status(200).json({
      status: "Success",
      message: "Login verified successfully.",
      token,
    });
  } catch (e) {
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};


export const CreateUserProfile = async (req, res) => {
  try {
    // Extract user profile data from the request body
    const {
      userId,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_name,
      cus_phone,
      cus_postcode,
      cus_state,
      ship_add,
      ship_city,
      ship_country,
      ship_name,
      ship_phone,
      ship_postcode,
      ship_state,
    } = req.body;

    // Validate required fields (example: `cus_name` and `cus_phone`)
    if (!cus_name || !cus_phone) {
      return res.status(400).json({
        status: "Fail",
        message: "Customer name and phone are required",
      });
    }

    // Create a new profile document
    const newProfile = new ProfileModel({
      userId,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_name,
      cus_phone,
      cus_postcode,
      cus_state,
      ship_add,
      ship_city,
      ship_country,
      ship_name,
      ship_phone,
      ship_postcode,
      ship_state,
    });

    // Save the profile to the database
    await newProfile.save();

    return res.status(201).json({
      status: "Success",
      message: "User profile successfully created",
      data: newProfile, // Return the created profile for verification
    });
  } catch (e) {
    console.error("Error creating user profile:", e);
    return res.status(500).json({
      status: "Fail",
      message: e.toString(),
    });
  }
};

export const UpdateUserProfile = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "Fail",
        message: "User ID is required to update the profile.",
      });
    }

    // Find and update the user profile
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        status: "Fail",
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "User profile updated successfully.",
      data: updatedProfile,
    });
  } catch (e) {
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};


export const ReadUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "Fail",
        message: "User ID is required to read the profile.",
      });
    }

    // Find the user profile
    const profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "User profile fetched successfully.",
      data: profile,
    });
  } catch (e) {
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};

