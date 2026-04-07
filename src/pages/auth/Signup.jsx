import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, AlertCircle, Briefcase } from 'lucide-react';

const departments = [
  'Computer Science',
  'Electronics',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
];

const years = ['1st', '2nd', '3rd', '4th'];

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '',
    employeeId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { key: 'student', label: 'Student' },
    { key: 'advisor', label: 'Advisor' },
    { key: 'hod', label: 'HOD' },
  ];

  const dashboardRoutes = {
    student: '/student/dashboard',
    advisor: '/advisor/dashboard',
    hod: '/hod/dashboard',
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.department) newErrors.department = 'Department is required';

    if (selectedRole === 'student' && !formData.year) {
      newErrors.year = 'Year of study is required';
    }
    if ((selectedRole === 'advisor' || selectedRole === 'hod') && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const userData = {
      id: selectedRole === 'student' ? `STU-${Date.now()}` : `FAC-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      ...(selectedRole === 'student' && { year: parseInt(formData.year) }),
      ...(selectedRole !== 'student' && { employeeId: formData.employeeId }),
    };

    login(userData, selectedRole, `mock-token-${selectedRole}-${Date.now()}`);
    navigate(dashboardRoutes[selectedRole]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — Gradient hero
          ═══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white opacity-10 rounded-full" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo Icon */}
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl mb-3">
            <span className="text-white font-light">Campus</span>
            <span className="text-white font-bold">Leave</span>
          </h1>
          <p className="text-white/80 text-sm leading-relaxed mb-10">
            Streamline your leave management process with our unified platform for students, advisors, and HODs.
          </p>

          {/* Feature Cards */}
          <div className="space-y-3">
            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🎓
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Students</p>
                <p className="text-white/70 text-xs">Apply and track leave requests easily</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                👩‍🏫
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Advisors</p>
                <p className="text-white/70 text-xs">Review and manage student requests</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🏛️
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">HOD</p>
                <p className="text-white/70 text-xs">Final approvals and department oversight</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — Signup form
          ═══════════════════════════════════════════════════ */}
      <div className="w-full lg:w-7/12 bg-white flex items-start justify-center overflow-y-auto min-h-screen">
        <div className="w-full max-w-md py-12 px-8">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-8">Join CampusLeave to get started</p>

          {/* Role Selector */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setSelectedRole(r.key);
                  setErrors({});
                }}
                className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${
                  selectedRole === r.key
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className={`w-full border rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full border rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white ${
                  formData.department ? 'text-gray-700' : 'text-gray-300'
                } ${errors.department ? 'border-red-300' : 'border-gray-200'}`}
              >
                <option value="" disabled>Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            {/* Year of Study — Students only */}
            {selectedRole === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Year of Study
                </label>
                <div className="flex gap-3">
                  {years.map((yr, index) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleChange('year', String(index + 1))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.year === String(index + 1)
                          ? 'bg-indigo-600 text-white border border-indigo-600'
                          : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>
            )}

            {/* Employee ID — Advisor / HOD only */}
            {(selectedRole === 'advisor' || selectedRole === 'hod') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employee ID
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    placeholder="Enter your employee ID"
                    className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${
                      errors.employeeId ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
