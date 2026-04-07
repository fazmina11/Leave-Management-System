import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { leaveRequests } from '../../data/mockData';
import { Search, Filter, Inbox } from 'lucide-react';

// ── Badge helpers ──────────────────────────────────────
const typeBadge = {
  OD: 'bg-blue-100 text-blue-700',
  Medical: 'bg-purple-100 text-purple-700',
  Personal: 'bg-orange-100 text-orange-700',
};

const statusBadge = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const LeaveHistory = () => {
  const { user } = useAuth();

  const myLeaves = leaveRequests.filter((lr) => lr.studentId === user?.id);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Summary counts
  const total = myLeaves.length;
  const approvedCount = myLeaves.filter((l) => l.finalStatus === 'approved').length;
  const pendingCount = myLeaves.filter((l) => l.finalStatus === 'pending').length;
  const rejectedCount = myLeaves.filter((l) => l.finalStatus === 'rejected').length;

  // Filtered leaves
  const filtered = useMemo(() => {
    return myLeaves.filter((lr) => {
      if (typeFilter !== 'all' && lr.type !== typeFilter) return false;
      if (statusFilter !== 'all' && lr.finalStatus !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          lr.reason.toLowerCase().includes(q) ||
          lr.type.toLowerCase().includes(q) ||
          lr.fromDate.includes(q) ||
          lr.toDate.includes(q)
        );
      }
      return true;
    });
  }, [myLeaves, search, typeFilter, statusFilter]);

  // Day count helper
  const getDays = (from, to) => {
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
  };

  const summaryPills = [
    { label: 'Total', count: total, style: 'bg-indigo-100 text-indigo-700' },
    { label: 'Approved', count: approvedCount, style: 'bg-green-100 text-green-700' },
    { label: 'Pending', count: pendingCount, style: 'bg-yellow-100 text-yellow-700' },
    { label: 'Rejected', count: rejectedCount, style: 'bg-red-100 text-red-700' },
  ];

  return (
    <DashboardLayout title="Leave History">
      {/* ── Summary Pills ──────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        {summaryPills.map((pill) => (
          <div
            key={pill.label}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${pill.style}`}
          >
            {pill.label}: {pill.count}
          </div>
        ))}
      </div>

      {/* ── Filter Bar ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reason, type, or date..."
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Type dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white appearance-none"
            >
              <option value="all">All Types</option>
              <option value="OD">OD</option>
              <option value="Medical">Medical</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Table Card ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">No matching records found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">#</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">From</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">To</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Days</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Reason</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Advisor</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">HOD</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Final</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lr, i) => (
                  <tr key={lr.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                        {lr.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{lr.fromDate}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{lr.toDate}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{getDays(lr.fromDate, lr.toDate)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[200px] truncate" title={lr.reason}>
                      {lr.reason}
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[lr.advisorStatus]}`}>
                        {lr.advisorStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[lr.hodStatus]}`}>
                        {lr.hodStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[lr.finalStatus]}`}>
                        {lr.finalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveHistory;
