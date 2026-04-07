import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { getMyLeaves, getMyAttendance } from '../../api/leaveApi';
import { CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };
const statusBadge = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyLeaves(), getMyAttendance()])
      .then(([leavesRes, attendanceRes]) => {
        setLeaves(leavesRes.data.leaves);
        setAttendance(attendanceRes.data.attendance);
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const approved = leaves.filter((l) => l.final_status === 'approved').length;
  const pending = leaves.filter((l) => l.final_status === 'pending').length;
  const rejected = leaves.filter((l) => l.final_status === 'rejected').length;
  const attendancePct = attendance?.percentage ?? 0;

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-10 -right-4 w-32 h-32 rounded-full bg-white/5"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-white/80 text-sm mt-1">Here's your leave summary for this semester</p>
                <Link to="/student/apply" className="inline-block mt-4 bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  + Apply Leave
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Approved Leaves" value={approved} icon={CheckCircle} color="green" trendLabel="Approval rate" />
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
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - attendancePct / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{attendancePct}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {attendance?.attended_classes ?? 0} / {attendance?.total_classes ?? 0} classes
                </p>
                {attendancePct < 75 ? (
                  <div className="mt-4 w-full bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <p className="text-red-600 text-xs font-medium">Below 75% threshold</p>
                  </div>
                ) : (
                  <div className="mt-4 w-full bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-green-600 text-xs font-medium">Above required threshold</p>
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
                    {leaves.slice(0, 4).map((leave) => (
                      <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[leave.leave_type]}`}>{leave.leave_type}</span>
                        </td>
                        <td className="py-3.5 text-sm text-gray-600">{leave.start_date?.slice(0, 10)}</td>
                        <td className="py-3.5 text-sm text-gray-600">{leave.end_date?.slice(0, 10)}</td>
                        <td className="py-3.5 text-sm font-medium text-gray-700">{leave.days}d</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.final_status]}`}>{leave.final_status}</span>
                        </td>
                      </tr>
                    ))}
                    {leaves.length === 0 && (
                      <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-400">No leave requests yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
