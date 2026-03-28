const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  membershipType: {
    type: String,
    required: true,
    enum: ['Student', 'Regular', 'Premium'],
    default: 'Regular'
  },
  maxBooksAllowed: {
    type: Number,
    required: true,
    default: 5
  },
  currentBooksIssued: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  fineAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
