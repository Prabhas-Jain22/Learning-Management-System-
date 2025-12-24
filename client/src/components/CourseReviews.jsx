import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  addReviewService,
  getCourseReviewsService,
  deleteReviewService,
} from "@/services";
import { toast } from "@/hooks/use-toast";

export const CourseReviews = ({ courseId, userId, userName, userEmail }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await getCourseReviewsService(courseId);
      if (response.success) {
        setReviews(response.data);
        // Check if current user has already reviewed
        const userReview = response.data.find((r) => r.userId === userId);
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addReviewService({
        courseId,
        userId,
        userName,
        userEmail,
        rating,
        comment,
      });

      if (response.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
        setRating(0);
        setComment("");
        fetchReviews();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteReviewService(reviewId);
      if (response.success) {
        toast({
          title: "Review deleted",
          description: "Your review has been removed",
        });
        fetchReviews();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (count, isInteractive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`w-6 h-6 ${
            (isInteractive ? hoverRating || rating : count) >= starValue
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${isInteractive ? "cursor-pointer" : ""}`}
          onClick={() => isInteractive && setRating(starValue)}
          onMouseEnter={() => isInteractive && setHoverRating(starValue)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
        />
      );
    });
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews & Ratings</span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{averageRating}</span>
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Review Form */}
        {!hasReviewed && userId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">Your rating:</span>
              <div className="flex">{renderStars(rating, true)}</div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this course..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <Button onClick={handleSubmitReview} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                  {review.userId === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
