import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { attendance } from '../../data/mockData';
import { Percent, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// ── Color helper for percentage ────────────────────────
const pctColor = (pct) => {
  if (pct >= 75) return { bar: 'bg-green-500', text: 'text-green-600' };
  if (pct >= 65) return { bar: 'bg-yellow-500', text: 'text-yellow-600' };
  return { bar: 'bg-red-500', text: 'text-red-600' };
};

const Attendance = () => {
  const { overallPercentage, totalClasses, attended, subjects } = attendance;
  const missed = totalClasses - attended;

  return (
    <DashboardLayout title="Attendance">
      {/* ── Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Overall Attendance"
          value={`${overallPercentage}%`}
          icon={Percent}
          color="indigo"
          trendLabel={overallPercentage >= 75 ? 'Above threshold' : 'Below threshold'}
        />
        <StatCard
          label="Classes Attended"
          value={attended}
          icon={CheckCircle}
          color="green"
          trendLabel={`Out of ${totalClasses} total`}
        />
        <StatCard
          label="Classes Missed"
          value={missed}
          icon={XCircle}
          color="red"
          trendLabel={`${((missed / totalClasses) * 100).toFixed(1)}% absent rate`}
        />
      </div>

      {/* ── Warning Banner ─────────────────────────────── */}
      {overallPercentage < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700">Attendance Below Threshold</p>
            <p className="text-xs text-red-600">
              Your attendance is below the 75% minimum requirement. Leave requests may be affected.
            </p>
          </div>
        </div>
      )}

      {/* ── Subject Table ──────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Subject-wise Attendance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Subject</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Present</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Absent</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-64">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => {
                const pct = ((subj.present / subj.total) * 100).toFixed(1);
                const colors = pctColor(pct);
                return (
                  <tr key={subj.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800">{subj.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{subj.total}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{subj.present}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{subj.absent}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Progress bar */}
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors.bar} transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {/* Percentage text */}
                        <span className={`text-sm font-semibold w-14 text-right ${colors.text}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
