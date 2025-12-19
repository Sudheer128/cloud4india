import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
  updateContactSubmissionNotes,
  deleteContactSubmission,
  getContactSubmissionsStats
} from '../services/cmsApi';

const ContactDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    leads: 0,
    contacted: 0,
    re_contact: 0,
    final_customer: 0,
    total: 0
  });
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  
  // Modal states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchStats();
    fetchSubmissions();
  }, [activeTab, filters]);

  const fetchStats = async () => {
    try {
      const statsData = await getContactSubmissionsStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactSubmissions({
        ...filters,
        status: activeTab === 'leads' ? 'leads' : activeTab === 'contacted' ? 'contacted' : activeTab === 're_contact' ? 're_contact' : 'final_customer'
      });
      setSubmissions(data.submissions || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateContactSubmissionStatus(id, newStatus);
      await fetchSubmissions();
      await fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }
    try {
      await deleteContactSubmission(id);
      await fetchSubmissions();
      await fetchStats();
    } catch (err) {
      console.error('Error deleting submission:', err);
      alert('Failed to delete submission');
    }
  };

  const handleOpenNotesModal = (submission) => {
    setSelectedSubmission(submission);
    setNotes(submission.admin_notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    try {
      await updateContactSubmissionNotes(selectedSubmission.id, notes);
      await fetchSubmissions();
      setShowNotesModal(false);
      setSelectedSubmission(null);
      setNotes('');
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Failed to save notes');
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleSort = (sortBy) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'DESC' ? 'ASC' : 'DESC';
    setFilters({ ...filters, sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'leads', label: 'Leads', count: stats.leads, description: 'New contact form submissions waiting to be contacted' },
    { id: 'contacted', label: 'Contacted', count: stats.contacted, description: 'Leads that have been contacted once' },
    { id: 're_contact', label: 'Re Contact', count: stats.re_contact, description: 'Leads that have been contacted multiple times' },
    { id: 'final_customer', label: 'Final Customer', count: stats.final_customer, description: 'Leads converted to customers' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and track your contact form leads</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tabs.map(tab => (
          <div key={tab.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{tab.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{tab.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tab.id === 'leads' ? 'bg-blue-100 text-blue-600' :
                tab.id === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                tab.id === 're_contact' ? 'bg-orange-100 text-orange-600' :
                'bg-green-100 text-green-600'
              }`}>
                {tab.id === 'leads' && <UserIcon className="h-6 w-6" />}
                {tab.id === 'contacted' && <PhoneIcon className="h-6 w-6" />}
                {tab.id === 're_contact' && <EnvelopeIcon className="h-6 w-6" />}
                {tab.id === 'final_customer' && <CheckIcon className="h-6 w-6" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFilters({ ...filters, page: 1 });
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or subject..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="created_at">Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
              <button
                onClick={() => handleSort(filters.sortBy)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={filters.sortOrder === 'DESC' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {filters.sortOrder === 'DESC' ? (
                  <ArrowDownIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found in this category.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                            <p className="text-sm text-gray-600">{submission.email}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4" />
                            <span>{submission.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>{formatDate(submission.created_at)}</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700">Subject: {submission.subject}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{submission.message}</p>
                        {submission.admin_notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-xs font-medium text-yellow-800">Admin Notes:</p>
                            <p className="text-xs text-yellow-700">{submission.admin_notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleOpenNotesModal(submission)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Add/Edit Notes"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeTab === 'leads' && (
                        <button
                          onClick={() => handleStatusUpdate(submission.id, 'contacted')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                        >
                          Mark as Contacted
                        </button>
                      )}
                      {activeTab === 'contacted' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(submission.id, 're_contact')}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium"
                          >
                            Re-contact
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(submission.id, 'final_customer')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                          >
                            Mark as Final Customer
                          </button>
                        </>
                      )}
                      {activeTab === 're_contact' && (
                        <button
                          onClick={() => handleStatusUpdate(submission.id, 'final_customer')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                        >
                          Convert to Customer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowNotesModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Notes
                  </h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Contact:</strong> {selectedSubmission.name} ({selectedSubmission.email})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Add your notes about this lead..."
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDashboard;


