import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Building2,
  QrCode,
  CheckCircle,
  Loader2,
  AlertCircle,
  IndianRupee,
  Lock,
} from "lucide-react";
import QRCodeCanvas from "./QRCodeCanvas";

export default function PaymentGatewayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");

  // Payment details from URL params
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const courseTitle = searchParams.get("courseTitle");
  const qrCodeData = searchParams.get("qrCodeData");
  const dbOrderId = searchParams.get("dbOrderId");

  // Card payment form
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  // Net banking form
  const [selectedBank, setSelectedBank] = useState("");

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
  ];

  useEffect(() => {
    if (!orderId || !amount || !dbOrderId) {
      toast({
        title: "Invalid Payment",
        description: "Missing payment details",
        variant: "destructive",
      });
      navigate("/courses");
    }
  }, [orderId, amount, dbOrderId, navigate, toast]);

  const handleCardPayment = async (e) => {
    e.preventDefault();
    
    // Validate card details
    if (!cardForm.cardNumber || !cardForm.cardHolder || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cvv) {
      toast({
        title: "Validation Error",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }

    if (cardForm.cardNumber.length !== 16) {
      toast({
        title: "Invalid Card Number",
        description: "Card number must be 16 digits",
        variant: "destructive",
      });
      return;
    }

    if (cardForm.cvv.length !== 3) {
      toast({
        title: "Invalid CVV",
        description: "CVV must be 3 digits",
        variant: "destructive",
      });
      return;
    }

    await processPayment("card", {
      ...cardForm,
      cardNumber: `**** **** **** ${cardForm.cardNumber.slice(-4)}`,
    });
  };

  const handleNetBankingPayment = async () => {
    if (!selectedBank) {
      toast({
        title: "Select Bank",
        description: "Please select your bank",
        variant: "destructive",
      });
      return;
    }

    await processPayment("netbanking", { bank: selectedBank });
  };

  const handleQRPayment = async () => {
    // Simulate QR code scan payment
    await processPayment("qr", { method: "UPI QR Code" });
  };

  const processPayment = async (paymentMethod, details) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/student/order/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          dbOrderId,
          paymentMethod,
          cardDetails: paymentMethod === "card" ? details : null,
          netBankingDetails: paymentMethod === "netbanking" ? details : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful!",
          description: `Your payment of ₹${(amount / 100).toFixed(2)} has been processed`,
        });

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate(`/student-courses`);
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.slice(0, 16);
    return limited.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your enrollment in <span className="font-semibold">{courseTitle}</span> is confirmed
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
              <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-1">
                <IndianRupee className="h-6 w-6" />
                {(amount / 100).toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to your courses...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Lock className="h-8 w-8 text-blue-600" />
            Secure Payment Gateway
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your payment to enroll in the course</p>
        </div>

        {/* Course and Amount Info */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course</p>
                <p className="font-semibold text-lg">{courseTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
                <p className="text-3xl font-bold text-blue-600 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" />
                  {(amount / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Choose Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="netbanking" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Net Banking
                </TabsTrigger>
              </TabsList>

              {/* QR Code Payment */}
              <TabsContent value="qr">
                <div className="text-center py-6">
                  <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-4">
                    <QRCodeCanvas value={qrCodeData || `PAYMENT:${orderId}:${amount}`} size={220} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Scan to Pay</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Scan this QR code using any UPI app
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Google Pay • PhonePe • Paytm • BHIM • Other UPI apps
                  </p>
                  <Button
                    onClick={handleQRPayment}
                    disabled={loading}
                    size="lg"
                    className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        I've Made the Payment
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Card Payment */}
              <TabsContent value="card">
                <form onSubmit={handleCardPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardForm.cardNumber)}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          cardNumber: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      placeholder="JOHN DOE"
                      value={cardForm.cardHolder}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cardHolder: e.target.value.toUpperCase() })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select
                        value={cardForm.expiryMonth}
                        onValueChange={(value) =>
                          setCardForm({ ...cardForm, expiryMonth: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select
                        value={cardForm.expiryYear}
                        onValueChange={(value) =>
                          setCardForm({ ...cardForm, expiryYear: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            cvv: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      Your card information is encrypted and secure. We never store your card details.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay ₹{(amount / 100).toFixed(2)}
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Net Banking */}
              <TabsContent value="netbanking">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Select Your Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {bank}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      You will be redirected to your bank's website to complete the payment securely.
                    </p>
                  </div>

                  <Button
                    onClick={handleNetBankingPayment}
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting to Bank...
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-5 w-5" />
                        Continue to Bank
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
