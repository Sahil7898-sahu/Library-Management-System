import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import Members from './components/Members';
import Transactions from './components/Transactions';
import AddBook from './components/AddBook';
import AddMember from './components/AddMember';
import IssueBook from './components/IssueBook';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/members" element={<Members />} />
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/issue-book" element={<IssueBook />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
