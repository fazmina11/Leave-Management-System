import DashboardLayout from '../../layouts/DashboardLayout';
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
        </div>
      </div>
    </DashboardLayout>
  );
}