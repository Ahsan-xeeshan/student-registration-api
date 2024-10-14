const { TokenDecode } = require("../utilities/tokenUtilities");
const authMiddleware = (req, res, next) => {
  let token = req.headers["token"];
  console.log(token);
  let decoded = TokenDecode(token);
  console.log(decoded);
  if (decoded === null) {
    return res.status(401).json({ status: "failed", message: "Unauthorized!" });
  } else {
    let email = decoded.email;
    let user_id = decoded.user_id;
    req.headers.email = email;
    req.headers.user_id = user_id;
    next();
  }
};

module.exports = authMiddleware;
