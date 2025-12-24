// Dummy Payment Gateway Configuration
// This is a mock payment system for development/testing purposes

const dummyPaymentGateway = {
  createOrder: async (amount, currency = "INR", receipt) => {
    // Generate a unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: orderId,
      amount: amount,
      currency: currency,
      receipt: receipt,
      status: "created",
      created_at: new Date().toISOString(),
    };
  },

  verifyPayment: async (orderId, paymentId, signature) => {
    // In a real system, verify the signature
    // For dummy system, always return success
    return {
      success: true,
      orderId: orderId,
      paymentId: paymentId,
      status: "success",
    };
  },

  generateQRCode: (orderId, amount) => {
    // Generate a dummy QR code data (UPI format)
    const upiId = "merchant@bank";
    const merchantName = "LMS Platform";
    const qrData = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount / 100}&cu=INR&tn=Payment for Order ${orderId}`;
    return qrData;
  },
};

module.exports = dummyPaymentGateway;
