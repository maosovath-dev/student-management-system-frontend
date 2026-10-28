import { ref, computed } from "vue";
import { defineStore } from "pinia";
import attendanceApi from "../api/attendances";
import { useToast } from "@/composables/useToast";

export const useAttendanceStore = defineStore("attendance", () => {
  const { showToast } = useToast();
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
      error.value =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "មិនអាចទាញយកបញ្ជីវត្តមានបានទេ។";
      showToast(error.value, "error");
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
      error.value =
        err.response?.data?.message || "មិនអាចទាញយកព័ត៌មានវត្តមានបានទេ។";
      showToast(error.value, "error");
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
      error.value =
        err.response?.data?.message || "មិនអាចកត់ត្រាវត្តមានបានទេ។";
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
      error.value =
        err.response?.data?.message || "មិនអាចកែប្រែវត្តមានបានទេ។";
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
      error.value =
        err.response?.data?.message || "មិនអាចលុបកំណត់ត្រាវត្តមានបានទេ។";
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