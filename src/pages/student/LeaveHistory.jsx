<<<<<<< HEAD
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
=======
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { leaveRequests } from '../../data/mockData';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_CLS = {
  OD:       'bg-blue-100 text-blue-700',
  Medical:  'bg-purple-100 text-purple-700',
  Personal: 'bg-orange-100 text-orange-700',
};
const STATUS_CLS = {
  Approved: 'bg-green-100 text-green-700',
  Pending:  'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
};

function Pill({ text, cls }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}

export default function LeaveHistory() {
  const myLeaves = leaveRequests.filter((l) => l.studentId === 's1');

  const [search,   setSearch]   = useState('');
  const [typeF,    setTypeF]    = useState('All');
  const [statusF,  setStatusF]  = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = myLeaves.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.type.toLowerCase().includes(q) || l.reason.toLowerCase().includes(q)) &&
      (typeF   === 'All' || l.type        === typeF)   &&
      (statusF === 'All' || l.finalStatus === statusF)
    );
  });

  const stats = {
    total:    myLeaves.length,
    approved: myLeaves.filter((l) => l.finalStatus === 'Approved').length,
    pending:  myLeaves.filter((l) => l.finalStatus === 'Pending').length,
    rejected: myLeaves.filter((l) => l.finalStatus === 'Rejected').length,
  };

  return (
    <DashboardLayout title="Leave History">

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaves…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:ring-2 focus:ring-indigo-400 outline-none" />
        </div>
        <select value={typeF} onChange={(e) => setTypeF(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600
                     outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>OD</option>
          <option>Medical</option>
          <option>Personal</option>
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600
                     outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Total',    val: stats.total,    cls: 'bg-gray-100 text-gray-700'    },
          { label: 'Approved', val: stats.approved, cls: 'bg-green-100 text-green-700'  },
          { label: 'Pending',  val: stats.pending,  cls: 'bg-yellow-100 text-yellow-700' },
          { label: 'Rejected', val: stats.rejected, cls: 'bg-red-100 text-red-700'      },
        ].map(({ label, val, cls }) => (
          <span key={label} className={`${cls} px-4 py-1.5 rounded-full text-sm font-medium`}>
            {label}: {val}
          </span>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4 text-gray-400">
            <span className="text-5xl">📋</span>
            <p className="font-semibold text-sm">No leave requests found</p>
            <p className="text-xs">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Type', 'From', 'To', 'Days', 'Reason', 'Advisor', 'HOD', 'Final', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l, i) => (
                  <>
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-4">
                        <Pill text={l.type} cls={TYPE_CLS[l.type] ?? 'bg-gray-100 text-gray-700'} />
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{l.from}</td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{l.to}</td>
                      <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">{l.days}d</td>
                      <td className="px-4 py-4 max-w-[180px]">
                        <p className="text-xs text-gray-600 truncate">{l.reason}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.advisorStatus} cls={STATUS_CLS[l.advisorStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.hodStatus} cls={STATUS_CLS[l.hodStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.finalStatus} cls={STATUS_CLS[l.finalStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600
                                     hover:text-indigo-800 cursor-pointer whitespace-nowrap">
                          {expanded === l.id ? <><ChevronUp className="w-3.5 h-3.5" />Hide</> : <><ChevronDown className="w-3.5 h-3.5" />View</>}
                        </button>
                      </td>
                    </tr>
                    {expanded === l.id && (
                      <tr key={`${l.id}-exp`} className="bg-indigo-50/20">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Full Reason</p>
                              <p className="text-gray-600 text-xs leading-relaxed">{l.reason}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Remarks</p>
                              <p className="text-gray-600 text-xs">
                                {l.hodNote || l.advisorNote || <span className="italic text-gray-400">No remarks yet</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
};

export default LeaveHistory;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
