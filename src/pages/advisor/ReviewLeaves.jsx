import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { leaveRequests, students } from '../../data/mockData';
import { X, MessageSquare, Inbox } from 'lucide-react';

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

const getDays = (from, to) => {
  const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff) + 1);
};

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const ReviewLeaves = () => {
  const { user } = useAuth();

  const myStudentIds = students
    .filter((s) => s.advisorId === user?.id)
    .map((s) => s.id);

  const [localLeaves, setLocalLeaves] = useState(
    leaveRequests.filter((lr) => myStudentIds.includes(lr.studentId))
  );
  const [activeTab, setActiveTab] = useState('all');
  const [modal, setModal] = useState(null);
  const [remarks, setRemarks] = useState('');

  // Filtered
  const filtered = useMemo(() => {
    if (activeTab === 'all') return localLeaves;
    return localLeaves.filter((l) => l.advisorStatus === activeTab);
  }, [localLeaves, activeTab]);

  // Tab counts
  const counts = {
    all: localLeaves.length,
    pending: localLeaves.filter((l) => l.advisorStatus === 'pending').length,
    approved: localLeaves.filter((l) => l.advisorStatus === 'approved').length,
    rejected: localLeaves.filter((l) => l.advisorStatus === 'rejected').length,
  };

  const openModal = (leave, action) => {
    setModal({ leave, action });
    setRemarks('');
  };

  const confirmAction = () => {
    if (!modal) return;
    const { leave, action } = modal;
    setLocalLeaves((prev) =>
      prev.map((l) => {
        if (l.id !== leave.id) return l;
        const newAdvisorStatus = action === 'approve' ? 'approved' : 'rejected';
        const newFinalStatus = action === 'reject' ? 'rejected' : l.hodStatus === 'approved' ? 'approved' : 'pending';
        return {
          ...l,
          advisorStatus: newAdvisorStatus,
          advisorRemarks: remarks || (action === 'approve' ? 'Approved.' : 'Rejected.'),
          finalStatus: newFinalStatus,
        };
      })
    );
    setModal(null);
    setRemarks('');
  };

  return (
    <DashboardLayout title="Review Requests">
      {/* ── Filter Tabs ────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-indigo-200' : 'text-gray-400'}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table Card ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">No requests found</p>
            <p className="text-gray-400 text-xs mt-1">Try selecting a different filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Student</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Dates</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Days</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Reason</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lr) => (
                  <tr key={lr.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{lr.studentName}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                        {lr.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                      {lr.fromDate} → {lr.toDate}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{getDays(lr.fromDate, lr.toDate)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[180px] truncate" title={lr.reason}>
                      {lr.reason}
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[lr.advisorStatus]}`}>
                        {lr.advisorStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {lr.advisorStatus === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(lr, 'approve')}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(lr, 'reject')}
                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Action Modal ───────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {modal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Student</span>
                <span className="text-sm font-medium text-gray-800">{modal.leave.studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Type</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[modal.leave.type]}`}>
                  {modal.leave.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Duration</span>
                <span className="text-sm text-gray-700">
                  {modal.leave.fromDate} → {modal.leave.toDate} ({getDays(modal.leave.fromDate, modal.leave.toDate)} days)
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500 block mb-1">Reason</span>
                <p className="text-sm text-gray-700">{modal.leave.reason}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Remarks (optional)
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your comments..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              {modal.action === 'approve' ? (
                <button
                  onClick={confirmAction}
                  className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
                >
                  Confirm Approve
                </button>
              ) : (
                <button
                  onClick={confirmAction}
                  className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm"
                >
                  Confirm Reject
                </button>
              )}
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReviewLeaves;
