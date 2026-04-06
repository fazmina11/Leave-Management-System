import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockLeaves } from '../../data/mockData';
import { Search } from 'lucide-react';

const typeBadge = { OD: 'bg-blue-100 text-blue-700', Medical: 'bg-purple-100 text-purple-700', Personal: 'bg-orange-100 text-orange-700' };
const statusBadge = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function LeaveHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const myLeaves = mockLeaves.filter(l => l.studentId === 1);

  const filtered = myLeaves.filter(l => {
    const matchSearch = l.reason.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    const matchStatus = statusFilter === 'All' || l.finalStatus === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <DashboardLayout title="Leave History">
      <div className="flex flex-col gap-5">
        {/* Summary pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total', value: myLeaves.length, color: 'bg-gray-100 text-gray-700' },
            { label: 'Approved', value: myLeaves.filter(l => l.finalStatus === 'approved').length, color: 'bg-green-100 text-green-700' },
            { label: 'Pending', value: myLeaves.filter(l => l.finalStatus === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Rejected', value: myLeaves.filter(l => l.finalStatus === 'rejected').length, color: 'bg-red-100 text-red-700' },
          ].map(s => (
            <div key={s.label} className={`px-4 py-2 rounded-xl text-sm font-medium ${s.color}`}>
              {s.label}: <span className="font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by reason..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700">
            <option>All</option><option>OD</option><option>Medical</option><option>Personal</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700">
            <option>All</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 font-medium">No leave requests found</p>
              <p className="text-gray-400 text-sm mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['#', 'Type', 'From', 'To', 'Days', 'Reason', 'Advisor', 'HOD', 'Final'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((leave, i) => (
                    <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge[leave.type]}`}>{leave.type}</span></td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{leave.from}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{leave.to}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-700">{leave.days}d</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs truncate">{leave.reason}</td>
                      <td className="px-4 py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.advisorStatus]}`}>{leave.advisorStatus}</span></td>
                      <td className="px-4 py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.hodStatus]}`}>{leave.hodStatus}</span></td>
                      <td className="px-4 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[leave.finalStatus]}`}>{leave.finalStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}