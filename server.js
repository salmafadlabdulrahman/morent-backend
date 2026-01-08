const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const carRouter = require("./routes/car");
const categoriesRouter = require("./routes/category");
const usersRouter = require("./routes/user");
const authJwt = require("./auth/jwt");

const app = express();

app.use(authJwt());
app.use(express.json());
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/users", usersRouter);

/*Todo:
2- Queries for capacity, pagination
3- handle the reviews of each user - forget password - reset password 
4- stuff for later (integrate stripe, and send mails to the user's email to confirm rental 
and alert about deadline, )
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
