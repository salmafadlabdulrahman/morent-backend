const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res
        .status(400)
        .json({ message: "No users found", success: false });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find user",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      console.log(user);
      return res.status(400).json({
        message: "User not found!",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin,
    });

    if (!user) {
      res.status(400).json({ message: "user can't be created" });
    }

    user = await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.messages
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    //1- check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "user can't be found" });
    }

    //2- if the user exists, compare the password they logged in and if they're the same
    //3- generate a token for them
    //4- if the user is admin, then add it to the token. because later
    // some routes will only be available to admin only. and we want to be able to tell that from the token
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "user authenticated",
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ mesage: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Password are required" });
    }
    let user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(201)
      .json({ message: "Account created successfully", token: token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

module.exports = router;
