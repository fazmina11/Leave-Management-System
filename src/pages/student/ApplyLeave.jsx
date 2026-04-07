import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAttendance, createLeaveRequest, getLeaveTypes, getLeaveBalance } from '../../services/api';
import {
  CalendarDays,
  Upload,
  CheckCircle,
  FilePlus,
  AlertCircle,
} from 'lucide-react';

const balanceColors = {
  OD: 'bg-blue-500',
  Medical: 'bg-purple-500',
  Personal: 'bg-orange-500',
};

export default function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ type: '', fromDate: '', toDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [attendanceRes, leaveTypesRes, leaveBalanceRes] = await Promise.allSettled([
          getAttendance(),
          getLeaveTypes(),
          getLeaveBalance(),
        ]);

        if (!active) return;

        if (attendanceRes.status === 'fulfilled') {
          setAttendance(attendanceRes.value.attendance || null);
        }

        if (leaveTypesRes.status === 'fulfilled') {
          setLeaveTypes(leaveTypesRes.value.leaveTypes || []);
        }

        if (leaveBalanceRes.status === 'fulfilled') {
          setLeaveBalance(leaveBalanceRes.value.leaveBalance || {});
        }

        const errorsFound = [attendanceRes, leaveTypesRes, leaveBalanceRes]
          .filter((result) => result.status === 'rejected')
          .map((result) => result.reason?.message)
          .filter(Boolean);

        if (errorsFound.length > 0) {
          setError(errorsFound.join(' '));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const duration = useMemo(() => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const diff = (new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff) + 1);
  }, [formData.fromDate, formData.toDate]);

  const currentPct = attendance?.percentage ?? 0;
  const afterPct = useMemo(() => {
    if (duration <= 0 || !attendance?.total_classes) return currentPct;
    const total = attendance.total_classes;
    const attended = attendance.attended_classes;

    // OD = no attendance reduction
    // Medical = 50% of missed days count against attendance
    // Personal = 100% of missed days count against attendance
    let effectiveMissed = 0;
    if (formData.type === 'OD') {
      effectiveMissed = 0;
    } else if (formData.type === 'Medical') {
      effectiveMissed = duration * 0.5;
    } else if (formData.type === 'Personal') {
      effectiveMissed = duration;
    } else {
      effectiveMissed = duration;
    }

    const newTotal = total + duration;
    const newAttended = attended + (duration - effectiveMissed);
    return Math.max(0, ((newAttended / newTotal) * 100)).toFixed(1);
  }, [attendance, currentPct, duration, formData.type]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.type) nextErrors.type = 'Select a leave type';
    if (!formData.fromDate) nextErrors.fromDate = 'Start date is required';
    if (!formData.toDate) nextErrors.toDate = 'End date is required';
    if (formData.fromDate && formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      nextErrors.toDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) nextErrors.reason = 'Reason is required';
    if (attendance && attendance.total_classes > 0 && attendance.percentage < 75) {
      nextErrors.attendance = 'Your attendance is below 75%. You cannot apply for leave.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setError('');
      await createLeaveRequest({
        leave_type: formData.type,
        start_date: formData.fromDate,
        end_date: formData.toDate,
        reason: formData.reason.trim(),
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ type: '', fromDate: '', toDate: '', reason: '' });
    setErrors({});
    setIsSuccess(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="Apply Leave">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Apply Leave">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm mb-5">{error}</div>}

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Leave Request Submitted!</h3>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">Your request for {duration} day{duration !== 1 ? 's' : ''} has been sent for review.</p>
              <button onClick={handleReset} className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
                <FilePlus className="w-4 h-4" />Apply Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-semibold text-gray-800 mb-5">New Leave Request</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  {leaveTypes.length === 0 ? (
                    <p className="text-sm text-gray-500">No leave types available.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {leaveTypes.map((leaveType) => (
                        <button key={leaveType.key || leaveType.value || leaveType.id} type="button" onClick={() => handleChange('type', leaveType.key || leaveType.value || leaveType.name)} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.type === (leaveType.key || leaveType.value || leaveType.name) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                          <p className={`text-sm font-semibold ${formData.type === (leaveType.key || leaveType.value || leaveType.name) ? 'text-indigo-700' : 'text-gray-700'}`}>{leaveType.label || leaveType.name || leaveType.value || leaveType.key}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{leaveType.description || 'Leave category'}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                  {formData.type && (
                    <p className="text-xs mt-2 text-gray-500">
                      {formData.type === 'OD' && 'OD leaves do not affect your attendance percentage.'}
                      {formData.type === 'Medical' && 'Medical leaves reduce attendance by 50% of leave days.'}
                      {formData.type === 'Personal' && 'Personal leaves count as full absences on your attendance.'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" value={formData.fromDate} onChange={(event) => handleChange('fromDate', event.target.value)} className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${errors.fromDate ? 'border-red-300' : 'border-gray-200'}`} />
                    </div>
                    {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" value={formData.toDate} onChange={(event) => handleChange('toDate', event.target.value)} className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${errors.toDate ? 'border-red-300' : 'border-gray-200'}`} />
                    </div>
                    {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>}
                  </div>
                </div>

                {duration > 0 && <div className="flex items-center gap-2"><span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">{duration} day{duration !== 1 ? 's' : ''}</span><span className="text-xs text-gray-400">leave duration</span></div>}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                  <textarea rows={4} value={formData.reason} onChange={(event) => handleChange('reason', event.target.value)} placeholder="Describe your reason for leave..." className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 resize-none ${errors.reason ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Attachment (optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500"><span className="text-indigo-600 font-medium">Upload support documents</span> if required</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || leaveTypes.length === 0 || (attendance && attendance.total_classes > 0 && attendance.percentage < 75)} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</> : 'Submit Leave Request'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Attendance Impact</h4>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">Current</span><span className="text-xs font-semibold text-gray-700">{currentPct}%</span></div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${currentPct}%` }} /></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">After Leave</span><span className={`text-xs font-semibold ${Number(afterPct) >= 75 ? 'text-green-600' : 'text-red-600'}`}>{afterPct}%</span></div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${Number(afterPct) >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${afterPct}%` }} /></div>
            </div>
            {attendance && attendance.total_classes > 0 && attendance.percentage < 75 && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-semibold">
                  Current attendance is below 75%. Leave applications are blocked.
                </p>
              </div>
            )}
            {Number(afterPct) < 75 && duration > 0 && <div className="mt-3 flex items-start gap-2 bg-red-50 rounded-lg p-2.5"><AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-red-600">Attendance will drop below 75% threshold</p></div>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Leave Balance</h4>
            {Object.keys(leaveBalance).length === 0 ? (
              <p className="text-sm text-gray-500">Leave balance is not available.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(leaveBalance).map(([type, balance]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${balanceColors[type] || 'bg-indigo-500'}`} /><span className="text-sm text-gray-600">{type}</span></div>
                    <span className="text-sm font-semibold text-gray-800">{balance.total - balance.used} <span className="text-gray-400 font-normal">/ {balance.total}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
