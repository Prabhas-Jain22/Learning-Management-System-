const Review = require("../../models/Review");
const Course = require("../../models/Course");

// Add a review
const addReview = async (req, res) => {
  try {
    const { courseId, userId, userName, userEmail, rating, comment } = req.body;

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({ courseId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    const newReview = new Review({
      courseId,
      userId,
      userName,
      userEmail,
      rating,
      comment,
    });

    await newReview.save();

    // Update course average rating
    const allReviews = await Review.find({ courseId });
    const avgRating =
      allReviews.reduce((acc, review) => acc + review.rating, 0) /
      allReviews.length;

    await Course.findByIdAndUpdate(courseId, {
      averageRating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// Get reviews for a course
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update course average rating
    const allReviews = await Review.find({ courseId: review.courseId });
    const avgRating =
      allReviews.reduce((acc, review) => acc + review.rating, 0) /
      allReviews.length;

    await Course.findByIdAndUpdate(review.courseId, {
      averageRating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update course average rating
    const allReviews = await Review.find({ courseId: review.courseId });
    const avgRating = allReviews.length
      ? allReviews.reduce((acc, review) => acc + review.rating, 0) /
        allReviews.length
      : 0;

    await Course.findByIdAndUpdate(review.courseId, {
      averageRating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  addReview,
  getCourseReviews,
  updateReview,
  deleteReview,
};
