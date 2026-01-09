//Connect with mongo and run server only

require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.CONNECTION_DB)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("server running on port 3000");
});
