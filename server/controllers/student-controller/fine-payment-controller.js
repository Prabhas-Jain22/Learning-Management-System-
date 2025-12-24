const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");
const BookIssue = require("../../models/BookIssue");

// Create Razorpay order for fine payment
const createFinePaymentOrder = async (req, res) => {
  try {
    const { userId, userName, userEmail, issueIds, totalFine } = req.body;

    const options = {
      amount: Number(totalFine) * 100, // amount in paise
      currency: "INR",
      receipt: `fine_${Date.now()}`,
      notes: {
        userId,
        userName,
        type: "library_fine",
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        issueIds,
      },
    });
  } catch (error) {
    console.error("Fine payment order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating fine payment order!",
    });
  }
};

// Verify fine payment
const verifyFinePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      issueIds,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update fine status for all issues
    await BookIssue.updateMany(
      { _id: { $in: issueIds } },
      {
        fineStatus: "paid",
        finePaymentId: razorpay_payment_id,
      }
    );

    res.status(200).json({
      success: true,
      message: "Fine payment verified successfully",
    });
  } catch (error) {
    console.error("Fine payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error while verifying fine payment!",
    });
  }
};

module.exports = {
  createFinePaymentOrder,
  verifyFinePayment,
};
