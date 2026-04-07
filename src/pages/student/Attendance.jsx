import DashboardLayout from '../../layouts/DashboardLayout';
<<<<<<< HEAD
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
=======
import { mockAttendance } from '../../data/mockData';
import StatCard from '../../components/StatCard';
import { BarChart2, BookOpen, XCircle } from 'lucide-react';

export default function Attendance() {
  const pct = (s) => Math.round((s.present / s.total) * 100);
  const pctColor = (p) => p >= 75 ? 'bg-green-500' : p >= 65 ? 'bg-yellow-500' : 'bg-red-500';
  const pctText = (p) => p >= 75 ? 'text-green-600' : p >= 65 ? 'text-yellow-600' : 'text-red-600';

  return (
    <DashboardLayout title="Attendance">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Overall Attendance" value={`${mockAttendance.overall}%`} icon={BarChart2} color="indigo" trendLabel={mockAttendance.overall >= 75 ? '✓ Above threshold' : '⚠ Below 75%'} />
          <StatCard label="Classes Attended" value={mockAttendance.attended} icon={BookOpen} color="green" trendLabel={`Out of ${mockAttendance.totalClasses}`} />
          <StatCard label="Classes Missed" value={mockAttendance.totalClasses - mockAttendance.attended} icon={XCircle} color="red" trendLabel="Total absences" />
        </div>

        {mockAttendance.overall < 75 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-red-700 font-semibold text-sm">Your attendance is below the required 75%</p>
              <p className="text-red-600 text-xs mt-1">Please attend all classes and avoid applying personal leaves until attendance improves.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Subject-wise Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Subject', 'Total Classes', 'Present', 'Absent', 'Percentage'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAttendance.subjects.map(sub => (
                  <tr key={sub.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">{sub.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{sub.total}</td>
                    <td className="px-5 py-4 text-sm text-green-600 font-medium">{sub.present}</td>
                    <td className="px-5 py-4 text-sm text-red-500 font-medium">{sub.absent}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-16">
                          <div className={`h-full rounded-full ${pctColor(pct(sub))}`} style={{ width: `${pct(sub)}%` }}></div>
                        </div>
                        <span className={`text-sm font-semibold w-12 ${pctText(pct(sub))}`}>{pct(sub)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
        </div>
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
};

export default Attendance;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
