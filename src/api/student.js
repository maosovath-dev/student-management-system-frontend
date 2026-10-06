import { api as apiClient } from "./api";

export const studentApi = {
  // ទាញយកបញ្ជីសិស្សទាំងអស់ (អាច Filter តាម class_id)
  getAll(params = {}) {
    return apiClient.get('/students', { params });
  },

  // ទាញយកព័ត៌មានសិស្សម្នាក់
  getById(id) {
    return apiClient.get(`/students/${id}`);
  },

  // បង្កើតសិស្សថ្មី
  create(data) {
    return apiClient.post('/students', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // កែប្រែព័ត៌មានសិស្ស
  update(id, data) {
    return apiClient.put(`/students/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // លុបសិស្ស
  delete(id) {
    return apiClient.delete(`/students/${id}`);
  },
};