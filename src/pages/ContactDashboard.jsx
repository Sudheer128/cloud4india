import React, { useState, useEffect, useCallback } from 'react';
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
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  BellAlertIcon,
  FlagIcon,
  TagIcon,
  UserGroupIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
  updateContactSubmissionNotes,
  deleteContactSubmission,
  getContactSubmissionsStats,
  updateContactPriority,
  setContactFollowUp,
  clearContactFollowUp,
  getTodayFollowUps,
  getOverdueFollowUps,
  updateContactSource,
  incrementContactAttempts,
  getContactActivity,
  addContactActivity,
  exportContactSubmissions,
  bulkUpdateContactStatus,
  bulkDeleteContacts
} from '../services/cmsApi';

// Status configuration
const STATUS_CONFIG = {
  leads: { label: 'New Leads', color: 'blue', icon: UserIcon, description: 'New contact form submissions waiting to be contacted' },
  contacted: { label: 'Contacted', color: 'yellow', icon: PhoneIcon, description: 'Leads that have been contacted once' },
  qualified: { label: 'Qualified', color: 'purple', icon: CheckIcon, description: 'Leads that are qualified prospects' },
  follow_up: { label: 'Follow-up', color: 'orange', icon: CalendarIcon, description: 'Leads that need follow-up' },
  negotiation: { label: 'Negotiation', color: 'indigo', icon: ChatBubbleLeftIcon, description: 'Leads in negotiation phase' },
  final_customer: { label: 'Converted', color: 'green', icon: CheckIcon, description: 'Leads converted to customers' },
  not_interested: { label: 'Not Interested', color: 'gray', icon: XMarkIcon, description: 'Leads that declined' },
  lost: { label: 'Lost', color: 'red', icon: XMarkIcon, description: 'Leads lost to competition' }
};

// Priority configuration
const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300' },
  high: { label: 'High', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300' },
  medium: { label: 'Medium', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
  low: { label: 'Low', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300' }
};

// Source configuration
const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'direct', label: 'Direct' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'phone', label: 'Phone' },
  { value: 'other', label: 'Other' }
];

const ContactDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    leads: 0, contacted: 0, qualified: 0, follow_up: 0,
    negotiation: 0, final_customer: 0, not_interested: 0, lost: 0, total: 0,
    priority: { urgent: 0, high: 0, medium: 0, low: 0 },
    followUp: { overdue: 0, today: 0, this_week: 0 }
  });

  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    priority: 'all',
    source: 'all',
    followUpFilter: 'all',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1, limit: 20, total: 0, totalPages: 1
  });

  // Modal states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [activities, setActivities] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  // Alert notifications
  const [overdueFollowUps, setOverdueFollowUps] = useState([]);
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchFollowUpAlerts();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, filters]);

  const fetchFollowUpAlerts = async () => {
    try {
      const [overdue, today] = await Promise.all([
        getOverdueFollowUps(),
        getTodayFollowUps()
      ]);
      setOverdueFollowUps(overdue || []);
      setTodayFollowUps(today || []);
    } catch (err) {
      console.error('Error fetching follow-up alerts:', err);
    }
  };

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
        status: activeTab === 'all' ? undefined : activeTab === 'closed' ? 'closed' : activeTab
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

  const handlePriorityUpdate = async (id, priority) => {
    try {
      await updateContactPriority(id, priority);
      await fetchSubmissions();
      await fetchStats();
      setShowPriorityModal(false);
    } catch (err) {
      console.error('Error updating priority:', err);
      alert('Failed to update priority');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
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

  const handleOpenFollowUpModal = (submission) => {
    setSelectedSubmission(submission);
    setFollowUpDate(submission.follow_up_date ? submission.follow_up_date.split('T')[0] : '');
    setFollowUpNotes(submission.follow_up_notes || '');
    setShowFollowUpModal(true);
  };

  const handleSaveFollowUp = async () => {
    if (!selectedSubmission) return;
    try {
      if (followUpDate) {
        await setContactFollowUp(selectedSubmission.id, followUpDate, followUpNotes);
      } else {
        await clearContactFollowUp(selectedSubmission.id);
      }
      await fetchSubmissions();
      await fetchFollowUpAlerts();
      setShowFollowUpModal(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error saving follow-up:', err);
      alert('Failed to save follow-up');
    }
  };

  const handleIncrementContact = async (id) => {
    try {
      await incrementContactAttempts(id);
      await fetchSubmissions();
    } catch (err) {
      console.error('Error incrementing contact:', err);
    }
  };

  const handleViewActivity = async (submission) => {
    setSelectedSubmission(submission);
    try {
      const activityData = await getContactActivity(submission.id);
      setActivities(activityData || []);
      setShowActivityModal(true);
    } catch (err) {
      console.error('Error fetching activity:', err);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportContactSubmissions({
        status: activeTab === 'all' ? undefined : activeTab,
        ...filters
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error exporting:', err);
      alert('Failed to export');
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0 || !bulkStatus) return;
    try {
      await bulkUpdateContactStatus(selectedIds, bulkStatus);
      await fetchSubmissions();
      await fetchStats();
      setSelectedIds([]);
      setBulkStatus('');
      setShowBulkActionsModal(false);
    } catch (err) {
      console.error('Error bulk updating:', err);
      alert('Failed to update');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} submissions?`)) return;
    try {
      await bulkDeleteContacts(selectedIds);
      await fetchSubmissions();
      await fetchStats();
      setSelectedIds([]);
      setShowBulkActionsModal(false);
    } catch (err) {
      console.error('Error bulk deleting:', err);
      alert('Failed to delete');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.map(s => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric'
    });
  };

  const isOverdue = (followUpDate) => {
    if (!followUpDate) return false;
    return new Date(followUpDate) < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const isToday = (followUpDate) => {
    if (!followUpDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return followUpDate.split('T')[0] === today;
  };

  const tabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'leads', label: 'Leads', count: stats.leads },
    { id: 'contacted', label: 'Contacted', count: stats.contacted },
    { id: 'qualified', label: 'Qualified', count: stats.qualified },
    { id: 'follow_up', label: 'Follow-up', count: stats.follow_up },
    { id: 'negotiation', label: 'Negotiation', count: stats.negotiation },
    { id: 'final_customer', label: 'Converted', count: stats.final_customer },
    { id: 'closed', label: 'Closed', count: (stats.not_interested || 0) + (stats.lost || 0) }
  ];

  const getStatusActions = (submission) => {
    const currentStatus = submission.status;
    const actions = [];

    if (currentStatus === 'leads') {
      actions.push({ status: 'contacted', label: 'Mark Contacted', color: 'blue' });
      actions.push({ status: 'not_interested', label: 'Not Interested', color: 'gray' });
    } else if (currentStatus === 'contacted') {
      actions.push({ status: 'qualified', label: 'Qualify', color: 'purple' });
      actions.push({ status: 'follow_up', label: 'Follow-up', color: 'orange' });
      actions.push({ status: 'not_interested', label: 'Not Interested', color: 'gray' });
    } else if (currentStatus === 'qualified') {
      actions.push({ status: 'negotiation', label: 'Start Negotiation', color: 'indigo' });
      actions.push({ status: 'follow_up', label: 'Follow-up', color: 'orange' });
      actions.push({ status: 'not_interested', label: 'Not Interested', color: 'gray' });
    } else if (currentStatus === 'follow_up') {
      actions.push({ status: 'qualified', label: 'Qualify', color: 'purple' });
      actions.push({ status: 'negotiation', label: 'Start Negotiation', color: 'indigo' });
      actions.push({ status: 'not_interested', label: 'Not Interested', color: 'gray' });
    } else if (currentStatus === 'negotiation') {
      actions.push({ status: 'final_customer', label: 'Convert to Customer', color: 'green' });
      actions.push({ status: 'follow_up', label: 'Follow-up', color: 'orange' });
      actions.push({ status: 'lost', label: 'Mark Lost', color: 'red' });
    }

    return actions;
  };

  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'status_change': return <ArrowPathIcon className="h-4 w-4" />;
      case 'priority_change': return <FlagIcon className="h-4 w-4" />;
      case 'note_added': return <DocumentTextIcon className="h-4 w-4" />;
      case 'follow_up_set': return <CalendarIcon className="h-4 w-4" />;
      case 'contact_attempt': return <PhoneIcon className="h-4 w-4" />;
      case 'call_made': return <PhoneIcon className="h-4 w-4" />;
      case 'email_sent': return <EnvelopeIcon className="h-4 w-4" />;
      case 'assigned': return <UserGroupIcon className="h-4 w-4" />;
      default: return <ChatBubbleLeftIcon className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (actionType) => {
    const labels = {
      status_change: 'Status Changed',
      priority_change: 'Priority Changed',
      note_added: 'Note Added',
      follow_up_set: 'Follow-up Scheduled',
      contact_attempt: 'Contact Attempt',
      call_made: 'Call Made',
      email_sent: 'Email Sent',
      assigned: 'Assigned',
      meeting_scheduled: 'Meeting Scheduled',
      document_sent: 'Document Sent'
    };
    return labels[actionType] || actionType;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track your contact form leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => { fetchSubmissions(); fetchStats(); fetchFollowUpAlerts(); }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Follow-up Alerts Banner */}
      {showAlerts && (overdueFollowUps.length > 0 || todayFollowUps.length > 0) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BellAlertIcon className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Follow-up Reminders</h3>
            </div>
            <button onClick={() => setShowAlerts(false)} className="text-orange-600 hover:text-orange-800">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {overdueFollowUps.length > 0 && (
              <div className="flex items-center gap-2 text-red-700">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span className="font-medium">{overdueFollowUps.length} overdue</span>
              </div>
            )}
            {todayFollowUps.length > 0 && (
              <div className="flex items-center gap-2 text-orange-700">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">{todayFollowUps.length} due today</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all hover:shadow-md ${activeTab === status ? 'ring-2 ring-orange-500 border-orange-500' : 'border-gray-200'
              }`}
          >
            <p className="text-xs text-gray-500 truncate">{config.label}</p>
            <p className="text-xl font-bold text-gray-900">{stats[status] || 0}</p>
          </button>
        ))}
      </div>

      {/* Priority & Follow-up Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FlagIcon className="h-4 w-4" /> Priority Distribution
          </h3>
          <div className="flex gap-4">
            {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
              <div key={priority} className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                  {config.label}
                </span>
                <span className="text-gray-900 font-medium">{stats.priority?.[priority] || 0}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> Follow-up Overview
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => setFilters({ ...filters, followUpFilter: 'overdue', page: 1 })}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="font-medium">{stats.followUp?.overdue || 0} Overdue</span>
            </button>
            <button
              onClick={() => setFilters({ ...filters, followUpFilter: 'today', page: 1 })}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{stats.followUp?.today || 0} Today</span>
            </button>
            <button
              onClick={() => setFilters({ ...filters, followUpFilter: 'this_week', page: 1 })}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ClockIcon className="h-4 w-4" />
              <span className="font-medium">{stats.followUp?.this_week || 0} This Week</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-1 px-4" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setFilters({ ...filters, page: 1 }); }}
                className={`py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
                <span className={`ml-1.5 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Description */}
        {activeTab !== 'all' && activeTab !== 'closed' && STATUS_CONFIG[activeTab] && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">{STATUS_CONFIG[activeTab].description}</p>
          </div>
        )}

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority Filter */}
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Priorities</option>
                {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>

              {/* Source Filter */}
              <select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Sources</option>
                {SOURCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Follow-up Filter */}
              <select
                value={filters.followUpFilter}
                onChange={(e) => setFilters({ ...filters, followUpFilter: e.target.value, page: 1 })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Follow-ups</option>
                <option value="overdue">Overdue</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="no_followup">No Follow-up</option>
              </select>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="created_at">Date</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="follow_up_date">Follow-up Date</option>
                <option value="contact_attempts">Contact Attempts</option>
              </select>
              <button
                onClick={() => handleSort(filters.sortBy)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {filters.sortOrder === 'DESC' ? (
                  <ArrowDownIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Clear Filters */}
              {(filters.priority !== 'all' || filters.source !== 'all' || filters.followUpFilter !== 'all' || filters.search) && (
                <button
                  onClick={() => setFilters({ ...filters, priority: 'all', source: 'all', followUpFilter: 'all', search: '', page: 1 })}
                  className="px-3 py-2 text-sm text-orange-600 hover:text-orange-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="px-6 py-3 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-800">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Change Status...</option>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-orange-700"
              >
                Apply
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
              <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found in this category.</p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === submissions.length && submissions.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>

              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${selectedIds.includes(submission.id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      } ${isOverdue(submission.follow_up_date) ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(submission.id)}
                        onChange={() => toggleSelectOne(submission.id)}
                        className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{submission.name}</h3>

                          {/* Priority Badge - Always show, clickable to change */}
                          <button
                            onClick={() => { setSelectedSubmission(submission); setShowPriorityModal(true); }}
                            className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${PRIORITY_CONFIG[submission.priority || 'medium']?.bgColor || 'bg-yellow-100'} ${PRIORITY_CONFIG[submission.priority || 'medium']?.textColor || 'text-yellow-700'} hover:opacity-80`}
                            title="Click to change priority"
                          >
                            <FlagIcon className="h-3 w-3" />
                            {PRIORITY_CONFIG[submission.priority || 'medium']?.label || 'Medium'}
                          </button>

                          {/* Status Badge */}
                          {STATUS_CONFIG[submission.status] && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${STATUS_CONFIG[submission.status].color}-100 text-${STATUS_CONFIG[submission.status].color}-700`}>
                              {STATUS_CONFIG[submission.status].label}
                            </span>
                          )}

                          {/* Source Badge */}
                          {submission.source && (
                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                              {SOURCE_OPTIONS.find(s => s.value === submission.source)?.label || submission.source}
                            </span>
                          )}

                          {/* Follow-up Date */}
                          {submission.follow_up_date && (
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${isOverdue(submission.follow_up_date) ? 'bg-red-100 text-red-700' :
                              isToday(submission.follow_up_date) ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                              <CalendarIcon className="h-3 w-3" />
                              {formatShortDate(submission.follow_up_date)}
                            </span>
                          )}

                          {/* Contact Attempts */}
                          {submission.contact_attempts > 0 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                              <PhoneIcon className="h-3 w-3" />
                              {submission.contact_attempts}x
                            </span>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <EnvelopeIcon className="h-4 w-4" />
                            {submission.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="h-4 w-4" />
                            {submission.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {formatDate(submission.created_at)}
                          </span>
                        </div>

                        {/* Subject & Message */}
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Subject: {submission.subject}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">{submission.message}</p>

                        {/* Admin Notes */}
                        {submission.admin_notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <span className="font-medium text-yellow-800">Notes:</span>{' '}
                            <span className="text-yellow-700">{submission.admin_notes}</span>
                          </div>
                        )}

                        {/* Follow-up Notes */}
                        {submission.follow_up_notes && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                            <span className="font-medium text-blue-800">Follow-up:</span>{' '}
                            <span className="text-blue-700">{submission.follow_up_notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        {/* Quick Actions */}
                        <div className="flex items-center gap-1">
                          <a
                            href={`mailto:${submission.email}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Send Email"
                          >
                            <EnvelopeIcon className="h-5 w-5" />
                          </a>
                          <a
                            href={`tel:${submission.phone}`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Call"
                          >
                            <PhoneIcon className="h-5 w-5" />
                          </a>
                          <a
                            href={`https://wa.me/${submission.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="WhatsApp"
                          >
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedSubmission(submission); setShowPriorityModal(true); }}
                            className={`p-2 rounded-lg hover:bg-orange-50 ${PRIORITY_CONFIG[submission.priority || 'medium']?.textColor || 'text-yellow-600'}`}
                            title="Change Priority"
                          >
                            <FlagIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleIncrementContact(submission.id)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Log Contact Attempt"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleOpenFollowUpModal(submission)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Set Follow-up"
                          >
                            <CalendarIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleOpenNotesModal(submission)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Edit Notes"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleViewActivity(submission)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="View Activity"
                          >
                            <ChartBarIcon className="h-5 w-5" />
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
                    </div>

                    {/* Status Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      {getStatusActions(submission).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleStatusUpdate(submission.id, action.status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                            ${action.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                              action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                action.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                                  action.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                                    action.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' :
                                      action.color === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                        'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                          {action.label}
                        </button>
                      ))}
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotesModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Admin Notes</h3>
                  <button onClick={() => setShowNotesModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Contact:</strong> {selectedSubmission.name} ({selectedSubmission.email})
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Add your notes about this lead..."
                />
                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={() => setShowNotesModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSaveNotes} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Modal */}
      {showFollowUpModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFollowUpModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Set Follow-up</h3>
                  <button onClick={() => setShowFollowUpModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Contact:</strong> {selectedSubmission.name}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="What to discuss..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {selectedSubmission.follow_up_date && (
                    <button
                      onClick={async () => {
                        await clearContactFollowUp(selectedSubmission.id);
                        await fetchSubmissions();
                        await fetchFollowUpAlerts();
                        setShowFollowUpModal(false);
                      }}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Clear
                    </button>
                  )}
                  <button onClick={() => setShowFollowUpModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSaveFollowUp} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Modal */}
      {showPriorityModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPriorityModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Set Priority</h3>
                  <button onClick={() => setShowPriorityModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
                    <button
                      key={priority}
                      onClick={() => handlePriorityUpdate(selectedSubmission.id, priority)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${selectedSubmission.priority === priority
                        ? `${config.borderColor} ${config.bgColor}`
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span className={`font-medium ${selectedSubmission.priority === priority ? config.textColor : 'text-gray-700'}`}>
                        {config.label}
                      </span>
                      {selectedSubmission.priority === priority && (
                        <CheckIcon className={`h-5 w-5 ${config.textColor}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivityModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                  <button onClick={() => setShowActivityModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Contact:</strong> {selectedSubmission.name}
                </p>
                <div className="space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No activity recorded yet</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full border border-gray-200">
                          {getActivityIcon(activity.action_type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {getActivityLabel(activity.action_type)}
                          </p>
                          {activity.old_value && activity.new_value && (
                            <p className="text-xs text-gray-600">
                              {activity.old_value} → {activity.new_value}
                            </p>
                          )}
                          {activity.notes && (
                            <p className="text-xs text-gray-600 mt-1">{activity.notes}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(activity.created_at)} by {activity.performed_by}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
