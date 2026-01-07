const express = require("express");
const router = express.Router();

const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories.length) {
      return res.status(200).json({ message: "No categories found!" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(200).json({ message: "Category doesn't exist" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
    });
    category = await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create new category",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    category = await category.save();
    res.status(201).json({ message: "category updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update a category",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Failed to find category" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete a category",
      error: error.message,
    });
  }
});

module.exports = router;
