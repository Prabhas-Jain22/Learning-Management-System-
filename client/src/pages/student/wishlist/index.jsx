import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, IndianRupee } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { getUserWishlistService, removeFromWishlistService } from "@/services";
import { useRazorpay } from "@/hooks/useRazorpay";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function WishlistPage() {
  const { auth } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingCourse, setProcessingCourse] = useState(null);
  const { handleRazorpayPayment } = useRazorpay();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      fetchWishlist();
    }
  }, [auth?.user]);

  const fetchWishlist = async () => {
    try {
      const response = await getUserWishlistService(auth.user._id);
      if (response.success) {
        setWishlist(response.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (courseId) => {
    try {
      const response = await removeFromWishlistService(auth.user._id, courseId);
      if (response.success) {
        setWishlist(wishlist.filter((course) => course.courseId !== courseId));
        toast({
          title: "Removed",
          description: "Course removed from wishlist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove course",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async (course) => {
    setProcessingCourse(course.courseId);

    const paymentData = {
      userId: auth.user._id,
      userName: auth.user.userName,
      userEmail: auth.user.userEmail,
      courseId: course.courseId,
      courseTitle: course.title,
      coursePricing: course.coursePricing,
      courseImage: course.courseImage,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
    };

    await handleRazorpayPayment(
      paymentData,
      (order) => {
        setProcessingCourse(null);
        toast({
          title: "Payment Successful!",
          description: "Course purchased successfully",
        });
        handleRemove(course.courseId);
        navigate(`/course-progress/${course.courseId}`);
      },
      (error) => {
        setProcessingCourse(null);
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return <div className="p-8">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Button className="mt-4" onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) => (
            <Card key={course.courseId} className="overflow-hidden">
              <img
                src={course.courseImage}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  by {course.instructorName}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {course.coursePricing}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleBuyNow(course)}
                    disabled={processingCourse === course.courseId}
                  >
                    {processingCourse === course.courseId ? (
                      "Processing..."
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(course.courseId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
