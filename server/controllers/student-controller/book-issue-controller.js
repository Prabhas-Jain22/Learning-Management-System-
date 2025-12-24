const BookIssue = require("../../models/BookIssue");
const Book = require("../../models/Book");

// Calculate fine (₹10 per day after due date)
const FINE_PER_DAY = 10;

const calculateFine = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  
  if (today <= due) return 0;
  
  const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
  return daysOverdue * FINE_PER_DAY;
};

// Issue book
const issueBook = async (req, res) => {
  try {
    const { bookId, userId, userName, userEmail, issueDays = 14 } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available for issue",
      });
    }

    // Check if user already has this book issued
    const existingIssue = await BookIssue.findOne({
      bookId,
      userId,
      status: "issued",
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: "You already have this book issued",
      });
    }

    // Calculate due date
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + issueDays);

    // Create book issue record
    const bookIssue = new BookIssue({
      bookId,
      userId,
      userName,
      userEmail,
      bookTitle: book.title,
      bookAuthor: book.author,
      issueDate,
      dueDate,
      status: "issued",
    });

    await bookIssue.save();

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: bookIssue,
    });
  } catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to issue book",
    });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;

    const bookIssue = await BookIssue.findById(issueId);
    if (!bookIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    if (bookIssue.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    const returnDate = new Date();
    const fine = calculateFine(bookIssue.dueDate);

    bookIssue.returnDate = returnDate;
    bookIssue.status = "returned";
    bookIssue.fine = fine;
    bookIssue.fineStatus = fine > 0 ? "pending" : "none";

    await bookIssue.save();

    // Update book available copies
    const book = await Book.findById(bookIssue.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: fine > 0 ? `Book returned. Fine: ₹${fine}` : "Book returned successfully",
      data: bookIssue,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return book",
    });
  }
};

// Get user's issued books
const getUserIssuedBooks = async (req, res) => {
  try {
    const { userId } = req.params;

    const issuedBooks = await BookIssue.find({
      userId,
      status: { $in: ["issued", "overdue"] },
    })
      .populate("bookId")
      .sort({ issueDate: -1 });

    // Update overdue status and calculate fines
    const updatedBooks = issuedBooks.map((issue) => {
      const fine = calculateFine(issue.dueDate);
      if (fine > 0 && issue.status === "issued") {
        issue.status = "overdue";
        issue.fine = fine;
        issue.fineStatus = "pending";
        issue.save();
      }
      return issue;
    });

    res.status(200).json({
      success: true,
      data: updatedBooks,
    });
  } catch (error) {
    console.error("Error fetching issued books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issued books",
    });
  }
};

// Get user's book history
const getUserBookHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await BookIssue.find({ userId })
      .populate("bookId")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching book history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book history",
    });
  }
};

// Get user's pending fines
const getUserPendingFines = async (req, res) => {
  try {
    const { userId } = req.params;

    const pendingFines = await BookIssue.find({
      userId,
      fineStatus: "pending",
    }).populate("bookId");

    const totalFine = pendingFines.reduce((sum, issue) => sum + issue.fine, 0);

    res.status(200).json({
      success: true,
      data: {
        fines: pendingFines,
        totalFine,
      },
    });
  } catch (error) {
    console.error("Error fetching pending fines:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending fines",
    });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getUserIssuedBooks,
  getUserBookHistory,
  getUserPendingFines,
};
