export const mockStudents = [
  { id: 1, name: 'Fazmina Rahman', email: 'fazmina@campus.edu', department: 'Computer Science', year: 2, advisorId: 1 },
  { id: 2, name: 'Arjun Mehta', email: 'arjun@campus.edu', department: 'Computer Science', year: 3, advisorId: 1 },
  { id: 3, name: 'Priya Nair', email: 'priya@campus.edu', department: 'Electronics', year: 1, advisorId: 2 },
  { id: 4, name: 'Rohan Das', email: 'rohan@campus.edu', department: 'Mechanical', year: 4, advisorId: 2 },
  { id: 5, name: 'Sneha Patel', email: 'sneha@campus.edu', department: 'Computer Science', year: 2, advisorId: 1 },
];

export const mockFaculty = [
  { id: 1, name: 'Dr. Kavitha S', email: 'kavitha@campus.edu', role: 'advisor', department: 'Computer Science' },
  { id: 2, name: 'Prof. Ramesh K', email: 'ramesh@campus.edu', role: 'advisor', department: 'Electronics' },
  { id: 3, name: 'Dr. Meenakshi R', email: 'meenakshi@campus.edu', role: 'hod', department: 'Computer Science' },
];

export const mockLeaves = [
  { id: 1, studentId: 1, studentName: 'Fazmina Rahman', type: 'OD', from: '2025-04-07', to: '2025-04-09', days: 3, reason: 'Inter-college symposium participation', advisorStatus: 'pending', hodStatus: 'pending', finalStatus: 'pending', appliedAt: '2025-04-05' },
  { id: 2, studentId: 1, studentName: 'Fazmina Rahman', type: 'Medical', from: '2025-03-20', to: '2025-03-21', days: 2, reason: 'Fever and medical checkup', advisorStatus: 'approved', hodStatus: 'approved', finalStatus: 'approved', appliedAt: '2025-03-18' },
  { id: 3, studentId: 1, studentName: 'Fazmina Rahman', type: 'Personal', from: '2025-03-10', to: '2025-03-12', days: 3, reason: 'Family function', advisorStatus: 'rejected', hodStatus: 'pending', finalStatus: 'rejected', appliedAt: '2025-03-08', remarks: 'Attendance already low' },
  { id: 4, studentId: 1, studentName: 'Fazmina Rahman', type: 'OD', from: '2025-02-14', to: '2025-02-14', days: 1, reason: 'Tech fest coordination', advisorStatus: 'approved', hodStatus: 'approved', finalStatus: 'approved', appliedAt: '2025-02-12' },
  { id: 5, studentId: 2, studentName: 'Arjun Mehta', type: 'Medical', from: '2025-04-01', to: '2025-04-03', days: 3, reason: 'Surgery recovery', advisorStatus: 'approved', hodStatus: 'pending', finalStatus: 'pending', appliedAt: '2025-03-30' },
  { id: 6, studentId: 3, studentName: 'Priya Nair', type: 'OD', from: '2025-04-10', to: '2025-04-11', days: 2, reason: 'Workshop at IIT', advisorStatus: 'pending', hodStatus: 'pending', finalStatus: 'pending', appliedAt: '2025-04-06' },
  { id: 7, studentId: 4, studentName: 'Rohan Das', type: 'Personal', from: '2025-03-25', to: '2025-03-26', days: 2, reason: 'Personal emergency', advisorStatus: 'approved', hodStatus: 'approved', finalStatus: 'approved', appliedAt: '2025-03-23' },
  { id: 8, studentId: 5, studentName: 'Sneha Patel', type: 'Medical', from: '2025-04-05', to: '2025-04-06', days: 2, reason: 'Dental procedure', advisorStatus: 'pending', hodStatus: 'pending', finalStatus: 'pending', appliedAt: '2025-04-04' },
];

export const mockAttendance = {
  overall: 78,
  totalClasses: 120,
  attended: 94,
  subjects: [
    { name: 'Data Structures', total: 40, present: 36, absent: 4 },
    { name: 'Operating Systems', total: 38, present: 28, absent: 10 },
    { name: 'DBMS', total: 42, present: 38, absent: 4 },
    { name: 'Computer Networks', total: 36, present: 30, absent: 6 },
    { name: 'Software Engineering', total: 30, present: 26, absent: 4 },
  ]
};