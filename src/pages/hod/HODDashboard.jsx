import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, getLeaveRequests, updateLeaveStatus } from '../../services/api';
import { List, Clock, CheckCircle, Users } from 'lucide-react';

const typeBadge = {
  OD: 'bg-blue-100 text-blue-700',
  Medical: 'bg-purple-100 text-purple-700',
  Personal: 'bg-orange-100 text-orange-700',
};

const normalizeLeave = (leave) => ({
  ...leave,
  type: leave.leave_type,
  studentName: leave.student_name,
  studentId: leave.student_id,
  from: leave.start_date?.slice(0, 10),
  to: leave.end_date?.slice(0, 10),
  advisorStatus: leave.advisor_status,
  hodStatus: leave.hod_status,
  finalStatus: leave.final_status,
});

export default function HODDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const [leavesRes, studentsRes] = await Promise.all([
          getLeaveRequests({ scope: 'hodAll' }),
          getEmployees({ role: 'hod' }),
        ]);
        if (!active) return;
        setLeaves((leavesRes.leaves || []).map(normalizeLeave));
        setStudents(studentsRes.students || []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load HOD dashboard.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const advisorApproved = leaves.filter((leave) => leave.advisorStatus === 'approved' && leave.hodStatus === 'pending');
  const odCount = leaves.filter((leave) => leave.type === 'OD').length;
  const medCount = leaves.filter((leave) => leave.type === 'Medical').length;
  const perCount = leaves.filter((leave) => leave.type === 'Personal').length;
  const total = leaves.length;
  const topStudents = [...students]
    .map((student) => ({ ...student, leaveCount: leaves.filter((leave) => leave.studentId === student.id).length }))
    .sort((a, b) => b.leaveCount - a.leaveCount)
    .slice(0, 3);

  const handleHOD = async (id, status) => {
    try {
      setError('');
      const remarks = status === 'rejected' ? window.prompt('Enter rejection remarks') : '';
      if (status === 'rejected' && !remarks) return;
      await updateLeaveStatus({ id, status, reviewer: 'hod', remarks });
      setLeaves((prev) => prev.map((leave) =>
        leave.id === id ? { ...leave, hodStatus: status, finalStatus: status, hod_remarks: remarks || null } : leave
      ));
    } catch (err) {
      setError(err.message || 'Failed to update leave request.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="HOD Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="HOD Dashboard">
      <div className="flex flex-col gap-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>}
        <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"></div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-white/80 text-sm mt-1">Oversee all department leave requests</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={leaves.length} icon={List} color="indigo" trendLabel="All time" />
          <StatCard label="Pending Approval" value={advisorApproved.length} icon={Clock} color="yellow" trendLabel="Needs your action" />
          <StatCard label="Approved" value={leaves.filter((leave) => leave.hodStatus === 'approved').length} icon={CheckCircle} color="green" trendLabel="This month" />
          <StatCard label="Total Students" value={students.length} icon={Users} color="blue" trendLabel="In department" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Pending Your Approval</h3>
              {advisorApproved.length > 0 && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{advisorApproved.length} pending</span>}
            </div>
            {advisorApproved.length === 0 ? (
              <div className="text-center py-8"><p className="text-gray-500 text-sm">No leave requests found.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {advisorApproved.map((leave) => (
                  <div key={leave.id} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50/50 rounded-r-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{leave.studentName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span>
                        </div>
                        <p className="text-xs text-gray-500">{leave.from} to {leave.to} • {leave.days} days</p>
                        <p className="text-xs text-gray-400 mt-0.5">Advisor approved</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleHOD(leave.id, 'approved')} className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">Approve</button>
                        <button onClick={() => handleHOD(leave.id, 'rejected')} className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Leave Type Distribution</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'OD', count: odCount, color: 'bg-blue-500' },
                { label: 'Medical', count: medCount, color: 'bg-purple-500' },
                { label: 'Personal', count: perCount, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.count} requests</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: total ? `${(item.count / total) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Top students by leaves</h4>
              {topStudents.length === 0 ? (
                <p className="text-sm text-gray-500">No student data available.</p>
              ) : (
                topStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">{student.name?.charAt(0)}</div>
                      <span className="text-sm text-gray-700">{student.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{student.leaveCount} leaves</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
