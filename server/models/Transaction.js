const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['Issued', 'Returned', 'Overdue'],
    default: 'Issued'
  },
  fine: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate due date (14 days from issue date)
transactionSchema.pre('save', function(next) {
  if (this.isNew && !this.dueDate) {
    const dueDate = new Date(this.issueDate);
    dueDate.setDate(dueDate.getDate() + 14);
    this.dueDate = dueDate;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
