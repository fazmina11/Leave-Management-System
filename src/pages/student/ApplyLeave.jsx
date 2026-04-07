<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { attendance } from '../../data/mockData';
import {
  Briefcase,
  Stethoscope,
  User,
  CalendarDays,
  Upload,
  CheckCircle,
  FilePlus,
  AlertCircle,
} from 'lucide-react';

// ── Leave type configs ─────────────────────────────────
const leaveTypes = [
  {
    key: 'OD',
    label: 'On Duty (OD)',
    description: 'Academic events, workshops, hackathons',
    icon: Briefcase,
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    key: 'Medical',
    label: 'Medical Leave',
    description: 'Health-related absences',
    icon: Stethoscope,
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    key: 'Personal',
    label: 'Personal Leave',
    description: 'Family events, personal work',
    icon: User,
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
];

// ── Leave balance mock ─────────────────────────────────
const leaveBalance = {
  OD: { total: 10, used: 3 },
  Medical: { total: 8, used: 2 },
  Personal: { total: 5, used: 1 },
};

const balanceColors = {
  OD: 'bg-blue-500',
  Medical: 'bg-purple-500',
  Personal: 'bg-orange-500',
};

const ApplyLeave = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate duration
  const duration = useMemo(() => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const diff = (new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff) + 1);
  }, [formData.fromDate, formData.toDate]);

  // Attendance impact calculation
  const currentPct = attendance.overallPercentage;
  const afterPct = useMemo(() => {
    if (duration <= 0) return currentPct;
    const missedExtra = duration * (attendance.totalClasses / 120); // ~classes-per-day estimate
    const newTotal = attendance.totalClasses + missedExtra;
    return Math.max(0, ((attendance.attended / newTotal) * 100)).toFixed(1);
  }, [duration, currentPct]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.type) e.type = 'Select a leave type';
    if (!formData.fromDate) e.fromDate = 'Start date is required';
    if (!formData.toDate) e.toDate = 'End date is required';
    if (formData.fromDate && formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      e.toDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) e.reason = 'Reason is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFormData({ type: '', fromDate: '', toDate: '', reason: '' });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <DashboardLayout title="Apply Leave">
      <div className="grid grid-cols-3 gap-6">
        {/* ── Left: Form Card ─────────────────────────── */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {isSuccess ? (
            /* ── Success State ──────────────────────────── */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Leave Request Submitted!</h3>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
                Your {formData.type} leave request for {duration} day{duration !== 1 ? 's' : ''} has been sent to your advisor for review.
              </p>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
              >
                <FilePlus className="w-4 h-4" />
                Apply Another
              </button>
            </div>
          ) : (
            /* ── Form ──────────────────────────────────── */
            <>
              <h3 className="text-base font-semibold text-gray-800 mb-5">New Leave Request</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {leaveTypes.map((lt) => {
                      const selected = formData.type === lt.key;
                      return (
                        <button
                          key={lt.key}
                          type="button"
                          onClick={() => handleChange('type', lt.key)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selected
                              ? `${lt.borderColor} ${lt.bgColor}`
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <lt.icon className={`w-5 h-5 mb-2 ${selected ? lt.textColor : 'text-gray-400'}`} />
                          <p className={`text-sm font-semibold ${selected ? lt.textColor : 'text-gray-700'}`}>
                            {lt.label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{lt.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.fromDate}
                        onChange={(e) => handleChange('fromDate', e.target.value)}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${
                          errors.fromDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.toDate}
                        onChange={(e) => handleChange('toDate', e.target.value)}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${
                          errors.toDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>}
                  </div>
                </div>

                {/* Duration pill */}
                {duration > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                      {duration} day{duration !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-400">leave duration</span>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    placeholder="Describe your reason for leave..."
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 resize-none ${
                      errors.reason ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                </div>

                {/* Upload Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Attachment (optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Leave Request'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── Right: Info Cards ────────────────────────── */}
        <div className="col-span-1 space-y-4">
          {/* Attendance Impact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Attendance Impact</h4>

            {/* Current */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Current</span>
                <span className="text-xs font-semibold text-gray-700">{currentPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${currentPct}%` }}
                />
              </div>
            </div>

            {/* After */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">After Leave</span>
                <span className={`text-xs font-semibold ${Number(afterPct) >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {afterPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${Number(afterPct) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${afterPct}%` }}
                />
              </div>
            </div>

            {Number(afterPct) < 75 && duration > 0 && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">Attendance will drop below 75% threshold</p>
              </div>
            )}
          </div>

          {/* Leave Balance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Leave Balance</h4>
            <div className="space-y-3">
              {Object.entries(leaveBalance).map(([type, bal]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${balanceColors[type]}`} />
                    <span className="text-sm text-gray-600">{type}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {bal.total - bal.used} <span className="text-gray-400 font-normal">/ {bal.total}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Important Notes</h4>
            <ul className="space-y-1.5 text-xs text-yellow-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Leave requests require advisor and HOD approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Medical leave requires supporting documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Attendance below 75% may result in leave denial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Apply at least 2 days in advance for planned leave</span>
              </li>
            </ul>
          </div>
=======
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
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
        </div>
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
};

export default ApplyLeave;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
