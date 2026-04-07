import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser, getAdvisors } from '../../api/authApi';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';

const departments = [
  'Computer Science',
  'Electronics',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
];

const years = ['1st', '2nd', '3rd', '4th'];

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

export default function Signup() {
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
    advisorId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [advisors, setAdvisors] = useState([]);
  const [advisorsLoading, setAdvisorsLoading] = useState(false);

  useEffect(() => {
    if (selectedRole === 'student') {
      setAdvisorsLoading(true);
      getAdvisors()
        .then((res) => setAdvisors(res.data.advisors))
        .catch(() => setAdvisors([]))
        .finally(() => setAdvisorsLoading(false));
    }
  }, [selectedRole]);

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
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (selectedRole === 'student' && !formData.year) newErrors.year = 'Year of study is required';
    if (selectedRole === 'student' && !formData.advisorId) {
      newErrors.advisorId = 'Please select your advisor';
    }
    if ((selectedRole === 'advisor' || selectedRole === 'hod') && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: selectedRole,
        department: formData.department,
        ...(selectedRole === 'student' && { year: Number(formData.year), advisorId: Number(formData.advisorId) }),
        ...(selectedRole !== 'student' && { employeeId: formData.employeeId.trim() }),
      };

      const res = await registerUser(payload);
      login(res.data.user, res.data.user.role, res.data.token);
      navigate(dashboardRoutes[selectedRole]);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white opacity-10 rounded-full" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-3"><span className="text-white font-light">Campus</span><span className="text-white font-bold">Leave</span></h1>
          <p className="text-white/80 text-sm leading-relaxed mb-10">Streamline your leave management process with our unified platform for students, advisors, and HODs.</p>
        </div>
      </div>

      <div className="w-full lg:w-7/12 bg-white flex items-start justify-center overflow-y-auto min-h-screen">
        <div className="w-full max-w-md py-12 px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-8">Join CampusLeave to get started</p>

          <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
            {roles.map((role) => (
              <button key={role.key} type="button" onClick={() => { setSelectedRole(role.key); setErrors({}); setSubmitError(''); }} className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${selectedRole === role.key ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
                {role.label}
              </button>
            ))}
          </div>

          {submitError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">{submitError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={formData.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Enter your full name" className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${errors.name ? 'border-red-300' : 'border-gray-200'}`} /></div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" value={formData.email} onChange={(event) => handleChange('email', event.target.value)} placeholder="Enter your email" className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${errors.email ? 'border-red-300' : 'border-gray-200'}`} /></div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(event) => handleChange('password', event.target.value)} placeholder="Create a password" className={`w-full border rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${errors.password ? 'border-red-300' : 'border-gray-200'}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(event) => handleChange('confirmPassword', event.target.value)} placeholder="Confirm your password" className={`w-full border rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <select value={formData.department} onChange={(event) => handleChange('department', event.target.value)} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white ${formData.department ? 'text-gray-700' : 'text-gray-300'} ${errors.department ? 'border-red-300' : 'border-gray-200'}`}>
                <option value="" disabled>Select your department</option>
                {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            {selectedRole === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Study</label>
                <div className="flex gap-3">
                  {years.map((year, index) => (
                    <button key={year} type="button" onClick={() => handleChange('year', String(index + 1))} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${formData.year === String(index + 1) ? 'bg-indigo-600 text-white border border-indigo-600' : 'border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {year}
                    </button>
                  ))}
                </div>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>
            )}

            {selectedRole === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Advisor</label>
                {advisorsLoading ? (
                  <p className="text-sm text-gray-400">Loading advisors...</p>
                ) : (
                  <select
                    value={formData.advisorId}
                    onChange={(e) => handleChange('advisorId', e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white ${formData.advisorId ? 'text-gray-700' : 'text-gray-300'} ${errors.advisorId ? 'border-red-300' : 'border-gray-200'}`}
                  >
                    <option value="" disabled>Select your advisor</option>
                    {advisors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.department}
                      </option>
                    ))}
                  </select>
                )}
                {errors.advisorId && <p className="text-red-500 text-xs mt-1">{errors.advisorId}</p>}
              </div>
            )}

            {(selectedRole === 'advisor' || selectedRole === 'hod') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID</label>
                <div className="relative"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={formData.employeeId} onChange={(event) => handleChange('employeeId', event.target.value)} placeholder="Enter your employee ID" className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300 ${errors.employeeId ? 'border-red-300' : 'border-gray-200'}`} /></div>
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {isLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
