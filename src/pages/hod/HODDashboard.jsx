import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { leaveRequests, students, faculty } from '../../data/mockData';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ClipboardList,
  X,
  MessageSquare,
} from 'lucide-react';

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

const HODDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'HOD';

  const [localLeaves, setLocalLeaves] = useState([...leaveRequests]);

  // Stats
  const totalRequests = localLeaves.length;
  const pendingHOD = localLeaves.filter(
    (l) => l.advisorStatus === 'approved' && l.hodStatus === 'pending'
  ).length;
  const approvedCount = localLeaves.filter((l) => l.hodStatus === 'approved').length;
  const rejectedCount = localLeaves.filter((l) => l.hodStatus === 'rejected').length;

  // Pending HOD approval (advisor already approved)
  const pendingForHOD = localLeaves.filter(
    (l) => l.advisorStatus === 'approved' && l.hodStatus === 'pending'
  );

  // Analytics
  const typeDistribution = useMemo(() => {
    const counts = { OD: 0, Medical: 0, Personal: 0 };
    localLeaves.forEach((l) => { counts[l.type] = (counts[l.type] || 0) + 1; });
    const total = localLeaves.length || 1;
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      pct: ((count / total) * 100).toFixed(0),
    }));
  }, [localLeaves]);

  const typeBarColors = { OD: 'bg-blue-500', Medical: 'bg-purple-500', Personal: 'bg-orange-500' };

  // Top students by leave count
  const topStudents = useMemo(() => {
    const map = {};
    localLeaves.forEach((l) => {
      map[l.studentName] = (map[l.studentName] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }, [localLeaves]);

  // Modal
  const [modal, setModal] = useState(null);
  const [remarks, setRemarks] = useState('');

  const confirmAction = () => {
    if (!modal) return;
    const { leave, action } = modal;
    setLocalLeaves((prev) =>
      prev.map((l) => {
        if (l.id !== leave.id) return l;
        const newHodStatus = action === 'approve' ? 'approved' : 'rejected';
        const newFinalStatus = action === 'approve' ? 'approved' : 'rejected';
        return {
          ...l,
          hodStatus: newHodStatus,
          hodRemarks: remarks || (action === 'approve' ? 'Approved.' : 'Rejected.'),
          finalStatus: newFinalStatus,
        };
      })
    );
    setModal(null);
    setRemarks('');
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DashboardLayout title="HOD Dashboard">
      {/* ── Welcome Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {firstName}! 👋</h2>
          <p className="text-white/80 text-sm">
            {pendingHOD} request{pendingHOD !== 1 ? 's' : ''} awaiting your final approval.
          </p>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Requests" value={totalRequests} icon={ClipboardList} color="indigo" />
        <StatCard label="Pending Approval" value={pendingHOD} icon={Clock} color="yellow" trendLabel="Awaiting you" />
        <StatCard label="Approved" value={approvedCount} icon={CheckCircle} color="green" trendLabel="Finalized" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} color="red" trendLabel="Denied" />
      </div>

      {/* ── Middle Grid ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Pending Your Approval */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Pending Your Approval
            {pendingForHOD.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {pendingForHOD.length}
              </span>
            )}
          </h3>

          {pendingForHOD.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">All clear! No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingForHOD.map((lr) => (
                <div
                  key={lr.id}
                  className="border-l-4 border-yellow-400 bg-yellow-50/50 rounded-r-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">{lr.studentName}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                          {lr.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {lr.fromDate} → {lr.toDate} · {getDays(lr.fromDate, lr.toDate)} days
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Advisor: ✅ Approved</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <button
                        onClick={() => { setModal({ leave: lr, action: 'approve' }); setRemarks(''); }}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { setModal({ leave: lr, action: 'reject' }); setRemarks(''); }}
                        className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Analytics</h3>

          {/* Type Distribution */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Leave Type Distribution</p>
            <div className="space-y-3">
              {typeDistribution.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.type}</span>
                    <span className="text-xs font-semibold text-gray-700">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${typeBarColors[item.type]} transition-all`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Students */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Top Students by Leave Count</p>
            <div className="space-y-2">
              {topStudents.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">{s.name}</span>
                  <span className="text-xs font-semibold text-gray-500">{s.count} leaves</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width All Requests Table ──────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">All Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Dept</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Dates</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Advisor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">HOD</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Final</th>
              </tr>
            </thead>
            <tbody>
              {localLeaves.map((lr) => (
                <tr key={lr.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{lr.studentName}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{lr.department}</td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                      {lr.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                    {lr.fromDate} → {lr.toDate}
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

export default HODDashboard;
