import { api as apiClient } from './api';

export const adminApi = {
  // GET: /api/auth/admin/teachers
  getTeachers() {
    return apiClient.get('/auth/admin/teachers');
  },

  getTeacher(id) {
    return apiClient.get(`/auth/admin/teachers/${id}`);
  },

  updateTeacher(id, teacherData) {
    return apiClient.put(`/auth/admin/teachers/${id}`, teacherData);
  },

  deleteTeacher(id) {
    return apiClient.delete(`/auth/admin/teachers/${id}`);
  },

  // POST: /api/auth/admin/create-user
  createUser(userData) {
    return apiClient.post('/auth/admin/create-user', userData);
  },
};