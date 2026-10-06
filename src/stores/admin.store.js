import { defineStore } from 'pinia';
import { adminApi } from '../api/admin.api';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    teachers: [],
    loading: false,
    error: null,
    successMessage: '',
  }),

  actions: {
    async fetchTeachers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await adminApi.getTeachers();
        this.teachers = response.data.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || 'មិនអាចទាញយកបញ្ជីគ្រូបានទេ!';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async createTeacher(payload) {
      this.loading = true;
      this.error = null;
      this.successMessage = '';

      try {
        const response = await adminApi.createUser(payload);
        this.successMessage = response.data.message || 'បានបង្កើតគណនីគ្រូជោគជ័យ!';
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'មានបញ្ហាក្នុងការបង្កើតគណនីគ្រូ!';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getTeacher(id) {
      try {
        const response = await adminApi.getTeacher(id);
        return response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'មិនអាចទាញយកព័ត៌មានគ្រូបានទេ!';
        throw this.error;
      }
    },

    async updateTeacher(id, payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await adminApi.updateTeacher(id, payload);
        const teacher = response.data.data;
        const index = this.teachers.findIndex((item) => Number(item.id) === Number(id));
        if (index !== -1) this.teachers[index] = teacher;
        return teacher;
      } catch (err) {
        this.error = err.response?.data?.message || 'មិនអាចកែប្រែព័ត៌មានគ្រូបានទេ!';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTeacher(id) {
      this.loading = true;
      this.error = null;

      try {
        await adminApi.deleteTeacher(id);
        this.teachers = this.teachers.filter((item) => Number(item.id) !== Number(id));
      } catch (err) {
        this.error = err.response?.data?.message || 'មិនអាចលុបគណនីគ្រូបានទេ!';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
  },
});