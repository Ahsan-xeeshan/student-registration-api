require("dotenv").config();
const Student = require("../models/student");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { TokenEncode } = require("../utilities/tokenUtilities");

// Student registration
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    await Student.create({ name, email, password: hashedPassword });
    return res
      .status(200)
      .json({ status: "success", message: "User Registration Successfull!" });
  } catch (error) {
    console.log(error.message);
  }
};

// Student login
const login = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;

    let data = await Student.findOne({ email });
    console.log(data);
    if (data === null) {
      return res.json({ status: "Failed", message: "Student not found" });
    } else {
      let token = TokenEncode(data["email"], data["_id"]);

      return res.status(200).json({
        status: "success",
        message: "User Login Successfull!",
        data: { token: token },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Student profile read
const getProfile = async (req, res) => {
  try {
    let user_id = req.headers["user_id"];
    console.log(user_id);

    let data = await Student.findOne({ _id: user_id });
    console.log(data);
    return res.json({
      status: "success",
      message: "Student profile details",
      data: data,
    });
  } catch (e) {
    return res.json({ status: "Failed", message: e.toString() });
  }
};

// Student profile update
const updateProfile = async (req, res) => {
  try {
    let reqBody = req.body;
    let user_id = req.headers["user_id"];
    await Student.updateOne({ _id: user_id }, reqBody);
    return res.status(200).json({
      status: "success",
      message: "Updating User Successfull!",
    });
  } catch (e) {
    return res.json({ status: "Failed", message: e.toString() });
  }
};

module.exports = { register, login, getProfile, updateProfile };
