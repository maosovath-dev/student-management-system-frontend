import { ref, computed } from "vue";
import { defineStore } from "pinia";
import subjectApi from "../api/subject";

export const useSubjectStore = defineStore("subject", () => {
  // State
  const subjects = ref([]);
  const subjectItem = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalSubjects = computed(() => subjects.value.length);

  // Actions
  const fetchSubjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await subjectApi.getAll();
      subjects.value = response.data.data || response.data || [];
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to load subjects";
    } finally {
      loading.value = false;
    }
  };

  const fetchSubjectById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await subjectApi.getById(id);
      subjectItem.value = response.data.data || response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to load subject";
    } finally {
      loading.value = false;
    }
  };

  const createSubject = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await subjectApi.create(data);
      await fetchSubjects();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to create subject";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSubject = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await subjectApi.update(id, data);
      await fetchSubjects();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to update subject";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSubject = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await subjectApi.delete(id);
      await fetchSubjects();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to delete subject";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    subjects,
    subjectItem,
    loading,
    error,
    totalSubjects,
    fetchSubjects,
    fetchSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
  };
});