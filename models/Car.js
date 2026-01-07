const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  steering: {
    type: String,
    enum: ["Manual", "Electric"],
    default: "Manual",
  },
  gasoline: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Car", carSchema);
