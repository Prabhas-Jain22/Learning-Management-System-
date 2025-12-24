const express = require("express");
const {
  createPaymentOrder,
  processPayment,
  getPaymentStatus,
} = require("../../controllers/student-controller/payment-controller");

const router = express.Router();

// Dummy Payment Gateway routes
router.post("/create", createPaymentOrder);
router.post("/process", processPayment);
router.get("/status/:orderId", getPaymentStatus);

module.exports = router;
