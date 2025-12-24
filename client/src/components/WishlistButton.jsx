import React, { useState, useEffect } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addToWishlistService,
  checkWishlistStatusService,
  removeFromWishlistService,
} from "@/services";
import { toast } from "@/hooks/use-toast";

export const WishlistButton = ({ courseData, userId }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId && courseData._id) {
      checkWishlistStatus();
    }
  }, [userId, courseData._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await checkWishlistStatusService(userId, courseData._id);
      if (response.success) {
        setInWishlist(response.data.inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Login required",
        description: "Please login to add courses to wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (inWishlist) {
        const response = await removeFromWishlistService(userId, courseData._id);
        if (response.success) {
          setInWishlist(false);
          toast({
            title: "Removed from wishlist",
            description: "Course has been removed from your wishlist",
          });
        }
      } else {
        const response = await addToWishlistService({
          userId,
          courseId: courseData._id,
          title: courseData.title,
          instructorName: courseData.instructorName,
          courseImage: courseData.image,
          coursePricing: courseData.pricing,
        });
        if (response.success) {
          setInWishlist(true);
          toast({
            title: "Added to wishlist",
            description: "Course has been added to your wishlist",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={inWishlist ? "default" : "outline"}
      size="icon"
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={`${
        inWishlist
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "border-gray-300 hover:border-red-500"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`}
        />
      )}
    </Button>
  );
};
