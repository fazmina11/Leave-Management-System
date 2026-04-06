import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockLeaves } from '../../data/mockData';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };
const statusBadge = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function ReviewLeaves() {
  const [leaves, setLeaves] = useState(mockLeaves);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.advisorStatus === filter);

  const updateStatus = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, advisorStatus: status } : l));
  };

  return (
    <DashboardLayout title="Review Requests">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student', 'Type', 'Dates', 'Days', 'Reason', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(leave => (
                  <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{leave.studentName}</td>
                    <td className="px-4 py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span></td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{leave.from} → {leave.to}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}