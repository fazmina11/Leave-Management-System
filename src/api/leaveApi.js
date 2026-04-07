import api from './axios';

export const applyLeave = (data) => api.post('/leaves/apply', data);
export const getMyLeaves = () => api.get('/leaves/my');
export const deleteLeave = (id) => api.delete(`/leaves/${id}`);
export const getMyAttendance = () => api.get('/attendance');
