// ═══════════════════════════════════════════════════════
//  CampusLeave — Mock Data
// ═══════════════════════════════════════════════════════

// ── Students ───────────────────────────────────────────
export const students = [
  {
    id: 'STU001',
    name: 'Arun Kumar',
    email: 'arun.kumar@campus.edu',
    department: 'Computer Science',
    year: 3,
    advisorId: 'FAC001',
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    department: 'Computer Science',
    year: 2,
    advisorId: 'FAC001',
  },
  {
    id: 'STU003',
    name: 'Rahul Menon',
    email: 'rahul.menon@campus.edu',
    department: 'Electronics',
    year: 4,
    advisorId: 'FAC002',
  },
  {
    id: 'STU004',
    name: 'Divya Nair',
    email: 'divya.nair@campus.edu',
    department: 'Electronics',
    year: 3,
    advisorId: 'FAC002',
  },
  {
    id: 'STU005',
    name: 'Karthik Raj',
    email: 'karthik.raj@campus.edu',
    department: 'Computer Science',
    year: 2,
    advisorId: 'FAC001',
  },
];

// ── Faculty (2 Advisors + 1 HOD) ──────────────────────
export const faculty = [
  {
    id: 'FAC001',
    name: 'Dr. Meena Iyer',
    email: 'meena.iyer@campus.edu',
    department: 'Computer Science',
    role: 'advisor',
  },
  {
    id: 'FAC002',
    name: 'Dr. Rajesh Pillai',
    email: 'rajesh.pillai@campus.edu',
    department: 'Electronics',
    role: 'advisor',
  },
  {
    id: 'FAC003',
    name: 'Dr. Sunitha Rajan',
    email: 'sunitha.rajan@campus.edu',
    department: 'Computer Science',
    role: 'hod',
  },
];

// ── Leave Requests ─────────────────────────────────────
export const leaveRequests = [
  {
    id: 'LR001',
    studentId: 'STU001',
    studentName: 'Arun Kumar',
    department: 'Computer Science',
    type: 'OD',
    reason: 'Attending inter-college hackathon at IIT Madras',
    fromDate: '2026-04-10',
    toDate: '2026-04-12',
    appliedDate: '2026-04-05',
    advisorStatus: 'approved',
    hodStatus: 'approved',
    finalStatus: 'approved',
    advisorRemarks: 'Good opportunity. Approved.',
    hodRemarks: 'Approved for academic event.',
  },
  {
    id: 'LR002',
    studentId: 'STU001',
    studentName: 'Arun Kumar',
    department: 'Computer Science',
    type: 'Medical',
    reason: 'Fever and cold, doctor advised rest for 2 days',
    fromDate: '2026-03-20',
    toDate: '2026-03-21',
    appliedDate: '2026-03-19',
    advisorStatus: 'approved',
    hodStatus: 'approved',
    finalStatus: 'approved',
    advisorRemarks: 'Get well soon.',
    hodRemarks: 'Approved.',
  },
  {
    id: 'LR003',
    studentId: 'STU002',
    studentName: 'Priya Sharma',
    department: 'Computer Science',
    type: 'Personal',
    reason: 'Family function — sister\'s wedding',
    fromDate: '2026-04-15',
    toDate: '2026-04-17',
    appliedDate: '2026-04-07',
    advisorStatus: 'approved',
    hodStatus: 'pending',
    finalStatus: 'pending',
    advisorRemarks: 'Approved. Attend classes after.',
    hodRemarks: '',
  },
  {
    id: 'LR004',
    studentId: 'STU003',
    studentName: 'Rahul Menon',
    department: 'Electronics',
    type: 'OD',
    reason: 'IEEE workshop on Embedded Systems',
    fromDate: '2026-04-08',
    toDate: '2026-04-09',
    appliedDate: '2026-04-03',
    advisorStatus: 'approved',
    hodStatus: 'rejected',
    finalStatus: 'rejected',
    advisorRemarks: 'Relevant to course. Approved.',
    hodRemarks: 'Attendance below threshold. Rejected.',
  },
  {
    id: 'LR005',
    studentId: 'STU004',
    studentName: 'Divya Nair',
    department: 'Electronics',
    type: 'Medical',
    reason: 'Dental surgery — wisdom tooth extraction',
    fromDate: '2026-04-14',
    toDate: '2026-04-16',
    appliedDate: '2026-04-10',
    advisorStatus: 'pending',
    hodStatus: 'pending',
    finalStatus: 'pending',
    advisorRemarks: '',
    hodRemarks: '',
  },
  {
    id: 'LR006',
    studentId: 'STU005',
    studentName: 'Karthik Raj',
    department: 'Computer Science',
    type: 'Personal',
    reason: 'Passport renewal appointment at Regional Passport Office',
    fromDate: '2026-04-11',
    toDate: '2026-04-11',
    appliedDate: '2026-04-06',
    advisorStatus: 'rejected',
    hodStatus: 'pending',
    finalStatus: 'rejected',
    advisorRemarks: 'Can be rescheduled to a weekend. Rejected.',
    hodRemarks: '',
  },
  {
    id: 'LR007',
    studentId: 'STU002',
    studentName: 'Priya Sharma',
    department: 'Computer Science',
    type: 'OD',
    reason: 'National level paper presentation at Anna University',
    fromDate: '2026-03-25',
    toDate: '2026-03-26',
    appliedDate: '2026-03-20',
    advisorStatus: 'approved',
    hodStatus: 'approved',
    finalStatus: 'approved',
    advisorRemarks: 'Academic event. Approved.',
    hodRemarks: 'Good initiative. Approved.',
  },
  {
    id: 'LR008',
    studentId: 'STU003',
    studentName: 'Rahul Menon',
    department: 'Electronics',
    type: 'Medical',
    reason: 'Sprained ankle during sports day, doctor prescribed rest',
    fromDate: '2026-04-01',
    toDate: '2026-04-03',
    appliedDate: '2026-03-31',
    advisorStatus: 'approved',
    hodStatus: 'approved',
    finalStatus: 'approved',
    advisorRemarks: 'Take care. Approved.',
    hodRemarks: 'Approved with medical certificate.',
  },
];

// ── Attendance ─────────────────────────────────────────
export const attendance = {
  overallPercentage: 87.5,
  totalClasses: 240,
  attended: 210,
  subjects: [
    {
      name: 'Data Structures & Algorithms',
      total: 50,
      present: 46,
      absent: 4,
    },
    {
      name: 'Database Management Systems',
      total: 48,
      present: 42,
      absent: 6,
    },
    {
      name: 'Operating Systems',
      total: 50,
      present: 45,
      absent: 5,
    },
    {
      name: 'Computer Networks',
      total: 46,
      present: 40,
      absent: 6,
    },
    {
      name: 'Software Engineering',
      total: 46,
      present: 37,
      absent: 9,
    },
  ],
};

// ── Helper: get user credentials for mock login ────────
export const mockUsers = [
  { email: 'arun.kumar@campus.edu', password: 'password', role: 'student', userId: 'STU001' },
  { email: 'priya.sharma@campus.edu', password: 'password', role: 'student', userId: 'STU002' },
  { email: 'meena.iyer@campus.edu', password: 'password', role: 'advisor', userId: 'FAC001' },
  { email: 'rajesh.pillai@campus.edu', password: 'password', role: 'advisor', userId: 'FAC002' },
  { email: 'sunitha.rajan@campus.edu', password: 'password', role: 'hod', userId: 'FAC003' },
];

// ── Helper: look up full user object ───────────────────
export const getUserById = (id) => {
  return (
    students.find((s) => s.id === id) ||
    faculty.find((f) => f.id === id) ||
    null
  );
};

// ── Helper: get leave requests for a student ───────────
export const getLeavesByStudent = (studentId) => {
  return leaveRequests.filter((lr) => lr.studentId === studentId);
};

// ── Helper: get leave requests for an advisor ──────────
export const getLeavesByAdvisor = (advisorId) => {
  const advisorStudentIds = students
    .filter((s) => s.advisorId === advisorId)
    .map((s) => s.id);
  return leaveRequests.filter((lr) => advisorStudentIds.includes(lr.studentId));
};
