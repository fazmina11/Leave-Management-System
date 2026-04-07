import api from './axios';

export const getMyStudents = () => api.get('/advisor/students');
export const getPendingLeaves = () => api.get('/advisor/leaves');
export const getAllAdvisorLeaves = () => api.get('/advisor/leaves/all');
export const approveLeaveAdvisor = (id, remarks) => api.put(`/advisor/leaves/${id}/approve`, { remarks });
export const rejectLeaveAdvisor = (id, remarks) => api.put(`/advisor/leaves/${id}/reject`, { remarks });
