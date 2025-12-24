const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  publisher: String,
  publishedYear: Number,
  totalCopies: {
    type: Number,
    required: true,
    default: 1,
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
  },
  bookImage: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", BookSchema);
