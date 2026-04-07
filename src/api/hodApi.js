import api from './axios';

export const getAllHODLeaves = () => api.get('/hod/leaves');
export const getPendingHODLeaves = () => api.get('/hod/leaves/pending');
export const approveLeaveHOD = (id, remarks) => api.put(`/hod/leaves/${id}/approve`, { remarks });
export const rejectLeaveHOD = (id, remarks) => api.put(`/hod/leaves/${id}/reject`, { remarks });
export const getAnalytics = () => api.get('/hod/analytics');
