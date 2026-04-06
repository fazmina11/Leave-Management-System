import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { mockLeaves, mockStudents } from '../../data/mockData';
import { List, Clock, CheckCircle, Users } from 'lucide-react';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };

export default function HODDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState(mockLeaves);

  const advisorApproved = leaves.filter(l => l.advisorStatus === 'approved' && l.hodStatus === 'pending');

  const handleHOD = (id, status) => {
    setLeaves(prev => prev.map(l =>
      l.id === id ? { ...l, hodStatus: status, finalStatus: status } : l
    ));
  };

  const odCount = leaves.filter(l => l.type === 'OD').length;
  const medCount = leaves.filter(l => l.type === 'Medical').length;
  const perCount = leaves.filter(l => l.type === 'Personal').length;
  const total = leaves.length;

  return (
    <DashboardLayout title="HOD Dashboard">
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"></div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 🏛️</h2>
          <p className="text-white/80 text-sm mt-1">Oversee all department leave requests</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={leaves.length} icon={List} color="indigo" trendLabel="All time" />
          <StatCard label="Pending Approval" value={advisorApproved.length} icon={Clock} color="yellow" trendLabel="Needs your action" />
          <StatCard label="Approved" value={leaves.filter(l => l.hodStatus === 'approved').length} icon={CheckCircle} color="green" trendLabel="This month" />
          <StatCard label="Total Students" value={mockStudents.length} icon={Users} color="blue" trendLabel="In department" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending HOD Approval */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Pending Your Approval</h3>
              {advisorApproved.length > 0 && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{advisorApproved.length} pending</span>}
            </div>
            {advisorApproved.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-gray-500 text-sm">All requests reviewed!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {advisorApproved.map(leave => (
                  <div key={leave.id} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50/50 rounded-r-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{leave.studentName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span>
                        </div>
                        <p className="text-xs text-gray-500">{leave.from} → {leave.to} • {leave.days} days</p>
                        <p className="text-xs text-gray-400 mt-0.5">Advisor approved ✓</p>
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

          {/* Analytics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Leave Type Distribution</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'OD', count: odCount, color: 'bg-blue-500' },
                { label: 'Medical', count: medCount, color: 'bg-purple-500' },
                { label: 'Personal', count: perCount, color: 'bg-orange-500' },
              ].map(item => (
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
              {mockStudents.slice(0, 3).map(s => {
                const count = leaves.filter(l => l.studentId === s.id).length;
                return (
                  <div key={s.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">{s.name.charAt(0)}</div>
                      <span className="text-sm text-gray-700">{s.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{count} leaves</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}