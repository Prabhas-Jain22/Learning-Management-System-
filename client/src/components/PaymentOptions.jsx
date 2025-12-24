import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRazorpay } from "@/hooks/useRazorpay";
import { createPaymentService } from "@/services";
import { CreditCard, Loader2 } from "lucide-react";

/**
 * Payment options component with both PayPal and Razorpay
 * This is an example component showing how to integrate both payment gateways
 */
export const PaymentOptions = ({
  courseData,
  userData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { handleRazorpayPayment } = useRazorpay();

  // Handle PayPal payment
  const handlePayPalPayment = async () => {
    try {
      setIsProcessing(true);
      setSelectedMethod("paypal");

      const paymentPayload = {
        userId: userData._id,
        userName: userData.userName,
        userEmail: userData.userEmail,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "initiated",
        orderDate: new Date(),
        paymentId: "",
        payerId: "",
        instructorId: courseData.instructorId,
        instructorName: courseData.instructorName,
        courseImage: courseData.image,
        courseTitle: courseData.title,
        courseId: courseData._id,
        coursePricing: courseData.pricing,
      };

      const response = await createPaymentService(paymentPayload);

      if (response.success) {
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(response.data.orderId)
        );
        // Redirect to PayPal
        window.location.href = response.data.approveUrl;
      } else {
        throw new Error(response.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("PayPal payment error:", error);
      onPaymentError && onPaymentError(error);
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPaymentClick = async () => {
    try {
      setIsProcessing(true);
      setSelectedMethod("razorpay");

      const paymentData = {
        userId: userData._id,
        userName: userData.userName,
        userEmail: userData.userEmail,
        courseId: courseData._id,
        courseTitle: courseData.title,
        coursePricing: courseData.pricing,
        courseImage: courseData.image,
        instructorId: courseData.instructorId,
        instructorName: courseData.instructorName,
      };

      await handleRazorpayPayment(
        paymentData,
        (order) => {
          // Success callback
          setIsProcessing(false);
          setSelectedMethod(null);
          onPaymentSuccess && onPaymentSuccess(order);
        },
        (error) => {
          // Error callback
          setIsProcessing(false);
          setSelectedMethod(null);
          onPaymentError && onPaymentError(error);
        }
      );
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setIsProcessing(false);
      setSelectedMethod(null);
      onPaymentError && onPaymentError(error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          {/* PayPal Button */}
          <Button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
            size="lg"
          >
            {isProcessing && selectedMethod === "paypal" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with PayPal
              </>
            )}
          </Button>

          {/* Razorpay Button */}
          <Button
            onClick={handleRazorpayPaymentClick}
            disabled={isProcessing}
            className="w-full bg-[#528ff0] hover:bg-[#3d7dd4] text-white"
            size="lg"
          >
            {isProcessing && selectedMethod === "razorpay" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Razorpay
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Secure payment powered by PayPal and Razorpay
        </p>
      </CardContent>
    </Card>
  );
};
