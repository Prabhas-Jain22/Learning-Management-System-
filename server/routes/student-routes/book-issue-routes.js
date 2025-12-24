const express = require("express");
const {
  issueBook,
  returnBook,
  getUserIssuedBooks,
  getUserBookHistory,
  getUserPendingFines,
} = require("../../controllers/student-controller/book-issue-controller");
const {
  createFinePaymentOrder,
  verifyFinePayment,
} = require("../../controllers/student-controller/fine-payment-controller");

const router = express.Router();

// Book issue/return routes
router.post("/issue", issueBook);
router.put("/return/:issueId", returnBook);
router.get("/issued/:userId", getUserIssuedBooks);
router.get("/history/:userId", getUserBookHistory);
router.get("/fines/:userId", getUserPendingFines);

// Fine payment routes
router.post("/fine/create-payment", createFinePaymentOrder);
router.post("/fine/verify-payment", verifyFinePayment);

module.exports = router;
