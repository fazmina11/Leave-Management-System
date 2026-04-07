import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Shield, BookOpen, Users } from 'lucide-react';

// ── Mock credentials ───────────────────────────────────
const mockCredentials = {
  student: { email: 'fazmina@campus.edu', password: 'password123', name: 'Fazmina Nazeer', department: 'Computer Science', year: 3, id: 'STU001' },
  advisor: { email: 'kavitha@campus.edu', password: 'password123', name: 'Dr. Kavitha Iyer', department: 'Computer Science', id: 'FAC001' },
  hod:     { email: 'meenakshi@campus.edu', password: 'password123', name: 'Dr. Meenakshi Rajan', department: 'Computer Science', id: 'FAC003' },
};

// ── Role dashboard routes ──────────────────────────────
const dashboardRoutes = {
  student: '/student/dashboard',
  advisor: '/advisor/dashboard',
  hod: '/hod/dashboard',
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { key: 'student', label: 'Student' },
    { key: 'advisor', label: 'Advisor' },
    { key: 'hod', label: 'HOD' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulated delay for realism
    await new Promise((r) => setTimeout(r, 600));

    const cred = mockCredentials[selectedRole];

    if (email.trim().toLowerCase() === cred.email && password === cred.password) {
      const userData = {
        id: cred.id,
        name: cred.name,
        email: cred.email,
        department: cred.department,
        ...(selectedRole === 'student' && { year: cred.year }),
      };
      login(userData, selectedRole, `mock-token-${selectedRole}-${Date.now()}`);
      navigate(dashboardRoutes[selectedRole]);
    } else {
      setError('Invalid email or password. Check the demo credentials below.');
    }

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
          RIGHT PANEL — Login form
          ═══════════════════════════════════════════════════ */}
      <div className="w-full lg:w-7/12 bg-white flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md py-12 px-8">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account</p>

          {/* Role Selector */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => { setSelectedRole(r.key); setError(''); }}
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

          {/* Error Box */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-center gap-2 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300"
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button type="button" className="text-indigo-600 text-xs hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Demo Credentials
            </p>
            <div className="space-y-1.5 text-xs text-indigo-600">
              <div className="flex items-center gap-2">
                <span className="font-medium w-14">Student:</span>
                <span className="text-indigo-500">fazmina@campus.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-14">Advisor:</span>
                <span className="text-indigo-500">kavitha@campus.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-14">HOD:</span>
                <span className="text-indigo-500">meenakshi@campus.edu</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-indigo-100 mt-1">
                <span className="font-medium w-14">Password:</span>
                <span className="font-mono text-indigo-500">password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
