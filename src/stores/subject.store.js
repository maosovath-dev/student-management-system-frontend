import { ref, computed } from "vue";
import { defineStore } from "pinia";
import subjectApi from "../api/subject";
import { useToast } from "@/composables/useToast";

export const useSubjectStore = defineStore("subject", () => {
  const { showToast } = useToast();
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចទាញយកបញ្ជីមុខវិជ្ជាបានទេ។";
      showToast(error.value, "error");
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចទាញយកព័ត៌មានមុខវិជ្ជាបានទេ។";
      showToast(error.value, "error");
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចបង្កើតមុខវិជ្ជាបានទេ។";
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចកែប្រែមុខវិជ្ជាបានទេ។";
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចលុបមុខវិជ្ជាបានទេ។";
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