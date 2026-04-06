import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function Signup() {
  const [role, setRole] = useState('student');
  const [year, setYear] = useState('1st');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', department: '', employeeId: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.department) e.department = 'Department is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    alert('Account created! Please login.');
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-5/12 flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10 bg-white"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-10 bg-white"></div>
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-light text-white">Campus<span className="font-bold">Leave</span></h1>
          <p className="text-white/80 mt-3 text-base">Join thousands of students managing leaves smartly</p>
          <div className="mt-10 flex flex-col gap-3 text-left">
            {[
              { icon: '🎓', title: 'Student', desc: 'Apply for leave instantly' },
              { icon: '👩‍🏫', title: 'Advisor', desc: 'Review and approve requests' },
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
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md py-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-2 text-sm">Sign up to get started</p>
            </div>

            {/* Role Toggle */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Register as</p>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {['student', 'advisor', 'hod'].map(r => (
                  <button key={r} onClick={() => setRole(r)} type="button"
                    className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
                    {r === 'hod' ? 'HOD' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@campus.edu"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 8 characters"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <select value={form.department} onChange={set('department')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-white text-gray-700">
                  <option value="">Select department</option>
                  <option>Computer Science</option>
                  <option>Electronics</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                  <option>Information Technology</option>
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              {/* Student: Year */}
              {role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Study</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1st', '2nd', '3rd', '4th'].map(y => (
                      <button key={y} type="button" onClick={() => setYear(y)}
                        className={`py-2.5 text-sm font-medium rounded-xl border transition-all ${year === y ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisor/HOD: Employee ID */}
              {(role === 'advisor' || role === 'hod') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID</label>
                  <input type="text" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP-001"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>
              )}

              <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90 transition-opacity mt-2">
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}