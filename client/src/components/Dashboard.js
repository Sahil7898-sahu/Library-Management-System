import React, { useState, useEffect } from 'react';
import { BookOpenIcon, UsersIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeTransactions: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [booksRes, membersRes, transactionsRes, overdueRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books'),
        axios.get('http://localhost:5000/api/members'),
        axios.get('http://localhost:5000/api/transactions?status=Issued'),
        axios.get('http://localhost:5000/api/transactions/overdue/list')
      ]);

      setStats({
        totalBooks: booksRes.data.total || 0,
        totalMembers: membersRes.data.total || 0,
        activeTransactions: transactionsRes.data.total || 0,
        overdueBooks: overdueRes.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpenIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: UsersIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Active Transactions',
      value: stats.activeTransactions,
      icon: ArrowPathIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-3 mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/add-book"
              className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Book
            </a>
            <a
              href="/add-member"
              className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add New Member
            </a>
            <a
              href="/issue-book"
              className="block w-full text-center bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Issue Book
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Library Status</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
