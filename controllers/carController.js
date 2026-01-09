const Car = require("../models/Car");
const Category = require("../models/Category");

const getCars = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) {
      const categories = req.query.category.split(",");
      filter.category = { $in: categories };
    }

    if (req.query.capacity) {
      const capacities = req.query.capacity.split(",");
      filter.capacity = { $in: capacities };
    }

    if (req.query.price) {
      const maxPrice = req.query.price;
      filter.price = { $lte: Number(maxPrice) };
    }

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .populate("category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Car.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    if (cars.length === 0) {
      return res.status(400).json({
        message: "no cars exist",
      });
    }

    const response = {
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to gets cars",
      error: error.message,
    });
  }
};

const getCarById = async (req, res) => {
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
};

const createCar = async (req, res) => {
  try {
    const categoryExists = await Category.findById(req.body.category);

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
};

const updateCar = async (req, res) => {
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
};

const deleteCar = async (req, res) => {
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
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
