<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { leaveRequests, attendance } from '../../data/mockData';
import { CheckCircle, Clock, XCircle, ArrowRight, FilePlus } from 'lucide-react';

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

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Filter leaves for current user
  const myLeaves = leaveRequests.filter((lr) => lr.studentId === user?.id);
  const approved = myLeaves.filter((lr) => lr.finalStatus === 'approved').length;
  const pending = myLeaves.filter((lr) => lr.finalStatus === 'pending').length;
  const rejected = myLeaves.filter((lr) => lr.finalStatus === 'rejected').length;

  // Most recent 5 leaves
  const recentLeaves = [...myLeaves]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  // Attendance
  const pct = attendance.overallPercentage;
  const circumference = 2 * Math.PI * 54; // radius=54
  const strokeDash = (pct / 100) * circumference;

  // Day count helper
  const getDays = (from, to) => {
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* ── Welcome Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, {firstName}! 👋
            </h2>
            <p className="text-white/80 text-sm">
              Here&apos;s an overview of your leave activity and attendance.
            </p>
          </div>
          <Link
            to="/student/apply"
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm flex-shrink-0"
          >
            <FilePlus className="w-4 h-4" />
            Apply Leave
          </Link>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Approved" value={approved} icon={CheckCircle} color="green" trendLabel="Finalized" />
        <StatCard label="Pending" value={pending} icon={Clock} color="yellow" trendLabel="Awaiting review" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} color="red" trendLabel="Not approved" />
      </div>

      {/* ── Bottom Grid: Attendance + Recent Requests ─── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Attendance</h3>

          {/* SVG Circular Progress */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                />
                {/* Progress circle */}
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={pct >= 75 ? '#4f46e5' : '#ef4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - strokeDash}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{pct}%</span>
                <span className="text-xs text-gray-400">Overall</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              {attendance.attended} / {attendance.totalClasses} classes
            </p>
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                pct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {pct >= 75 ? 'Good Standing' : 'Below Threshold'}
            </span>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Recent Requests</h3>
            <Link
              to="/student/history"
              className="text-indigo-600 text-xs font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeaves.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No leave requests yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">From</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">To</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Days</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((lr) => (
                    <tr key={lr.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[lr.type]}`}>
                          {lr.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{lr.fromDate}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{lr.toDate}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{getDays(lr.fromDate, lr.toDate)}</td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[lr.finalStatus]}`}>
                          {lr.finalStatus}
                        </span>
=======
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { mockLeaves, mockAttendance } from '../../data/mockData';
import { CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };
const statusBadge = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const myLeaves = mockLeaves.filter(l => l.studentId === 1);
  const approved = myLeaves.filter(l => l.finalStatus === 'approved').length;
  const pending = myLeaves.filter(l => l.finalStatus === 'pending').length;
  const rejected = myLeaves.filter(l => l.finalStatus === 'rejected').length;

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-10 -right-4 w-32 h-32 rounded-full bg-white/5"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-white/80 text-sm mt-1">Here's your leave summary for this semester</p>
              <Link to="/student/apply" className="inline-block mt-4 bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                + Apply Leave
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Approved Leaves" value={approved} icon={CheckCircle} color="green" trendLabel="↑ 66% approval rate" />
          <StatCard label="Pending Requests" value={pending} icon={Clock} color="yellow" trendLabel="Awaiting review" />
          <StatCard label="Rejected Leaves" value={rejected} icon={XCircle} color="red" trendLabel="Review reasons below" />
        </div>

        {/* Attendance + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Attendance</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#4f46e5" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - mockAttendance.overall / 100)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{mockAttendance.overall}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{mockAttendance.attended} / {mockAttendance.totalClasses} classes</p>
              {mockAttendance.overall < 75 && (
                <div className="mt-4 w-full bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                  <p className="text-red-600 text-xs font-medium">⚠️ Below 75% threshold</p>
                </div>
              )}
              {mockAttendance.overall >= 75 && (
                <div className="mt-4 w-full bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-green-600 text-xs font-medium">✓ Above required threshold</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Leaves Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recent Requests</h3>
              <Link to="/student/history" className="text-sm text-indigo-600 flex items-center gap-1 hover:underline">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">From</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">To</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">Days</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.slice(0, 4).map(leave => (
                    <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span>
                      </td>
                      <td className="py-3.5 text-sm text-gray-600">{leave.from}</td>
                      <td className="py-3.5 text-sm text-gray-600">{leave.to}</td>
                      <td className="py-3.5 text-sm font-medium text-gray-700">{leave.days}d</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.finalStatus]}`}>{leave.finalStatus}</span>
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<<<<<<< HEAD
          )}
=======
          </div>
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
        </div>
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
};

export default StudentDashboard;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
