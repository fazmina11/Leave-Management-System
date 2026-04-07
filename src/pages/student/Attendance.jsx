import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { getAttendance } from '../../services/api';
import { BarChart2, BookOpen, XCircle } from 'lucide-react';

export default function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAttendance();
        if (!active) return;
        setAttendance(data.attendance || null);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load attendance.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAttendance();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Attendance">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>
      </DashboardLayout>
    );
  }

  const percentage = attendance?.percentage ?? 0;
  const attended = attendance?.attended_classes ?? 0;
  const totalClasses = attendance?.total_classes ?? 0;
  const missedClasses = attendance?.missed_classes ?? 0;

  return (
    <DashboardLayout title="Attendance">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Overall Attendance" value={`${percentage}%`} icon={BarChart2} color="indigo" trendLabel={percentage >= 75 ? 'Above threshold' : 'Below 75%'} />
          <StatCard label="Classes Attended" value={attended} icon={BookOpen} color="green" trendLabel={`Out of ${totalClasses}`} />
          <StatCard label="Classes Missed" value={missedClasses} icon={XCircle} color="red" trendLabel="Total absences" />
        </div>

        {percentage < 75 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <div>
              <p className="text-red-700 font-semibold text-sm">Your attendance is below the required 75%</p>
              <p className="text-red-600 text-xs mt-1">Please attend all classes and avoid applying personal leaves until attendance improves.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Attendance Summary</h3>
          <p className="text-sm text-gray-500">Subject-wise attendance is not available from the current API yet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
