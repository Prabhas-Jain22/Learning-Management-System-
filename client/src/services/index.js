import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

// Payment Gateway services
export async function createPaymentOrderService(formData) {
  const { data } = await axiosInstance.post(
    `/student/order/create`,
    formData
  );

  return data;
}

// Razorpay services
export async function createRazorpayOrderService(formData) {
  const { data } = await axiosInstance.post(
    `/student/order/create`,
    formData
  );

  return data;
}

export async function verifyRazorpayPaymentService(paymentData) {
  const { data } = await axiosInstance.post(
    `/student/order/process`,
    paymentData
  );

  return data;
}

export async function processPaymentService(paymentData) {
  const { data } = await axiosInstance.post(
    `/student/order/process`,
    paymentData
  );

  return data;
}

export async function getPaymentStatusService(orderId) {
  const { data } = await axiosInstance.get(
    `/student/order/status/${orderId}`
  );

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

// Wishlist services
export async function addToWishlistService(wishlistData) {
  const { data } = await axiosInstance.post(`/student/wishlist/add`, wishlistData);
  return data;
}

export async function getUserWishlistService(userId) {
  const { data } = await axiosInstance.get(`/student/wishlist/get/${userId}`);
  return data;
}

export async function removeFromWishlistService(userId, courseId) {
  const { data } = await axiosInstance.delete(`/student/wishlist/remove/${userId}/${courseId}`);
  return data;
}

export async function checkWishlistStatusService(userId, courseId) {
  const { data } = await axiosInstance.get(`/student/wishlist/check/${userId}/${courseId}`);
  return data;
}

// Review services
export async function addReviewService(reviewData) {
  const { data } = await axiosInstance.post(`/student/review/add`, reviewData);
  return data;
}

export async function getCourseReviewsService(courseId) {
  const { data } = await axiosInstance.get(`/student/review/get/${courseId}`);
  return data;
}

export async function updateReviewService(reviewId, reviewData) {
  const { data } = await axiosInstance.put(`/student/review/update/${reviewId}`, reviewData);
  return data;
}

export async function deleteReviewService(reviewId) {
  const { data } = await axiosInstance.delete(`/student/review/delete/${reviewId}`);
  return data;
}

// Library Management - Book services
export async function getAllBooksService(search = "", category = "") {
  const { data } = await axiosInstance.get(`/student/books?search=${search}&category=${category}`);
  return data;
}

export async function getBookByIdService(bookId) {
  const { data} = await axiosInstance.get(`/student/books/${bookId}`);
  return data;
}

export async function addBookService(bookData) {
  const { data } = await axiosInstance.post(`/student/books/add`, bookData);
  return data;
}

export async function updateBookService(bookId, bookData) {
  const { data } = await axiosInstance.put(`/student/books/update/${bookId}`, bookData);
  return data;
}

export async function deleteBookService(bookId) {
  const { data } = await axiosInstance.delete(`/student/books/delete/${bookId}`);
  return data;
}

// Book Issue services
export async function issueBookService(issueData) {
  const { data } = await axiosInstance.post(`/student/book-issue/issue`, issueData);
  return data;
}

export async function returnBookService(issueId) {
  const { data } = await axiosInstance.put(`/student/book-issue/return/${issueId}`);
  return data;
}

export async function getUserIssuedBooksService(userId) {
  const { data } = await axiosInstance.get(`/student/book-issue/issued/${userId}`);
  return data;
}

export async function getUserBookHistoryService(userId) {
  const { data } = await axiosInstance.get(`/student/book-issue/history/${userId}`);
  return data;
}

export async function getUserPendingFinesService(userId) {
  const { data } = await axiosInstance.get(`/student/book-issue/fines/${userId}`);
  return data;
}

// Fine Payment services
export async function createFinePaymentOrderService(paymentData) {
  const { data } = await axiosInstance.post(`/student/book-issue/fine/create-payment`, paymentData);
  return data;
}

export async function verifyFinePaymentService(paymentData) {
  const { data } = await axiosInstance.post(`/student/book-issue/fine/verify-payment`, paymentData);
  return data;
}
