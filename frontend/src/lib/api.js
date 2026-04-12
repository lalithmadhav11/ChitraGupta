import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true  // sends httpOnly cookie automatically
});

// Auth
export const getMe = () => api.get('/api/auth/me').then(r => r.data);
export const logout = () => api.post('/api/auth/logout').then(r => r.data);

// Emails
export const getEmails = () => api.get('/api/emails').then(r => r.data);
export const syncEmails = () => api.post('/api/emails/sync').then(r => r.data);
export const markEmailRead = (id) => api.patch(`/api/emails/${id}/read`).then(r => r.data);

// Assignments
export const getAssignments = () => api.get('/api/assignments').then(r => r.data);
export const syncAssignments = () => api.post('/api/assignments/sync').then(r => r.data);

// Attendance
export const logAttendance = (data) => api.post('/api/attendance/log', data).then(r => r.data);
export const getAttendance = () => api.get('/api/attendance/summary').then(r => r.data);

// Study Plan
export const generateStudyPlan = () => api.post('/api/study-plan/generate').then(r => r.data);
export const getStudyPlan = () => api.get('/api/study-plan').then(r => r.data);

// Dashboard
export const getDashboard = () => api.get('/api/dashboard').then(r => r.data);
