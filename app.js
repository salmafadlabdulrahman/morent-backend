//App.js will be holding the configurations, the middleware, register routes
const express = require("express");
const authJwt = require("./auth/jwt");
const carRouter = require("./routes/carRoutes");
const categoriesRouter = require("./routes/categoryRoutes");
const usersRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(authJwt());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app;
