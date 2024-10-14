require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/config");
const cookieParser = require("cookie-parser");
const route = require("./routes");
const app = express();

const port = process.env.PORT || 3030;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", route);

dbConnection();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
