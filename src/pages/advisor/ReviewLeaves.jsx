import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getLeaveRequests, updateLeaveStatus } from '../../services/api';

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

const normalizeLeave = (leave) => ({
  ...leave,
  type: leave.leave_type,
  studentName: leave.student_name,
  from: leave.start_date?.slice(0, 10),
  to: leave.end_date?.slice(0, 10),
  advisorStatus: leave.advisor_status,
});

export default function ReviewLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadLeaves = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getLeaveRequests({ scope: 'advisorAll' });
        if (!active) return;
        setLeaves((data.leaves || []).map(normalizeLeave));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load leave requests.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLeaves();
    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'all' ? leaves : leaves.filter((leave) => leave.advisorStatus === filter);

  const updateStatus = async (id, status) => {
    try {
      setError('');
      const remarks = status === 'rejected' ? window.prompt('Enter rejection remarks') : '';
      if (status === 'rejected' && !remarks) return;
      await updateLeaveStatus({ id, status, reviewer: 'advisor', remarks });
      setLeaves((prev) => prev.map((leave) =>
        leave.id === id ? { ...leave, advisorStatus: status, advisor_remarks: remarks || null } : leave
      ));
    } catch (err) {
      setError(err.message || 'Failed to update leave request.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Review Requests">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Review Requests">
      <div className="flex flex-col gap-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((value) => (
            <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === value ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {value}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student', 'Type', 'Dates', 'Days', 'Reason', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <p className="text-gray-500 font-medium text-sm">No leave requests found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((leave) => (
                    <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{leave.studentName}</td>
                      <td className="px-4 py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span></td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{leave.from} to {leave.to}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-700">{leave.days}d</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs truncate">{leave.reason}</td>
                      <td className="px-4 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.advisorStatus]}`}>{leave.advisorStatus}</span></td>
                      <td className="px-4 py-3.5">
                        {leave.advisorStatus === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => updateStatus(leave.id, 'approved')} className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">Approve</button>
                            <button onClick={() => updateStatus(leave.id, 'rejected')} className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
