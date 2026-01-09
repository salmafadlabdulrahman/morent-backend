const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    profileImg: {
      type: String,
      default: "https://www.pngmart.com/files/23/Profile-PNG-HD.png"
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password is too short!"],
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
