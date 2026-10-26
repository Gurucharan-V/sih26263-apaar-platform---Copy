import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  Send, 
  User, 
  Building2, 
  FileText, 
  Check, 
  X, 
  Eye, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useQueries, StudentQuery } from '../../hooks/useQueries';
import toast from 'react-hot-toast';

export default function QueryControlCenter() {
  const { queries, updateQueryStatus } = useQueries();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState<StudentQuery | null>(null);
  const [moderatorReply, setModeratorReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter queries
  const filteredQueries = queries.filter((q) => {
    const matchesFilter =
      selectedFilter === 'ALL'
        ? true
        : selectedFilter === 'CRITICAL'
        ? q.priority === 'CRITICAL' || q.priority === 'HIGH'
        : q.status === selectedFilter;

    const matchesSearch =
      q.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.apaarId.includes(searchQuery) ||
      q.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalCount = queries.length;
  const pendingCount = queries.filter((q) => q.status === 'PENDING_REVIEW').length;
  const inProgressCount = queries.filter((q) => q.status === 'IN_PROGRESS').length;
  const resolvedCount = queries.filter((q) => q.status === 'RESOLVED').length;
  const criticalCount = queries.filter((q) => q.priority === 'CRITICAL' || q.priority === 'HIGH').length;

  const handleOpenDetail = (q: StudentQuery) => {
    setActiveQuery(q);
    setModeratorReply(q.moderatorNotes || '');
  };

  const handleResolve = (newStatus: StudentQuery['status']) => {
    if (!activeQuery) return;
    setIsSubmitting(true);

    setTimeout(() => {
      updateQueryStatus(activeQuery.id, newStatus, moderatorReply, 'Dr. V. K. Sharma (State Admin & Moderator)');
      setIsSubmitting(false);
      setActiveQuery((prev) => prev ? { ...prev, status: newStatus, moderatorNotes: moderatorReply } : null);

      if (newStatus === 'RESOLVED') {
        toast.success(`Query #${activeQuery.id} resolved and official student registry updated!`);
      } else if (newStatus === 'IN_PROGRESS') {
        toast.success(`Query #${activeQuery.id} marked as In Progress with notes saved.`);
      } else {
        toast(`Query #${activeQuery.id} status updated to ${newStatus}.`, { icon: 'ℹ️' });
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Central Query & Grievance Control Center
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            National moderator oversight: triage, inspect student records, and resolve queries across all institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Synchronized with National MoE Gateway')}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync MoE Gateway</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div 
          onClick={() => setSelectedFilter('ALL')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedFilter === 'ALL'
              ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-100'
              : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">Total Queries</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">All Institutions</div>
        </div>

        <div 
          onClick={() => setSelectedFilter('PENDING_REVIEW')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedFilter === 'PENDING_REVIEW'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-100'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">Pending Review</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting Triage</div>
        </div>

        <div 
          onClick={() => setSelectedFilter('IN_PROGRESS')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedFilter === 'IN_PROGRESS'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-100'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">In Progress</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Under Investigation</div>
        </div>

        <div 
          onClick={() => setSelectedFilter('RESOLVED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedFilter === 'RESOLVED'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-100'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">Resolved</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Closed & Synced</div>
        </div>

        <div 
          onClick={() => setSelectedFilter('CRITICAL')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedFilter === 'CRITICAL'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-100'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">High / Critical</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Needs Urgent Action</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, APAAR ID, institution, query ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'PENDING_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CRITICAL'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === filter
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'ALL'
                ? 'All'
                : filter === 'PENDING_REVIEW'
                ? 'Pending'
                : filter === 'IN_PROGRESS'
                ? 'In Progress'
                : filter === 'RESOLVED'
                ? 'Resolved'
                : 'Urgent'}
            </button>
          ))}
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Student & APAAR</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Query Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Moderator Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No queries found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => {
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono text-xs font-bold text-purple-700">
                        {q.id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{q.studentName}</div>
                        <div className="font-mono text-xs text-blue-600">{q.apaarId}</div>
                      </td>
                      <td className="p-3.5 text-xs text-slate-600 max-w-[200px] truncate">
                        {q.institution}
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs font-medium text-slate-800 block truncate max-w-[240px]" title={q.subject}>
                          {q.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {q.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.priority === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : q.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            q.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.status === 'RESOLVED' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : q.status === 'IN_PROGRESS' ? (
                            <Clock className="w-3 h-3 text-blue-600" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                          )}
                          {q.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenDetail(q)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect & Resolve</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODERATOR QUERY INSPECTION & RESOLUTION MODAL */}
      {activeQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-purple-950 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-300">
                      {activeQuery.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-bold uppercase">
                      {activeQuery.priority} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-0.5">
                    Query Investigation & Resolution Desk
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveQuery(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Student Identity Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Student Name</span>
                  <span className="font-bold text-slate-800 text-sm">{activeQuery.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Verified APAAR ID</span>
                  <span className="font-mono font-bold text-blue-700">{activeQuery.apaarId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Institution</span>
                  <span className="font-semibold text-slate-800">{activeQuery.institution}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Category</span>
                  <span className="font-medium text-slate-700">{activeQuery.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Logged At</span>
                  <span className="font-mono text-slate-600">{activeQuery.createdAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Current Status</span>
                  <span className="font-bold text-purple-700">{activeQuery.status}</span>
                </div>
              </div>

              {/* Subject & Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </label>
                <div className="p-3 bg-slate-100/70 rounded-xl font-medium text-sm text-slate-900 border border-slate-200">
                  {activeQuery.subject}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Student Grievance Description
                </label>
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 leading-relaxed">
                  {activeQuery.description}
                </div>
              </div>

              {/* Moderator Official Resolution Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center justify-between">
                  <span>Moderator Resolution & Notes (Student will see this)</span>
                  <span className="text-[10px] text-slate-400">Audited MoE Action</span>
                </label>
                <textarea
                  rows={3}
                  value={moderatorReply}
                  onChange={(e) => setModeratorReply(e.target.value)}
                  placeholder="Enter official resolution details, e.g.: 'Verified against Anna University central database. APAAR record name updated to match official matriculation certificate.'"
                  className="w-full p-3 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleResolve('IN_PROGRESS')}
                    className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition"
                  >
                    Mark In Progress
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleResolve('REJECTED')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition"
                  >
                    Reject Grievance
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveQuery(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleResolve('RESOLVED')}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Resolve Query</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
