const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Razorpay: Create order
const createRazorpayOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      courseId,
      courseTitle,
      coursePricing,
      courseImage,
      instructorId,
      instructorName,
    } = req.body;

    const options = {
      amount: Number(coursePricing) * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId,
        courseTitle,
        userId,
        userName,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create pending order in database
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderDate: new Date(),
      paymentId: order.id, // Razorpay order ID
      payerId: "",
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        dbOrderId: newOrder._id,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating Razorpay order!",
    });
  }
};

// Razorpay: Verify payment and finalize order
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
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

    // Update order in database
    const order = await Order.findById(dbOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpay_payment_id;
    order.payerId = razorpay_order_id;

    await order.save();

    // Update student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    // Add student to course
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("Razorpay payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error while verifying payment!",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
