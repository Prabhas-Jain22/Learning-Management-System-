const Wishlist = require("../../models/Wishlist");

// Add course to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, courseId, title, instructorName, courseImage, coursePricing } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Check if course already in wishlist
      const courseExists = wishlist.courses.find(
        (course) => course.courseId === courseId
      );

      if (courseExists) {
        return res.status(400).json({
          success: false,
          message: "Course already in wishlist",
        });
      }

      wishlist.courses.push({
        courseId,
        title,
        instructorName,
        courseImage,
        coursePricing,
      });

      await wishlist.save();
    } else {
      wishlist = new Wishlist({
        userId,
        courses: [
          {
            courseId,
            title,
            instructorName,
            courseImage,
            coursePricing,
          },
        ],
      });

      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Course added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
};

// Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { courses: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

// Remove course from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.courses = wishlist.courses.filter(
      (course) => course.courseId !== courseId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Course removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
};

// Check if course is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { inWishlist: false },
      });
    }

    const inWishlist = wishlist.courses.some(
      (course) => course.courseId === courseId
    );

    res.status(200).json({
      success: true,
      data: { inWishlist },
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
    });
  }
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  checkWishlistStatus,
};
