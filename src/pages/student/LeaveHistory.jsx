import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { leaveRequests } from '../../data/mockData';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_CLS = {
  OD:       'bg-blue-100 text-blue-700',
  Medical:  'bg-purple-100 text-purple-700',
  Personal: 'bg-orange-100 text-orange-700',
};
const STATUS_CLS = {
  Approved: 'bg-green-100 text-green-700',
  Pending:  'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
};

function Pill({ text, cls }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}

export default function LeaveHistory() {
  const myLeaves = leaveRequests.filter((l) => l.studentId === 's1');

  const [search,   setSearch]   = useState('');
  const [typeF,    setTypeF]    = useState('All');
  const [statusF,  setStatusF]  = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = myLeaves.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.type.toLowerCase().includes(q) || l.reason.toLowerCase().includes(q)) &&
      (typeF   === 'All' || l.type        === typeF)   &&
      (statusF === 'All' || l.finalStatus === statusF)
    );
  });

  const stats = {
    total:    myLeaves.length,
    approved: myLeaves.filter((l) => l.finalStatus === 'Approved').length,
    pending:  myLeaves.filter((l) => l.finalStatus === 'Pending').length,
    rejected: myLeaves.filter((l) => l.finalStatus === 'Rejected').length,
  };

  return (
    <DashboardLayout title="Leave History">

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaves…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:ring-2 focus:ring-indigo-400 outline-none" />
        </div>
        <select value={typeF} onChange={(e) => setTypeF(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600
                     outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>OD</option>
          <option>Medical</option>
          <option>Personal</option>
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600
                     outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none">
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Total',    val: stats.total,    cls: 'bg-gray-100 text-gray-700'    },
          { label: 'Approved', val: stats.approved, cls: 'bg-green-100 text-green-700'  },
          { label: 'Pending',  val: stats.pending,  cls: 'bg-yellow-100 text-yellow-700' },
          { label: 'Rejected', val: stats.rejected, cls: 'bg-red-100 text-red-700'      },
        ].map(({ label, val, cls }) => (
          <span key={label} className={`${cls} px-4 py-1.5 rounded-full text-sm font-medium`}>
            {label}: {val}
          </span>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4 text-gray-400">
            <span className="text-5xl">📋</span>
            <p className="font-semibold text-sm">No leave requests found</p>
            <p className="text-xs">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Type', 'From', 'To', 'Days', 'Reason', 'Advisor', 'HOD', 'Final', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l, i) => (
                  <>
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-4">
                        <Pill text={l.type} cls={TYPE_CLS[l.type] ?? 'bg-gray-100 text-gray-700'} />
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{l.from}</td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{l.to}</td>
                      <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">{l.days}d</td>
                      <td className="px-4 py-4 max-w-[180px]">
                        <p className="text-xs text-gray-600 truncate">{l.reason}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.advisorStatus} cls={STATUS_CLS[l.advisorStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.hodStatus} cls={STATUS_CLS[l.hodStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <Pill text={l.finalStatus} cls={STATUS_CLS[l.finalStatus] ?? ''} />
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600
                                     hover:text-indigo-800 cursor-pointer whitespace-nowrap">
                          {expanded === l.id ? <><ChevronUp className="w-3.5 h-3.5" />Hide</> : <><ChevronDown className="w-3.5 h-3.5" />View</>}
                        </button>
                      </td>
                    </tr>
                    {expanded === l.id && (
                      <tr key={`${l.id}-exp`} className="bg-indigo-50/20">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Full Reason</p>
                              <p className="text-gray-600 text-xs leading-relaxed">{l.reason}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Remarks</p>
                              <p className="text-gray-600 text-xs">
                                {l.hodNote || l.advisorNote || <span className="italic text-gray-400">No remarks yet</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
