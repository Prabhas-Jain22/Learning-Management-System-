const express = require("express");
const {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} = require("../../controllers/student-controller/wishlist-controller");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/get/:userId", getUserWishlist);
router.delete("/remove/:userId/:courseId", removeFromWishlist);
router.get("/check/:userId/:courseId", checkWishlistStatus);

module.exports = router;
