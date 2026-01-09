const express = require("express");
const router = express.Router();

const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getCars);
router.post("/", upload.array("images", 3), createCar);
router.get("/:id", getCarById);
router.put("/:id", upload.array("images", 3), updateCar);
router.delete("/:id", upload.array("images", 3), deleteCar);

module.exports = router;
