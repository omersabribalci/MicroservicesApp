const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/stock", updateProductStock);
router.delete("/:id", deleteProduct);

module.exports = router;
