import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

export const TokenEncode = (email, user_id) => {
  const token = jwt.sign(
    { email: email, user_id: user_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
  return token;
};


export const TokenDecode = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (e) {
    return null;
  }
};
