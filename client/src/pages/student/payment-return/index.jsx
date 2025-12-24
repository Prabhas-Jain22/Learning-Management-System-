import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentReturnPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Razorpay handles payment verification inline, so this page just redirects
    const timer = setTimeout(() => {
      navigate("/student-courses");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Payment Successful!</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          Redirecting to your courses...
        </p>
      </CardHeader>
    </Card>
  );
}

export default PaymentReturnPage;
