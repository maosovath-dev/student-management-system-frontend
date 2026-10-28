import { defineStore } from 'pinia';
import { studentApi } from '../api/student';
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStudents(classId = null) {
      this.loading = true;
      this.error = null;
      try {
        const params = classId ? { class_id: classId } : {};
        const response = await studentApi.getAll(params);
        this.students = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        showToast(this.error || "មិនអាចទាញយកបញ្ជីសិស្សបានទេ។", "error");
      } finally {
        this.loading = false;
      }
    },

    async createStudent(studentData) {
      try {
        const response = await studentApi.create(studentData);
        await this.fetchStudents(); // Refresh បញ្ជីសិស្ស
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || err.message;
      }
    },

    async updateStudent(id, studentData) {
      try {
        const response = await studentApi.update(id, studentData);
        await this.fetchStudents();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || err.message;
      }
    },

    async deleteStudent(id) {
      try {
        const response = await studentApi.delete(id);
        await this.fetchStudents();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || err.message;
      }
    },
  },
});