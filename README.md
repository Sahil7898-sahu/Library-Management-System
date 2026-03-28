# Library Management System

A comprehensive library management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Book Management**: Add, edit, delete, and search books
- **Member Management**: Register and manage library members with different membership types
- **Transaction Management**: Issue and return books with automatic fine calculation
- **Dashboard**: Overview of library statistics and quick actions
- **Modern UI**: Responsive design using Tailwind CSS and Heroicons
- **Authentication**: User authentication system (basic implementation)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Heroicons for icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. The default connection string is `mongodb://localhost:27017/library_management`.

## Running the Application

### Method 1: Development Mode (Recommended)

1. **Start the backend server**
   ```bash
   npm run server
   ```

2. **Start the frontend** (in a new terminal)
   ```bash
   npm run client
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Method 2: Concurrent Development

Run both frontend and backend simultaneously:
```bash
npm run dev
```

### Method 3: Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with pagination and search)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Members
- `GET /api/members` - Get all members (with pagination and search)
- `GET /api/members/:id` - Get a specific member
- `POST /api/members` - Add a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get a specific transaction
- `POST /api/transactions/issue` - Issue a book
- `POST /api/transactions/return/:id` - Return a book
- `GET /api/transactions/overdue/list` - Get overdue transactions

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

## Database Schema

### Book
```javascript
{
  title: String,
  author: String,
  isbn: String,
  category: String,
  publicationYear: Number,
  totalCopies: Number,
  availableCopies: Number,
  description: String,
  location: String
}
```

### Member
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  membershipType: String, // Student, Regular, Premium
  maxBooksAllowed: Number,
  currentBooksIssued: Number,
  status: String, // Active, Inactive, Suspended
  fineAmount: Number
}
```

### Transaction
```javascript
{
  book: ObjectId,
  member: ObjectId,
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: String, // Issued, Returned, Overdue
  fine: Number,
  remarks: String
}
```

## Features in Detail

### Book Management
- Add new books with details like title, author, ISBN, category, etc.
- Search books by title, author, or ISBN
- Filter books by category
- Track available copies vs total copies
- Edit and delete book records

### Member Management
- Register new members with personal details
- Three membership types: Student (3 books), Regular (5 books), Premium (10 books)
- Track member status (Active, Inactive, Suspended)
- Monitor current books issued vs maximum allowed
- Calculate and track fines

### Transaction Management
- Issue books to members with automatic due date calculation (14 days)
- Return books with automatic fine calculation (₹5 per day overdue)
- Track transaction history
- View overdue books and members
- Search and filter transactions

### Dashboard
- Real-time statistics: total books, members, active transactions, overdue books
- Quick action buttons for common tasks
- System overview with status indicators

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] Email notifications for due dates and overdue books
- [ ] Advanced reporting and analytics
- [ ] Book reservation system
- [ ] Multi-library support
- [ ] Mobile app
- [ ] Barcode/QR code scanning
- [ ] Fine payment integration
- [ ] Advanced user roles and permissions
