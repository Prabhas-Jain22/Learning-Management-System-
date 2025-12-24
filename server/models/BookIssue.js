const mongoose = require("mongoose");

const BookIssueSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: String,
  userEmail: String,
  bookTitle: String,
  bookAuthor: String,
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ["issued", "returned", "overdue"],
    default: "issued",
  },
  fine: {
    type: Number,
    default: 0,
  },
  fineStatus: {
    type: String,
    enum: ["none", "pending", "paid"],
    default: "none",
  },
  finePaymentId: String,
});

module.exports = mongoose.model("BookIssue", BookIssueSchema);
