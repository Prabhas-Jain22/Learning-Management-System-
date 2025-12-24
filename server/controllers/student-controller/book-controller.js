const Book = require("../../models/Book");

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    let filters = {};

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filters.category = category;
    }

    const books = await Book.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};

// Add new book
const addBook = async (req, res) => {
  try {
    const bookData = req.body;

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    const newBook = new Book({
      ...bookData,
      availableCopies: bookData.totalCopies,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add book",
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // If totalCopies is being updated, adjust availableCopies
    if (updateData.totalCopies !== undefined) {
      const issuedCopies = book.totalCopies - book.availableCopies;
      updateData.availableCopies = updateData.totalCopies - issuedCopies;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if book has any issued copies
    if (book.availableCopies < book.totalCopies) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book with issued copies",
      });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
