import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    ClockIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import {
    getContactSubmissions,
    updateContactSubmissionStatus,
    deleteContactSubmission,
    getContactSubmissionsStats
} from '../services/cmsApi';

// Simplified status configuration (4 statuses instead of 8)
const SIMPLE_STATUS_CONFIG = {
    new: {
        label: 'New',
        color: 'blue',
        icon: UserIcon,
        description: 'Fresh leads waiting to be contacted',
        backendStatuses: ['leads'] // Maps to backend 'leads' status
    },
    in_progress: {
        label: 'In Progress',
        color: 'yellow',
        icon: PlayIcon,
        description: 'Currently being worked on',
        backendStatuses: ['contacted', 'qualified', 'follow_up', 'negotiation'] // Maps to multiple backend statuses
    },
    converted: {
        label: 'Converted',
        color: 'green',
        icon: CheckIcon,
        description: 'Successfully became customer',
        backendStatuses: ['final_customer']
    },
    closed: {
        label: 'Closed',
        color: 'gray',
        icon: XMarkIcon,
        description: 'Not interested or lost',
        backendStatuses: ['not_interested', 'lost']
    }
};

const ContactDashboardSimple = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ new: 0, in_progress: 0, converted: 0, closed: 0, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

    useEffect(() => {
        fetchSubmissions();
        fetchStats();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const rawStats = await getContactSubmissionsStats();

            // Map 8 backend statuses to 4 simple statuses
            const simplifiedStats = {
                new: rawStats.leads || 0,
                in_progress: (rawStats.contacted || 0) + (rawStats.qualified || 0) + (rawStats.follow_up || 0) + (rawStats.negotiation || 0),
                converted: rawStats.final_customer || 0,
                closed: (rawStats.not_interested || 0) + (rawStats.lost || 0),
                total: rawStats.total || 0
            };

            setStats(simplifiedStats);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);

            let statusFilter;
            if (activeTab === 'new') {
                statusFilter = 'leads';
            } else if (activeTab === 'in_progress') {
                // Get all in-progress statuses
                statusFilter = undefined; // We'll filter client-side
            } else if (activeTab === 'converted') {
                statusFilter = 'final_customer';
            } else if (activeTab === 'closed') {
                statusFilter = 'closed'; // This maps to not_interested + lost on backend
            }

            const data = await getContactSubmissions({
                status: statusFilter,
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                sortBy: 'created_at',
                sortOrder: 'DESC'
            });

            let filteredSubmissions = data.submissions || [];

            // Client-side filtering for in_progress tab
            if (activeTab === 'in_progress') {
                filteredSubmissions = filteredSubmissions.filter(sub =>
                    ['contacted', 'qualified', 'follow_up', 'negotiation'].includes(sub.status)
                );
            }

            setSubmissions(filteredSubmissions);
            setPagination(data.pagination || pagination);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setError('Failed to load contact submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newSimpleStatus) => {
        try {
            // Map simple status to backend status
            let backendStatus;
            if (newSimpleStatus === 'new') {
                backendStatus = 'leads';
            } else if (newSimpleStatus === 'in_progress') {
                backendStatus = 'contacted'; // Default to 'contacted' when moving to in_progress
            } else if (newSimpleStatus === 'converted') {
                backendStatus = 'final_customer';
            } else if (newSimpleStatus === 'closed') {
                backendStatus = 'not_interested'; // Default to 'not_interested' when closing
            }

            await updateContactSubmissionStatus(id, backendStatus);
            await fetchSubmissions();
            await fetchStats();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        fetchSubmissions();
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

    // Map backend status to simple status for display
    const getSimpleStatus = (backendStatus) => {
        if (backendStatus === 'leads') return 'new';
        if (['contacted', 'qualified', 'follow_up', 'negotiation'].includes(backendStatus)) return 'in_progress';
        if (backendStatus === 'final_customer') return 'converted';
        if (['not_interested', 'lost'].includes(backendStatus)) return 'closed';
        return 'new';
    };

    // Get available actions based on current status
    const getStatusActions = (submission) => {
        const simpleStatus = getSimpleStatus(submission.status);
        const actions = [];

        if (simpleStatus === 'new') {
            actions.push({ status: 'in_progress', label: '▶ Start Working', color: 'blue' });
            actions.push({ status: 'closed', label: '✗ Close', color: 'gray' });
        } else if (simpleStatus === 'in_progress') {
            actions.push({ status: 'converted', label: '✓ Mark Converted', color: 'green' });
            actions.push({ status: 'closed', label: '✗ Close', color: 'gray' });
        }

        return actions;
    };

    const tabs = [
        { id: 'all', label: 'All', count: stats.total },
        { id: 'new', label: 'New', count: stats.new },
        { id: 'in_progress', label: 'In Progress', count: stats.in_progress },
        { id: 'done', label: 'Done', count: stats.converted + stats.closed }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Leads (Simplified)</h1>
                    <p className="text-gray-600 mt-1">Simple workflow to manage your contact form submissions</p>
                </div>
                <button
                    onClick={() => { fetchSubmissions(); fetchStats(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(SIMPLE_STATUS_CONFIG).map(([status, config]) => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        className={`bg-white rounded-lg shadow-sm border p-4 text-left transition-all hover:shadow-md ${activeTab === status ? 'ring-2 ring-orange-500 border-orange-500' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <config.icon className={`h-6 w-6 text-${config.color}-600`} />
                            <span className="text-2xl font-bold text-gray-900">{stats[status] || 0}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{config.label}</p>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-1 px-4" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); }}
                                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Description */}
                {activeTab !== 'all' && activeTab !== 'done' && SIMPLE_STATUS_CONFIG[activeTab] && (
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm text-gray-600">{SIMPLE_STATUS_CONFIG[activeTab].description}</p>
                    </div>
                )}

                {/* Search */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or subject..."
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearchSubmit}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            Search
                        </button>
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
                            <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No submissions found in this category.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((submission) => {
                                const simpleStatus = getSimpleStatus(submission.status);
                                const statusConfig = SIMPLE_STATUS_CONFIG[simpleStatus];

                                return (
                                    <div
                                        key={submission.id}
                                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <PhoneIcon className="h-4 w-4" />
                                                        {submission.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        {submission.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="h-4 w-4" />
                                                        {formatDate(submission.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(submission.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Subject & Message */}
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                <span className="text-gray-500">Subject:</span> {submission.subject}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{submission.message}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                            {/* Contact Actions */}
                                            <a
                                                href={`mailto:${submission.email}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <EnvelopeIcon className="h-4 w-4" />
                                                Email
                                            </a>
                                            <a
                                                href={`tel:${submission.phone}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                                <PhoneIcon className="h-4 w-4" />
                                                Call
                                            </a>

                                            {/* Status Change Actions */}
                                            <div className="flex-1"></div>
                                            {getStatusActions(submission).map((action) => (
                                                <button
                                                    key={action.status}
                                                    onClick={() => handleStatusUpdate(submission.id, action.status)}
                                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${action.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                                            action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                                                'bg-gray-600 hover:bg-gray-700 text-white'
                                                        }`}
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactDashboardSimple;
