const express = require("express");
const {
  addReview,
  getCourseReviews,
  updateReview,
  deleteReview,
} = require("../../controllers/student-controller/review-controller");

const router = express.Router();

router.post("/add", addReview);
router.get("/get/:courseId", getCourseReviews);
router.put("/update/:reviewId", updateReview);
router.delete("/delete/:reviewId", deleteReview);

module.exports = router;
