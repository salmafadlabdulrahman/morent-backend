const express = require("express");
const router = express.Router();

const Car = require("../models/Car");

router.get("/", async (req, res) => {
  const cars = await Car.find();
  if (!cars) {
    res.status(500).json({
      success: false,
      message: "no cars exist",
      error: error.message,
    });
  }
  res.status(200).json(cars);
});

router.get("/:id", async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(500).json({
      success: false,
      message: "Car not found!",
      error: error.message,
    });
  }
  res.status(200).json(car);
});

router.post("/", async (req, res) => {
  try {
    let car = new Car({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      carType: req.body.carType,
      capacity: req.body.capacity,
      steering: req.body.steering,
      gasoline: req.body.gasoline,
    });

    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.log("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create car",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        carType: req.body.carType,
        capacity: req.body.capacity,
        steering: req.body.steering,
        gasoline: req.body.gasoline,
      },
      { new: true }
    );
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
    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete car",
        error: error.message,
      });
  }
});

module.exports = router;
