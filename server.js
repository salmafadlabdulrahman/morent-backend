const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const carRouter = require("./routes/car");
const categoriesRouter = require("./routes/category");

const app = express();

app.use(express.json());

app.use("/api/cars", carRouter);
app.use("/api/categories", categoriesRouter);

/*Todo:
1- handle the image upload - multer
2- handle the authentication and the log in / sign up
3- handle the reviews of each user
4- stuff for later (integrate stripe, and send mails to the user's email to confirm rental 
and alert about deadline, pagination)

*/

mongoose
  .connect(process.env.CONNECTION_DB)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("server running on port 3000");
});
