import { ref, computed } from "vue";
import { defineStore } from "pinia";
import attendanceApi from "../api/attendances";

export const useAttendanceStore = defineStore("attendance", () => {
  // State
  const attendances = ref([]);
  const attendanceItem = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalAttendances = computed(() => attendances.value.length);
  const presentCount = computed(() =>
    attendances.value.filter((item) => item.status === "present").length
  );
  const absentCount = computed(() =>
    attendances.value.filter((item) => item.status === "absent").length
  );

  // Actions
  const fetchAttendances = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await attendanceApi.getAll();
      attendances.value = response.data.data || [];
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to load attendance records";
    } finally {
      loading.value = false;
    }
  };

  const fetchAttendanceById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await attendanceApi.getById(id);
      attendanceItem.value = response.data.data || response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message || "Failed to load attendance record";
    } finally {
      loading.value = false;
    }
  };

  const createAttendance = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await attendanceApi.create(data);
      await fetchAttendances();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message || "Failed to record attendance";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAttendance = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await attendanceApi.update(id, data);
      await fetchAttendances();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message || "Failed to update attendance";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteAttendance = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await attendanceApi.delete(id);
      await fetchAttendances();
      return response.data;
    } catch (err) {
      console.error(err);
      error.value =
        err.response?.data?.message || "Failed to delete attendance record";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    attendances,
    attendanceItem,
    loading,
    error,
    totalAttendances,
    presentCount,
    absentCount,
    fetchAttendances,
    fetchAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  };
});