const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
