import { ref, computed } from "vue";
import { defineStore } from "pinia";
import classApi from "../api/classes";

export const useClassStore = defineStore("class", () => {
  // 1. State (ប្រើ ref)
  const classes = ref([]);
  const classItem = ref(null); // ប្តូរឈ្មោះពី class ដើម្បីកុំឱ្យជាន់ពាក្យគន្លឹះ JavaScript
  const loading = ref(false);
  const error = ref(null);

  // 2. Getters (ប្រើ computed)
  const totalClasses = computed(() => classes.value.length);

  // 3. Actions (ប្រើ Function ធម្មតា)

  // GET ALL
  const fetchClasses = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await classApi.getAll();
      classes.value = (response.data.data || []).map((item) => ({
        ...item,
        student_count: Number(item.student_count || 0),
      }));
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to load classes";
    } finally {
      loading.value = false;
    }
  };

  // GET BY ID
  const fetchClassById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await classApi.getById(id);
      classItem.value = response.data.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to load class";
    } finally {
      loading.value = false;
    }
  };

  // CREATE
  const createClass = async (data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await classApi.create(data);
      await fetchClasses();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to create class";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // UPDATE
  const updateClass = async (id, data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await classApi.update(id, data);
      await fetchClasses();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to update class";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // DELETE
  const deleteClass = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await classApi.delete(id);
      await fetchClasses();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to delete class";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Return រាល់ State, Getter, និង Function ទាំងអស់ដើម្បីយកទៅប្រើប្រាស់ក្នុង Component
  return {
    classes,
    classItem,
    loading,
    error,
    totalClasses,
    fetchClasses,
    fetchClassById,
    createClass,
    updateClass,
    deleteClass,
  };
});