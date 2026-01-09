const User = require("../models/User");

const getUsers = async (req, res) => {
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
};

const getUserById = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
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
      error: error.messages,
    });
  }
};

const addUser = async (req, res) => {
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
};

module.exports = { getUsers, getUserById, deleteUser };
