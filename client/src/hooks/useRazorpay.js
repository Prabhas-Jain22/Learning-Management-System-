import { 
  createRazorpayOrderService, 
  verifyRazorpayPaymentService,
  createFinePaymentOrderService,
  verifyFinePaymentService 
} from "@/services";

/**
 * Custom hook for Razorpay payment integration
 * @returns {Function} handleRazorpayPayment - Function to initiate Razorpay payment
 */
export const useRazorpay = () => {
  /**
   * Load Razorpay script dynamically
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Handle Razorpay payment process
   * @param {Number} amount - Amount to pay
   * @param {String} userId - User ID
   * @param {String} userName - User Name
   * @param {String} userEmail - User Email
   * @param {String} description - Payment description
   * @param {String} type - Payment type ("course" or "fine")
   * @param {Array|String} metadata - Course ID or array of issue IDs
   */
  const handleRazorpayPayment = async (
    amount,
    userId,
    userName,
    userEmail,
    description,
    type = "course",
    metadata = null
  ) => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      let orderResponse;

      // Create order based on type
      if (type === "fine") {
        orderResponse = await createFinePaymentOrderService({
          userId,
          issueIds: metadata, // Array of issue IDs
          amount,
        });
      } else {
        orderResponse = await createRazorpayOrderService({
          userId,
          courseId: metadata, // Course ID
          amount,
          userName,
          userEmail,
          courseTitle: description,
        });
      }

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const { orderId, amount: orderAmount, currency, key, dbOrderId } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key, // Razorpay Key ID from backend
        amount: orderAmount,
        currency: currency,
        name: "LMS Platform",
        description: description,
        order_id: orderId,
        handler: async function (response) {
          try {
            let verifyResponse;

            // Verify payment based on type
            if (type === "fine") {
              verifyResponse = await verifyFinePaymentService({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                issueIds: metadata,
              });
            } else {
              verifyResponse = await verifyRazorpayPaymentService({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: dbOrderId,
              });
            }

            if (!verifyResponse.success) {
              throw new Error(verifyResponse.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            throw error;
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            throw new Error("Payment cancelled by user");
          },
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      throw error;
    }
  };

  return { handleRazorpayPayment };
};
