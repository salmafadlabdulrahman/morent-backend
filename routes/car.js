const express = require("express");

const Car = require("../models/Car");
const Category = require("../models/Category");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const cars = await Car.find(filter).populate("category");
    console.log(filter);
    console.log(cars.length);

    if (cars.length === 0) {
      return res.status(400).json({
        message: "no cars exist",
      });
    }
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to gets cars",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("category", "name");
    if (!car) {
      console.log(car);
      return res.status(400).json({
        message: "Car not found!",
      });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch car",
      error: error.message,
    });
  }
});

router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const categoryExists = await Category.findById(req.body.category);
    console.log(categoryExists);

    if (!categoryExists) {
      return res.status(400).json({ message: "Category doesn't exist" });
    }

    if (!req.files || req.files.length !== 3) {
      console.log(req.files);
      return res.status(400).json({ message: "3 images are required" });
    }

    const imageUrls = req.files.map((file) => file.path);

    let car = new Car({
      name: req.body.name,
      description: req.body.description,
      images: imageUrls,
      price: req.body.price,
      category: req.body.category,
      capacity: req.body.capacity,
      steering: req.body.steering,
      gasoline: req.body.gasoline,
    });

    const newCar = await car.save();
    const populatedCar = await Car.findById(newCar._id).populate(
      "category",
      "name"
    );
    res.status(201).json(populatedCar);
  } catch (error) {
    console.log("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create car",
      error: error.message,
    });
  }
});

router.put("/:id", upload.array("images", 3), async (req, res) => {
  try {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid Category" });
    }

    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({ message: "3 images are required" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: imageUrls,
        price: req.body.price,
        category: req.body.category,
        capacity: req.body.capacity,
        steering: req.body.steering,
        gasoline: req.body.gasoline,
      },
      { new: true }
    ).populate("category", "name");
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update car!",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(400).json({ message: "Car Not Found" });
    }
    res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete car",
      error: error.message,
    });
  }
});

module.exports = router;
