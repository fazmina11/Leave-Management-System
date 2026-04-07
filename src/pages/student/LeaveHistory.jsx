import { Fragment, useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getLeaveRequests } from '../../services/api';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_CLS = {
  OD: 'bg-blue-100 text-blue-700',
  Medical: 'bg-purple-100 text-purple-700',
  Personal: 'bg-orange-100 text-orange-700',
};

const STATUS_CLS = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

function Pill({ text, cls }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>{text}</span>;
}

const normalizeLeave = (leave) => ({
  ...leave,
  type: leave.leave_type,
  from: leave.start_date?.slice(0, 10),
  to: leave.end_date?.slice(0, 10),
  advisorStatus: leave.advisor_status,
  hodStatus: leave.hod_status,
  finalStatus: leave.final_status,
  remarks: leave.hod_remarks || leave.advisor_remarks || '',
});

export default function LeaveHistory() {
  const [myLeaves, setMyLeaves] = useState([]);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadLeaves = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getLeaveRequests({ scope: 'my' });
        if (!active) return;
        setMyLeaves((data.leaves || []).map(normalizeLeave));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load leave history.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLeaves();
    return () => {
      active = false;
    };
  }, []);

  const filtered = myLeaves.filter((leave) => {
    const q = search.toLowerCase();
    return (
      (leave.type?.toLowerCase().includes(q) || leave.reason?.toLowerCase().includes(q)) &&
      (typeF === 'All' || leave.type === typeF) &&
      (statusF === 'All' || leave.finalStatus === statusF.toLowerCase())
    );
  });

  const stats = {
    total: myLeaves.length,
    approved: myLeaves.filter((leave) => leave.finalStatus === 'approved').length,
    pending: myLeaves.filter((leave) => leave.finalStatus === 'pending').length,
    rejected: myLeaves.filter((leave) => leave.finalStatus === 'rejected').length,
  };

  if (loading) {
    return (
      <DashboardLayout title="Leave History">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Leave History">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm mb-5">{error}</div>}

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leaves..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
        </div>
        <select value={typeF} onChange={(event) => setTypeF(event.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>OD</option>
          <option>Medical</option>
          <option>Personal</option>
        </select>
        <select value={statusF} onChange={(event) => setStatusF(event.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Total', val: stats.total, cls: 'bg-gray-100 text-gray-700' },
          { label: 'Approved', val: stats.approved, cls: 'bg-green-100 text-green-700' },
          { label: 'Pending', val: stats.pending, cls: 'bg-yellow-100 text-yellow-700' },
          { label: 'Rejected', val: stats.rejected, cls: 'bg-red-100 text-red-700' },
        ].map(({ label, val, cls }) => (
          <span key={label} className={`${cls} px-4 py-1.5 rounded-full text-sm font-medium`}>{label}: {val}</span>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4 text-gray-400">
            <p className="font-semibold text-sm">No leave requests found</p>
            <p className="text-xs">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Type', 'From', 'To', 'Days', 'Reason', 'Advisor', 'HOD', 'Final', ''].map((header) => (
                    <th key={header} className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((leave, index) => (
                  <Fragment key={leave.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-400 text-xs">{index + 1}</td>
                      <td className="px-4 py-4"><Pill text={leave.type} cls={TYPE_CLS[leave.type] ?? 'bg-gray-100 text-gray-700'} /></td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{leave.from}</td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{leave.to}</td>
                      <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">{leave.days}d</td>
                      <td className="px-4 py-4 max-w-[180px]"><p className="text-xs text-gray-600 truncate">{leave.reason}</p></td>
                      <td className="px-4 py-4"><Pill text={leave.advisorStatus} cls={STATUS_CLS[leave.advisorStatus] ?? ''} /></td>
                      <td className="px-4 py-4"><Pill text={leave.hodStatus} cls={STATUS_CLS[leave.hodStatus] ?? ''} /></td>
                      <td className="px-4 py-4"><Pill text={leave.finalStatus} cls={STATUS_CLS[leave.finalStatus] ?? ''} /></td>
                      <td className="px-4 py-4">
                        <button onClick={() => setExpanded(expanded === leave.id ? null : leave.id)} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer whitespace-nowrap">
                          {expanded === leave.id ? <><ChevronUp className="w-3.5 h-3.5" />Hide</> : <><ChevronDown className="w-3.5 h-3.5" />View</>}
                        </button>
                      </td>
                    </tr>
                    {expanded === leave.id && (
                      <tr className="bg-indigo-50/20">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Full Reason</p>
                              <p className="text-gray-600 text-xs leading-relaxed">{leave.reason}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Remarks</p>
                              <p className="text-gray-600 text-xs">{leave.remarks || <span className="italic text-gray-400">No remarks yet</span>}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
