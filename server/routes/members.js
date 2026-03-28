const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { body, validationResult } = require('express-validator');

// Get all members
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const members = await Member.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Member.countDocuments(query);

    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new member
router.post('/', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('membershipType').isIn(['Student', 'Regular', 'Premium']).withMessage('Invalid membership type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, address, membershipType } = req.body;

    // Check if member with email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }

    // Set max books allowed based on membership type
    const maxBooksAllowed = membershipType === 'Student' ? 3 : membershipType === 'Regular' ? 5 : 10;

    const member = new Member({
      firstName,
      lastName,
      email,
      phone,
      address,
      membershipType,
      maxBooksAllowed
    });

    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update member
router.put('/:id', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('membershipType').optional().isIn(['Student', 'Regular', 'Premium']).withMessage('Invalid membership type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Update max books allowed if membership type is changed
    if (req.body.membershipType) {
      const maxBooksAllowed = req.body.membershipType === 'Student' ? 3 : 
                             req.body.membershipType === 'Regular' ? 5 : 10;
      req.body.maxBooksAllowed = maxBooksAllowed;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if member has any issued books
    if (member.currentBooksIssued > 0) {
      return res.status(400).json({ message: 'Cannot delete member with issued books' });
    }

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
