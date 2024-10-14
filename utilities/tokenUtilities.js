require("dotenv").config();
const jwt = require("jsonwebtoken");

const TokenEncode = (email, user_id) => {
  const KEY = process.env.JWT_SECRET;
  const EXPIRE = { expiresIn: process.env.JWT_EXPIRE_TIME };
  const PAYLOAD = { email: email, user_id: user_id };
  return jwt.sign(PAYLOAD, KEY, EXPIRE);
};
const TokenDecode = (token) => {
  try {
    const KEY = process.env.JWT_SECRET;
    return jwt.verify(token, KEY);
  } catch (e) {
    return null;
  }
};

module.exports = { TokenEncode, TokenDecode };
