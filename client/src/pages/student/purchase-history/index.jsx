import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { IndianRupee, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PurchaseHistoryPage() {
  const { auth } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      fetchPurchases();
    }
  }, [auth?.user]);

  const fetchPurchases = async () => {
    try {
      const response = await fetchStudentBoughtCoursesService(auth.user._id);
      if (response.success) {
        setPurchases(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading purchase history...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Purchase History</h1>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No purchases yet</p>
            <p className="text-gray-400 mt-2">
              Start learning by purchasing your first course!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((course) => (
            <Card
              key={course.courseId}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/course-progress/${course.courseId}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={course.courseImage}
                    alt={course.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {course.instructorName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(course.dateOfPurchase).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">Amount Paid</div>
                    <div className="text-xl font-bold flex items-center justify-end">
                      <IndianRupee className="h-5 w-5" />
                      {/* Note: You may need to add pricing info to StudentCourses model */}
                      <span>Purchased</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistoryPage;
