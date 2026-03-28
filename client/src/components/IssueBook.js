import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IssueBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    book: '',
    member: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books'),
        axios.get('http://localhost:5000/api/members')
      ]);

      // Filter available books
      const availableBooks = booksRes.data.books.filter(book => book.availableCopies > 0);
      setBooks(availableBooks);

      // Filter active members
      const activeMembers = membersRes.data.members.filter(member => member.status === 'Active');
      setMembers(activeMembers);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/transactions/issue', formData);
      navigate('/transactions');
    } catch (error) {
      setError(error.response?.data?.message || 'Error issuing book');
    } finally {
      setSubmitting(false);
    }
  };

  const getMemberInfo = (memberId) => {
    const member = members.find(m => m._id === memberId);
    if (!member) return '';
    return `${member.currentBooksIssued}/${member.maxBooksAllowed} books issued`;
  };

  const getBookInfo = (bookId) => {
    const book = books.find(b => b._id === bookId);
    if (!book) return '';
    return `${book.availableCopies}/${book.totalCopies} available`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Issue Book</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="book" className="block text-sm font-medium text-gray-700 mb-2">
                Select Book *
              </label>
              <select
                id="book"
                name="book"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.book}
                onChange={handleChange}
              >
                <option value="">Choose a book...</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} - {book.author} (ISBN: {book.isbn})
                  </option>
                ))}
              </select>
              {formData.book && (
                <p className="mt-1 text-sm text-gray-600">
                  Availability: {getBookInfo(formData.book)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="member" className="block text-sm font-medium text-gray-700 mb-2">
                Select Member *
              </label>
              <select
                id="member"
                name="member"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.member}
                onChange={handleChange}
              >
                <option value="">Choose a member...</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName} - {member.email}
                  </option>
                ))}
              </select>
              {formData.member && (
                <p className="mt-1 text-sm text-gray-600">
                  Current books: {getMemberInfo(formData.member)}
                </p>
              )}
            </div>

            {formData.book && formData.member && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Transaction Summary</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                  <p>Fine: ₹5 per day after due date</p>
                  <p>Borrowing Period: 14 days</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.book || !formData.member}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Issuing...' : 'Issue Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
