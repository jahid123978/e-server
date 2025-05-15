const express = require("express");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");


router.route("/").get(getAllCategories);
router.route("/:id").get(getCategory);



module.exports = router;
