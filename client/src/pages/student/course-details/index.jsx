import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { createPaymentOrderService } from "@/services";
import { WishlistButton } from "@/components/WishlistButton";
import { CourseReviews } from "@/components/CourseReviews";
import { CheckCircle, Globe, Lock, PlayCircle, CreditCard, Loader2, IndianRupee, Zap, QrCode } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handlePaymentClick() {
    if (!auth?.user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to purchase a course",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const paymentData = {
        userId: auth?.user?._id,
        userName: auth?.user?.userName,
        userEmail: auth?.user?.userEmail,
        courseId: studentViewCourseDetails?._id,
        courseTitle: studentViewCourseDetails?.title,
        coursePricing: studentViewCourseDetails?.pricing,
        courseImage: studentViewCourseDetails?.image,
        instructorId: studentViewCourseDetails?.instructorId,
        instructorName: studentViewCourseDetails?.instructorName,
      };

      const response = await createPaymentOrderService(paymentData);

      if (response.success) {
        // Navigate to payment gateway page with order details
        const { orderId, amount, dbOrderId, qrCodeData } = response.data;
        const queryParams = new URLSearchParams({
          orderId,
          amount,
          courseTitle: studentViewCourseDetails?.title,
          qrCodeData,
          dbOrderId,
        });
        
        navigate(`/payment-gateway?${queryParams.toString()}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold flex-1">
            {studentViewCourseDetails?.title}
          </h1>
          {auth?.user && studentViewCourseDetails && (
            <WishlistButton
              courseData={studentViewCourseDetails}
              userId={auth.user._id}
            />
          )}
        </div>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold flex items-center">
                  <IndianRupee className="h-7 w-7" />
                  {studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button 
                onClick={handlePaymentClick} 
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Initiating Payment...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6" fill="currentColor" />
                    Buy Now - Instant Access
                  </>
                )}
              </Button>
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                  <Lock className="h-3 w-3" />
                  Secure Payment • Multiple Options Available
                </p>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    UPI/QR
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Cards
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Net Banking
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      
      {/* Reviews Section */}
      {auth?.user && studentViewCourseDetails && (
        <CourseReviews
          courseId={studentViewCourseDetails._id}
          userId={auth.user._id}
          userName={auth.user.userName}
          userEmail={auth.user.userEmail}
        />
      )}
      
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem) => (
                <p
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
