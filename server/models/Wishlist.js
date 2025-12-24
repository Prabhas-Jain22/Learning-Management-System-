const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [
    {
      courseId: String,
      title: String,
      instructorName: String,
      courseImage: String,
      coursePricing: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
