const express = require("express");
const router = express.Router();

const authRouter = require("../routes/api/authRoute");
const uploadRouter = require("../routes/api/upload");

router.use("/authentication", authRouter);
router.use("/uploadfiles", uploadRouter);
module.exports = router;
