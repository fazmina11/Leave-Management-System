import { useState } from 'react';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { leaveRequests, students } from '../../data/mockData';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
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

const AdvisorDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Advisor';

  // All leaves for this advisor's students
  const myStudents = students.filter((s) => s.advisorId === user?.id);
  const myStudentIds = myStudents.map((s) => s.id);

  const [localLeaves, setLocalLeaves] = useState(
    leaveRequests.filter((lr) => myStudentIds.includes(lr.studentId))
  );

  // Stats
  const totalStudents = myStudents.length;
  const pendingCount = localLeaves.filter((l) => l.advisorStatus === 'pending').length;
  const approvedCount = localLeaves.filter((l) => l.advisorStatus === 'approved').length;
  const rejectedCount = localLeaves.filter((l) => l.advisorStatus === 'rejected').length;

  // Pending requests
  const pendingLeaves = localLeaves.filter((l) => l.advisorStatus === 'pending');

  // Students with pending count
  const studentsWithPending = myStudents.map((s) => ({
    ...s,
    pendingCount: localLeaves.filter(
      (l) => l.studentId === s.id && l.advisorStatus === 'pending'
    ).length,
  }));

  // Modal state
  const [modal, setModal] = useState(null); // { leave, action: 'approve'|'reject' }
  const [remarks, setRemarks] = useState('');

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
=======
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { mockLeaves, mockStudents } from '../../data/mockData';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [leaves, setLeaves] = useState(mockLeaves);

  const pendingLeaves = leaves.filter(l => l.advisorStatus === 'pending');

  const handleAction = (action) => {
    setLeaves(prev => prev.map(l =>
      l.id === modal.id ? { ...l, advisorStatus: action, remarks: remarks } : l
    ));
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
    setModal(null);
    setRemarks('');
  };

<<<<<<< HEAD
  // Initials helper
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <DashboardLayout title="Advisor Dashboard">
      {/* ── Welcome Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {firstName}! 👋</h2>
          <p className="text-white/80 text-sm">
            You have {pendingCount} pending request{pendingCount !== 1 ? 's' : ''} to review.
          </p>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="My Students" value={totalStudents} icon={Users} color="indigo" />
        <StatCard label="Pending" value={pendingCount} icon={Clock} color="yellow" trendLabel="Awaiting review" />
        <StatCard label="Approved" value={approvedCount} icon={CheckCircle} color="green" trendLabel="Finalized" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} color="red" trendLabel="Not approved" />
      </div>

      {/* ── Bottom Grid ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Student List */}
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">My Students</h3>
          <div className="space-y-3">
            {studentsWithPending.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                  {getInitials(s.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">Year {s.year} · {s.department}</p>
                </div>
                {s.pendingCount > 0 && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {s.pendingCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Pending Requests
            {pendingLeaves.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {pendingLeaves.length}
              </span>
            )}
          </h3>

          {pendingLeaves.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">All caught up!</p>
              <p className="text-gray-400 text-xs mt-1">No pending requests to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map((lr) => (
                <div key={lr.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">{lr.studentName}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                          {lr.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {lr.fromDate} → {lr.toDate} · {getDays(lr.fromDate, lr.toDate)} day{getDays(lr.fromDate, lr.toDate) !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{lr.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Modal ───────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            {/* Close */}
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {modal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </h3>

            {/* Summary */}
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

            {/* Remarks */}
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

            {/* Actions */}
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
=======
  return (
    <DashboardLayout title="Advisor Dashboard">
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"></div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👩‍🏫</h2>
          <p className="text-white/80 text-sm mt-1">Review and manage your students' leave requests</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Students" value={mockStudents.length} icon={Users} color="indigo" trendLabel="Assigned students" />
          <StatCard label="Pending Review" value={pendingLeaves.length} icon={Clock} color="yellow" trendLabel="Needs attention" />
          <StatCard label="Approved" value={leaves.filter(l => l.advisorStatus === 'approved').length} icon={CheckCircle} color="green" trendLabel="This month" />
          <StatCard label="Rejected" value={leaves.filter(l => l.advisorStatus === 'rejected').length} icon={XCircle} color="red" trendLabel="This month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">My Students</h3>
            <div className="flex flex-col gap-2">
              {mockStudents.slice(0, 5).map(s => {
                const sLeaves = pendingLeaves.filter(l => l.studentId === s.id);
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.year} Year • {s.department}</p>
                    </div>
                    {sLeaves.length > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{sLeaves.length}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Requests */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Pending Leave Requests</h3>
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-gray-500 text-sm">All caught up! No pending requests.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{leave.studentName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span>
                        </div>
                        <p className="text-xs text-gray-500">{leave.from} → {leave.to} • {leave.days} days</p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{leave.reason}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setModal(leave)} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">Approve</button>
                        <button onClick={() => setModal({ ...leave, _action: 'reject' })} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h4 className="font-bold text-gray-800 mb-1">Review Leave Request</h4>
            <p className="text-sm text-gray-500 mb-4">{modal.studentName} — {modal.type} • {modal.days} days</p>
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Reason</p>
              <p className="text-sm text-gray-700">{modal.reason}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Add your comments..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction('approved')} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">✓ Approve</button>
              <button onClick={() => handleAction('rejected')} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">✗ Reject</button>
              <button onClick={() => setModal(null)} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
<<<<<<< HEAD
};

export default AdvisorDashboard;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
