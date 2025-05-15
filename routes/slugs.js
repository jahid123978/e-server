const express = require("express");

const router = express.Router();

const { getProductBySlug } = require("../controllers/slugs");

router.route("/:slugs").get(getProductBySlug);

module.exports = router;