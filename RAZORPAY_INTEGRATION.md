# Razorpay Integration Guide

This guide explains how to use the Razorpay payment integration in your MERN LMS project.

## Table of Contents
1. [Setup](#setup)
2. [Configuration](#configuration)
3. [Server-Side Implementation](#server-side-implementation)
4. [Client-Side Implementation](#client-side-implementation)
5. [Testing](#testing)
6. [Usage Examples](#usage-examples)

---

## Setup

### 1. Install Dependencies

The Razorpay SDK has already been installed on the server:
```bash
npm install razorpay
```

### 2. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate API keys (Test Mode for development)
4. Copy your **Key ID** and **Key Secret**

---

## Configuration

### Server Configuration

Update your `.env` file in the `server` directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Important**: 
- Use `rzp_test_` prefixed keys for testing
- Use `rzp_live_` prefixed keys for production
- Never commit `.env` file to version control

---

## Server-Side Implementation

### Files Created/Modified:

1. **`server/helpers/razorpay.js`** - Razorpay instance configuration
2. **`server/controllers/student-controller/order-controller.js`** - Payment controllers
3. **`server/routes/student-routes/order-routes.js`** - API routes

### API Endpoints

#### 1. Create Razorpay Order
```
POST /student/order/razorpay/create
```

**Request Body:**
```json
{
  "userId": "user_id",
  "userName": "User Name",
  "userEmail": "user@email.com",
  "courseId": "course_id",
  "courseTitle": "Course Title",
  "coursePricing": 1999,
  "courseImage": "image_url",
  "instructorId": "instructor_id",
  "instructorName": "Instructor Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_razorpay_order_id",
    "amount": 199900,
    "currency": "INR",
    "dbOrderId": "mongodb_order_id",
    "key": "rzp_test_key_id"
  }
}
```

#### 2. Verify Razorpay Payment
```
POST /student/order/razorpay/verify
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature",
  "dbOrderId": "mongodb_order_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and order confirmed",
  "data": {
    // Order details
  }
}
```

---

## Client-Side Implementation

### Files Created:

1. **`client/src/hooks/useRazorpay.js`** - React hook for Razorpay
2. **`client/src/components/PaymentOptions.jsx`** - Payment component example
3. **`client/src/services/index.js`** - Service functions (modified)

### Using the Razorpay Hook

```javascript
import { useRazorpay } from "@/hooks/useRazorpay";

function MyComponent() {
  const { handleRazorpayPayment } = useRazorpay();

  const initiatePayment = async () => {
    const paymentData = {
      userId: "user_id",
      userName: "User Name",
      userEmail: "user@email.com",
      courseId: "course_id",
      courseTitle: "Course Title",
      coursePricing: 1999,
      courseImage: "image_url",
      instructorId: "instructor_id",
      instructorName: "Instructor Name",
    };

    await handleRazorpayPayment(
      paymentData,
      (order) => {
        // Success callback
        console.log("Payment successful!", order);
        // Redirect to course or show success message
      },
      (error) => {
        // Error callback
        console.error("Payment failed:", error);
        // Show error message to user
      }
    );
  };

  return <button onClick={initiatePayment}>Pay Now</button>;
}
```

### Using the PaymentOptions Component

The `PaymentOptions` component provides both PayPal and Razorpay options:

```javascript
import { PaymentOptions } from "@/components/PaymentOptions";

function CourseCheckout() {
  const courseData = {
    _id: "course_id",
    title: "Course Title",
    pricing: 1999,
    image: "image_url",
    instructorId: "instructor_id",
    instructorName: "Instructor Name",
  };

  const userData = {
    _id: "user_id",
    userName: "User Name",
    userEmail: "user@email.com",
  };

  return (
    <PaymentOptions
      courseData={courseData}
      userData={userData}
      onPaymentSuccess={(order) => {
        console.log("Payment successful!", order);
        // Navigate to course page
      }}
      onPaymentError={(error) => {
        console.error("Payment failed:", error);
        // Show error message
      }}
    />
  );
}
```

---

## Testing

### Test Mode

1. Use test API keys (`rzp_test_...`)
2. Razorpay provides test card numbers for testing:

**Test Cards:**
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Testing Flow

1. Create an order
2. Razorpay checkout opens
3. Enter test card details
4. Payment succeeds/fails
5. Verification happens automatically
6. Order is confirmed in database

---

## Usage Examples

### Example 1: Simple Integration

```javascript
import { useRazorpay } from "@/hooks/useRazorpay";
import { Button } from "@/components/ui/button";

export default function BuyCourseButton({ course, user }) {
  const { handleRazorpayPayment } = useRazorpay();

  const buyNow = async () => {
    await handleRazorpayPayment(
      {
        userId: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        courseId: course._id,
        courseTitle: course.title,
        coursePricing: course.pricing,
        courseImage: course.image,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
      },
      (order) => {
        alert("Course purchased successfully!");
        window.location.href = `/course-progress/${course._id}`;
      },
      (error) => {
        alert("Payment failed. Please try again.");
      }
    );
  };

  return <Button onClick={buyNow}>Buy Now - ₹{course.pricing}</Button>;
}
```

### Example 2: With Loading State

```javascript
import { useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PaymentButton({ course, user }) {
  const [loading, setLoading] = useState(false);
  const { handleRazorpayPayment } = useRazorpay();

  const handlePayment = async () => {
    setLoading(true);
    
    await handleRazorpayPayment(
      {
        userId: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        courseId: course._id,
        courseTitle: course.title,
        coursePricing: course.pricing,
        courseImage: course.image,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
      },
      (order) => {
        setLoading(false);
        // Handle success
      },
      (error) => {
        setLoading(false);
        // Handle error
      }
    );
  };

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₹${course.pricing}`
      )}
    </Button>
  );
}
```

---

## Currency Notes

- Razorpay amounts are in **paise** (smallest currency unit)
- ₹1999 = 199900 paise
- Conversion happens automatically in the backend

---

## Security Notes

1. **Never expose Key Secret** in client-side code
2. **Always verify payments** on the server-side
3. **Use HTTPS** in production
4. **Validate signatures** to prevent tampering
5. **Store sensitive data** in environment variables

---

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Enable HTTPS
- [ ] Set up webhooks for payment events
- [ ] Implement proper error logging
- [ ] Add payment confirmation emails
- [ ] Test with real small amounts
- [ ] Set up payment reconciliation

---

## Support

For issues with Razorpay integration:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

---

## Comparison: PayPal vs Razorpay

| Feature | PayPal | Razorpay |
|---------|--------|----------|
| Currency | USD (international) | INR (India-focused) |
| Integration | Redirect to PayPal | Inline checkout |
| Payment Methods | PayPal, Cards | Cards, UPI, NetBanking, Wallets |
| Best For | International payments | Indian market |
| Settlement | 3-5 days | T+3 days |

Choose based on your target market and requirements!
