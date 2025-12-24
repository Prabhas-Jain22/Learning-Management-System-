const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const dummyPaymentGateway = require("../../helpers/razorpay");

// Create Payment Order
const createPaymentOrder = async (req, res) => {
  try {
    const { userId, userName, userEmail, courseId, coursePricing, courseTitle } = req.body;

    // Validate required fields
    if (!userId || !courseId || !coursePricing) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Convert price to paise (smallest currency unit)
    const amount = Math.round(parseFloat(coursePricing) * 100);

    // Create order using dummy payment gateway
    const paymentOrder = await dummyPaymentGateway.createOrder(
      amount,
      "INR",
      `receipt_${Date.now()}`
    );

    // Create order in database
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod: "dummy_gateway",
      paymentStatus: "pending",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      courseImage: course.image,
      courseTitle: course.title,
      courseId: course._id,
      coursePricing: coursePricing,
    });

    await newOrder.save();

    // Generate QR code data
    const qrCodeData = dummyPaymentGateway.generateQRCode(paymentOrder.id, amount);

    res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      data: {
        orderId: paymentOrder.id,
        amount: amount,
        currency: paymentOrder.currency,
        dbOrderId: newOrder._id,
        qrCodeData: qrCodeData,
        courseTitle: courseTitle,
        coursePricing: coursePricing,
      },
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Process Payment (Simulate payment completion)
const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, dbOrderId, cardDetails, netBankingDetails } = req.body;

    if (!orderId || !dbOrderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // Find the order in database
    const order = await Order.findById(dbOrderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Simulate payment verification
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const verificationResult = await dummyPaymentGateway.verifyPayment(
      orderId,
      paymentId,
      "dummy_signature"
    );

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod || "dummy_gateway";
    await order.save();

    // Check if student already has this course
    let studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      // Check if course already exists
      const courseExists = studentCourses.courses.some(
        (course) => course.courseId.toString() === order.courseId.toString()
      );

      if (!courseExists) {
        studentCourses.courses.push({
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        });
        await studentCourses.save();
      }
    } else {
      // Create new student courses entry
      studentCourses = new StudentCourses({
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
      await studentCourses.save();
    }

    // Update course students array
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing.toString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      data: {
        orderId: order._id,
        paymentId: paymentId,
        courseId: order.courseId,
        paymentStatus: "paid",
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    });
  }
};

// Get Payment Status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        amount: order.coursePricing,
        courseTitle: order.courseTitle,
      },
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  processPayment,
  getPaymentStatus,
};
