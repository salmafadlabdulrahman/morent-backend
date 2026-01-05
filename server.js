const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const carRouter = require("./routes/car");

const app = express();

app.use(express.json());

app.use("/api/cars", carRouter);

mongoose
  .connect(process.env.CONNECTION_DB)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("server running on port 3000");
});
