import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStudents, mockFaculty } from '../../data/mockData';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    if (selectedRole === 'student') {
      const found = mockStudents.find(s => s.email === email);
      if (found && password === 'password123') {
        login(found, 'student', 'mock-token-student');
        navigate('/student/dashboard');
      } else { setError('Invalid credentials. Try fazmina@campus.edu / password123'); }
    } else if (selectedRole === 'advisor') {
      const found = mockFaculty.find(f => f.email === email && f.role === 'advisor');
      if (found && password === 'password123') {
        login(found, 'advisor', 'mock-token-advisor');
        navigate('/advisor/dashboard');
      } else { setError('Invalid credentials. Try kavitha@campus.edu / password123'); }
    } else {
      const found = mockFaculty.find(f => f.email === email && f.role === 'hod');
      if (found && password === 'password123') {
        login(found, 'hod', 'mock-token-hod');
        navigate('/hod/dashboard');
      } else { setError('Invalid credentials. Try meenakshi@campus.edu / password123'); }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-5/12 flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#fff' }}></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }}></div>
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-light text-white">Campus<span className="font-bold">Leave</span></h1>
          <p className="text-white/80 mt-3 text-base leading-relaxed">Smart leave management for modern colleges</p>
          <div className="mt-10 flex flex-col gap-3 text-left">
            {[
              { icon: '🎓', title: 'Students', desc: 'Apply for leave instantly' },
              { icon: '👩‍🏫', title: 'Advisors', desc: 'Review and approve requests' },
              { icon: '🏛️', title: 'HOD', desc: 'Full departmental control' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {['student', 'advisor', 'hod'].map(r => (
              <button key={r} onClick={() => setSelectedRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-150 ${selectedRole === r ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
                {r === 'hod' ? 'HOD' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-right -mt-1">
              <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90 transition-opacity mt-1">
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2">Demo credentials:</p>
            <p className="text-xs text-indigo-600">Student: fazmina@campus.edu</p>
            <p className="text-xs text-indigo-600">Advisor: kavitha@campus.edu</p>
            <p className="text-xs text-indigo-600">HOD: meenakshi@campus.edu</p>
            <p className="text-xs text-indigo-600 mt-1 font-medium">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}