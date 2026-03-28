const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');
const { body, validationResult } = require('express-validator');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, member, book } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (member) {
      query.member = member;
    }
    
    if (book) {
      query.book = book;
    }

    const transactions = await Transaction.find(query)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('member');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Issue book
router.post('/issue', [
  body('book').isMongoId().withMessage('Valid book ID is required'),
  body('member').isMongoId().withMessage('Valid member ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { book, member } = req.body;

    // Check if book exists and is available
    const bookDoc = await Book.findById(book);
    if (!bookDoc) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (bookDoc.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if member exists and is active
    const memberDoc = await Member.findById(member);
    if (!memberDoc) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (memberDoc.status !== 'Active') {
      return res.status(400).json({ message: 'Member is not active' });
    }

    if (memberDoc.currentBooksIssued >= memberDoc.maxBooksAllowed) {
      return res.status(400).json({ message: 'Member has reached maximum book limit' });
    }

    // Check if member already has this book issued
    const existingTransaction = await Transaction.findOne({
      book,
      member,
      status: 'Issued'
    });

    if (existingTransaction) {
      return res.status(400).json({ message: 'Member already has this book issued' });
    }

    // Create transaction
    const transaction = new Transaction({
      book,
      member,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });

    // Update book and member
    bookDoc.availableCopies -= 1;
    memberDoc.currentBooksIssued += 1;

    await Promise.all([
      transaction.save(),
      bookDoc.save(),
      memberDoc.save()
    ]);

    // Fetch the populated transaction without triggering validation
    const populatedTransaction = await Transaction.aggregate([
      { $match: { _id: transaction._id } },
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $lookup: {
          from: 'members',
          localField: 'member',
          foreignField: '_id',
          as: 'member'
        }
      },
      {
        $project: {
          _id: 1,
          book: { $first: '$book' },
          member: { $first: '$member' },
          issueDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          fine: 1,
          remarks: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    res.status(201).json(populatedTransaction[0]);
  } catch (error) {
    console.error('Error issuing book:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, details: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
});

// Return book
router.post('/return/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'Returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Calculate fine if overdue
    const returnDate = new Date();
    let fine = 0;
    
    if (returnDate > transaction.dueDate) {
      const daysOverdue = Math.ceil((returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * 5; // ₹5 per day overdue
    }

    // Update transaction
    transaction.returnDate = returnDate;
    transaction.status = 'Returned';
    transaction.fine = fine;

    // Update book and member
    const book = await Book.findById(transaction.book);
    const member = await Member.findById(transaction.member);

    book.availableCopies += 1;
    member.currentBooksIssued -= 1;
    member.fineAmount += fine;

    await Promise.all([
      transaction.save(),
      book.save(),
      member.save()
    ]);

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email');

    res.json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get overdue transactions
router.get('/overdue/list', async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      status: 'Issued',
      dueDate: { $lt: new Date() }
    })
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email')
      .sort({ dueDate: 1 });

    res.json(overdueTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
