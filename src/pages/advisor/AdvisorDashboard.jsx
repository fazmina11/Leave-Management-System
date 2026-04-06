import { useState } from 'react';
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
    setModal(null);
    setRemarks('');
  };

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
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}