import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  UsersIcon, 
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold">Library Management System</h1>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            
            <Link
              to="/books"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/books') || isActive('/add-book')
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <BookOpenIcon className="h-5 w-5 mr-1" />
              Books
            </Link>
            
            <Link
              to="/members"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/members') || isActive('/add-member')
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <UsersIcon className="h-5 w-5 mr-1" />
              Members
            </Link>
            
            <Link
              to="/transactions"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/transactions') || isActive('/issue-book')
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <ArrowPathIcon className="h-5 w-5 mr-1" />
              Transactions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
