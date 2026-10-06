<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { api } from "@/api/api";
import { useRoute, useRouter } from "vue-router";
import BaseModal from "@/components/ui/BaseModal.vue";

// -------------------------------------------------------------
// 1. STATES
// -------------------------------------------------------------
const selectedClass = ref(null); // NULL = Class Cards View, NOT NULL = Student Table View
const classList = ref([]);
const subjectList = ref([]);
const allSubjectList = ref([]);
const studentList = ref([]);
const loading = ref(false);
const classesLoading = ref(false);
const historyLoading = ref(false);
const savingAttendance = ref(false);
const attendanceSaveProgress = ref("");
const deletingAttendance = ref(false);
const loadedAttendanceScope = ref(null);
const pageError = ref("");
const attendanceNotice = ref("");
const historyError = ref("");
const historyActionError = ref("");
const attendanceHistory = ref([]);
const selectedHistoryRecord = ref(null);
const isHistoryDetailsOpen = ref(false);
const isHistoryEditOpen = ref(false);
const isHistoryDeleteOpen = ref(false);
const savingHistoryEdit = ref(false);
const historyDeleteError = ref("");
const historyEditForm = ref({
  date: "",
  subject_id: "",
  status: "",
});
const historyClassId = ref("");
const historySubjectId = ref("");
const historySearch = ref("");
const historyDate = ref("");

const selectedSubjectId = ref(""); // ID មុខវិជ្ជាដែលបានជ្រើសរើស
const localDate = new Date();
const filterDate = ref(
  `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`
); // YYYY-MM-DD
const searchQuery = ref("");
const route = useRoute();
const router = useRouter();
const isHistoryView = computed(() => route.query.view === "history");
const isAdmin = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").role === "admin";
  } catch {
    return false;
  }
});

const getList = (response) => {
  const result = response.data?.data ?? response.data;
  if (!Array.isArray(result)) {
    throw new Error("ទិន្នន័យដែលទទួលបានពី server មិនត្រឹមត្រូវទេ។");
  }
  return result;
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.msg ||
  error.message ||
  "មានបញ្ហាមិនស្គាល់មូលហេតុ។";

// -------------------------------------------------------------
// 2. HELPER FUNCTIONS FOR STUDENT DATA
// -------------------------------------------------------------
const getStudentName = (item) => {
  if (!item) return "N/A";
  const student = item.student || item;

  if (student.first_name || student.last_name) {
    return `${student.first_name || ""} ${student.last_name || ""}`.trim();
  }

  return (
    student.name ||
    student.name_kh ||
    student.khmer_name ||
    student.full_name ||
    student.student_name ||
    student.user?.name ||
    student.user?.full_name ||
    "N/A"
  );
};

const getStudentCode = (item) => {
  if (!item) return "N/A";
  const student = item.student || item;

  return (
    student.code ||
    student.student_code ||
    item.student_code ||
    `STD-${item.student_id || student.id || "000"}`
  );
};

const getStudentAvatar = (item) => {
  if (!item) return null;
  const student = item.student || item;

  return (
    student.avatar_url ||
    student.avatar ||
    student.user?.avatar_url ||
    student.user?.avatar ||
    item.avatar_url ||
    item.avatar ||
    null
  );
};

// -------------------------------------------------------------
// 3. FETCH DATA FROM BACKEND API
// -------------------------------------------------------------
// ទាញយកបញ្ជីថ្នាក់រៀន
const fetchClasses = async () => {
  classesLoading.value = true;
  pageError.value = "";
  try {
    const res = await api.get("/classes");
    classList.value = getList(res);
  } catch (error) {
    pageError.value = `មិនអាចទាញយកបញ្ជីថ្នាក់បានទេ៖ ${getErrorMessage(error)}`;
  } finally {
    classesLoading.value = false;
  }
};

const retryLoadClasses = async () => {
  pageError.value = "";
  await Promise.all([
    fetchClasses(),
    fetchSubjects().catch((error) => {
      pageError.value = `មិនអាចទាញយកបញ្ជីមុខវិជ្ជាបានទេ៖ ${getErrorMessage(error)}`;
    }),
  ]);
};

// ទាញយកបញ្ជីមុខវិជ្ជា
const fetchSubjects = async (classId = null) => {
  try {
    if (classId) {
      const classSubjectsResponse = await api.get(`/classes/${classId}/subjects`);
      subjectList.value = getList(classSubjectsResponse);
      if (subjectList.value.length > 0) {
        selectAvailableSubject();
        return;
      }
    }

    const allSubjectsResponse = await api.get("/subjects");
    allSubjectList.value = getList(allSubjectsResponse);
    subjectList.value = allSubjectList.value;
    selectAvailableSubject();
  } catch (error) {
    subjectList.value = [];
    selectedSubjectId.value = "";
    throw error;
  }
};

const selectAvailableSubject = () => {
  const selectedSubjectExists = subjectList.value.some(
    (subject) => Number(subject.id) === Number(selectedSubjectId.value)
  );
  if (!selectedSubjectExists) {
    selectedSubjectId.value = subjectList.value.length
      ? String(subjectList.value[0].id)
      : "";
  } else if (selectedSubjectId.value) {
    selectedSubjectId.value = String(selectedSubjectId.value);
  }
};

// ទាញយកបញ្ជីសិស្ស និងវត្តមានក្នុងថ្នាក់
const fetchClassAttendance = async (cls) => {
  selectedClass.value = cls;
  loading.value = true;
  pageError.value = "";
  try {
    await fetchSubjects(cls.id);
    const [studentsResponse, attendanceResponse] = await Promise.all([
      api.get("/students", { params: { class_id: cls.id } }),
      api.get("/attendance", {
        params: {
          class_id: cls.id,
          date: filterDate.value,
          subject_id: selectedSubjectId.value || undefined,
        },
      }),
    ]);
    const students = getList(studentsResponse);
    const attendanceRecords = getList(attendanceResponse);

    studentList.value = students.map((student) => {
      const record = attendanceRecords.find(
        (attendance) =>
          Number(attendance.student_id) === Number(student.id) &&
          Number(attendance.subject_id) === Number(selectedSubjectId.value)
      );
      return {
        id: record?.id || null,
        student_id: student.id,
        student,
        status: record?.status || "",
        savedStatus: record?.status || "",
      };
    });
    loadedAttendanceScope.value = {
      date: filterDate.value,
      subjectId: selectedSubjectId.value,
    };
  } catch (error) {
    studentList.value = [];
    pageError.value = `មិនអាចទាញយកបញ្ជីវត្តមានបានទេ៖ ${getErrorMessage(error)}`;
  } finally {
    loading.value = false;
  }
};

// ពេលដូរ កាលបរិច្ឆេទ ឬ មុខវិជ្ជា ត្រូវទាញយកវត្តមានឡើងវិញ
const onFilterChange = () => {
  if (selectedClass.value) {
    if (
      pendingAttendance.value.length > 0 &&
      !window.confirm("មានវត្តមានមិនទាន់ដាក់ស្នើ។ តើអ្នកចង់បោះបង់ការកែប្រែទាំងនេះហើយប្ដូរតម្រងមែនទេ?")
    ) {
      if (loadedAttendanceScope.value) {
        filterDate.value = loadedAttendanceScope.value.date;
        selectedSubjectId.value = loadedAttendanceScope.value.subjectId;
      }
      return;
    }
    fetchClassAttendance(selectedClass.value);
  } else if (isHistoryView.value) {
    fetchAttendanceHistory();
  }
};

const fetchAttendanceHistory = async () => {
  historyLoading.value = true;
  historyError.value = "";
  try {
    const response = await api.get("/attendance", {
      params: {
        date: historyDate.value || undefined,
        class_id: historyClassId.value || undefined,
        subject_id: historySubjectId.value || undefined,
      },
    });
    attendanceHistory.value = getList(response);
  } catch (error) {
    attendanceHistory.value = [];
    historyError.value = `មិនអាចទាញយកប្រវត្តិវត្តមានបានទេ៖ ${getErrorMessage(error)}`;
  } finally {
    historyLoading.value = false;
  }
};

const openHistoryDetails = (record) => {
  selectedHistoryRecord.value = record;
  isHistoryDetailsOpen.value = true;
};

const openHistoryEdit = async (record) => {
  selectedHistoryRecord.value = record;
  historyActionError.value = "";

  try {
    if (record.class_id) {
      const response = await api.get(`/classes/${record.class_id}/subjects`);
      subjectList.value = getList(response);
    } else {
      subjectList.value = [];
    }

    if (subjectList.value.length === 0) {
      subjectList.value = allSubjectList.value;
    }
    if (subjectList.value.length === 0) {
      const allSubjectsResponse = await api.get("/subjects");
      allSubjectList.value = getList(allSubjectsResponse);
      subjectList.value = allSubjectList.value;
    }
    if (subjectList.value.length === 0) {
      throw new Error("មិនមានមុខវិជ្ជាដែលអាចជ្រើសរើសបានទេ។");
    }
  } catch (error) {
    historyActionError.value =
      `មិនអាចទាញយកមុខវិជ្ជាតាមថ្នាក់បានទេ៖ ${getErrorMessage(error)}`;
    return;
  }

  historyEditForm.value = {
    date: String(record.date).slice(0, 10),
    subject_id: record.subject_id
      ? String(record.subject_id)
      : String(subjectList.value[0].id),
    status: record.status,
  };
  isHistoryEditOpen.value = true;
};

const editHistoryRecordFromDetails = async () => {
  if (!selectedHistoryRecord.value) return;
  await openHistoryEdit(selectedHistoryRecord.value);
  if (isHistoryEditOpen.value) {
    isHistoryDetailsOpen.value = false;
  }
};

const openHistoryDelete = (record) => {
  selectedHistoryRecord.value = record;
  historyDeleteError.value = "";
  isHistoryDeleteOpen.value = true;
};

const deleteHistoryRecord = async () => {
  if (!isAdmin.value || !selectedHistoryRecord.value || deletingAttendance.value) return;

  deletingAttendance.value = true;
  historyDeleteError.value = "";
  try {
    await api.delete(`/attendance/${selectedHistoryRecord.value.id}`);
    attendanceHistory.value = attendanceHistory.value.filter(
      (record) => Number(record.id) !== Number(selectedHistoryRecord.value.id)
    );
    isHistoryDeleteOpen.value = false;
    selectedHistoryRecord.value = null;
  } catch (error) {
    historyDeleteError.value = `មិនអាចលុបកំណត់ត្រាវត្តមានបានទេ៖ ${getErrorMessage(error)}`;
  } finally {
    deletingAttendance.value = false;
  }
};

const saveHistoryEdit = async () => {
  if (!selectedHistoryRecord.value) return;
  if (!historyEditForm.value.date || !historyEditForm.value.subject_id || !historyEditForm.value.status) {
    historyActionError.value = "សូមបំពេញកាលបរិច្ឆេទ មុខវិជ្ជា និងស្ថានភាព។";
    return;
  }

  savingHistoryEdit.value = true;
  historyActionError.value = "";
  try {
    await api.put(`/attendance/${selectedHistoryRecord.value.id}`, {
      student_id: Number(selectedHistoryRecord.value.student_id),
      class_id: Number(selectedHistoryRecord.value.class_id),
      subject_id: Number(historyEditForm.value.subject_id),
      date: historyEditForm.value.date,
      status: historyEditForm.value.status,
    });
    isHistoryEditOpen.value = false;
    selectedHistoryRecord.value = null;
    await fetchAttendanceHistory();
  } catch (error) {
    historyActionError.value = `មិនអាចកែប្រែកំណត់ត្រាបានទេ៖ ${getErrorMessage(error)}`;
  } finally {
    savingHistoryEdit.value = false;
  }
};

const filteredHistory = computed(() => {
  const keyword = historySearch.value.trim().toLowerCase();
  if (!keyword) return attendanceHistory.value;

  return attendanceHistory.value.filter((item) =>
    [
      getStudentName(item),
      getStudentCode(item),
      item.class_name,
      item.subject_name,
      item.status,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  );
});
const historySubjects = computed(() =>
  allSubjectList.value.length ? allSubjectList.value : subjectList.value
);

const displayStatus = (status) =>
  ({
    present: "មានវត្តមាន",
    absent: "អវត្តមាន",
    late: "មកយឺត",
  })[status] || "មិនទាន់កត់ត្រា";

const openTakeAttendance = () => {
  router.push({ path: "/attendance", query: { view: "take" } });
};

onMounted(async () => {
  await Promise.all([
    fetchClasses(),
    fetchSubjects().catch((error) => {
      pageError.value = `មិនអាចទាញយកបញ្ជីមុខវិជ្ជាបានទេ៖ ${getErrorMessage(error)}`;
    }),
  ]);
  if (isHistoryView.value) {
    await fetchAttendanceHistory();
  }
});

watch(
  () => route.query.view,
  (view) => {
    if (view === "history") fetchAttendanceHistory();
  }
);

// -------------------------------------------------------------
// 4. COMPUTED & ACTIONS
// -------------------------------------------------------------
const filteredStudents = computed(() => {
  if (!searchQuery.value) return studentList.value;
  const q = searchQuery.value.toLowerCase();
  return studentList.value.filter(
    (s) =>
      getStudentName(s).toLowerCase().includes(q) ||
      getStudentCode(s).toLowerCase().includes(q)
  );
});

const pendingAttendance = computed(() =>
  studentList.value.filter(
    (student) => student.status && student.status !== student.savedStatus
  )
);

const backToClasses = () => {
  if (
    pendingAttendance.value.length > 0 &&
    !window.confirm("មានវត្តមានមិនទាន់ដាក់ស្នើ។ តើអ្នកចង់ចាកចេញ ហើយបោះបង់ការកែប្រែទាំងនេះមែនទេ?")
  ) {
    return;
  }
  selectedClass.value = null;
  studentList.value = [];
  loadedAttendanceScope.value = null;
  pageError.value = "";
};

const updateStatus = (item, newStatus) => {
  if (!selectedSubjectId.value) {
    pageError.value = "សូមបន្ថែមមុខវិជ្ជា មុនពេលកត់ត្រាវត្តមាន។";
    return;
  }
  if (savingAttendance.value || item.status === newStatus) return;

  item.status = newStatus;
  pageError.value = "";
  attendanceNotice.value = "";
};

const submitAttendance = async () => {
  if (savingAttendance.value || pendingAttendance.value.length === 0) return;
  if (!selectedSubjectId.value || !selectedClass.value) {
    pageError.value = "សូមជ្រើសរើសថ្នាក់ និងមុខវិជ្ជា មុនពេលដាក់ស្នើវត្តមាន។";
    return;
  }

  savingAttendance.value = true;
  pageError.value = "";
  attendanceNotice.value = "";
  let savedCount = 0;
  const failedRecords = [];

  try {
    const recordsToSave = [...pendingAttendance.value];
    for (let index = 0; index < recordsToSave.length; index += 1) {
      const item = recordsToSave[index];
      const studentId = item.student_id || item.student?.id;
      attendanceSaveProgress.value = `កំពុងរក្សាទុក ${index + 1}/${recordsToSave.length}`;

      try {
        const payload = {
          student_id: Number(studentId),
          class_id: Number(selectedClass.value.id),
          subject_id: Number(selectedSubjectId.value),
          date: filterDate.value,
          status: item.status,
        };
        const response = item.id
          ? await api.put(`/attendance/${item.id}`, payload)
          : await api.post("/attendance", payload);

        item.id = response.data?.data?.id || item.id;
        item.savedStatus = item.status;
        savedCount += 1;
      } catch (error) {
        failedRecords.push(`${getStudentName(item)}៖ ${getErrorMessage(error)}`);
      }
    }

    if (failedRecords.length > 0) {
      pageError.value = `បានរក្សាទុក ${savedCount} នាក់។ មិនអាចរក្សាទុក ${failedRecords.length} នាក់បានទេ៖ ${failedRecords.join(" · ")}`;
    } else {
      attendanceNotice.value = `បានដាក់ស្នើវត្តមានសិស្ស ${savedCount} នាក់ដោយជោគជ័យ។`;
    }
  } finally {
    savingAttendance.value = false;
    attendanceSaveProgress.value = "";
  }
};
</script>

<template>
  <div class="attendance-page">
    <section v-if="isHistoryView" class="history-view">
      <div class="page-header">
        <div class="header-title">
          <div class="icon-badge">
            <i class="bi bi-clock-history"></i>
          </div>
          <div>
            <h2>ប្រវត្តិវត្តមាន</h2>
            <p>ស្វែងរក និងពិនិត្យមើលកំណត់ត្រាវត្តមានសិស្ស</p>
          </div>
        </div>
        <button class="btn-take-attendance" type="button" @click="openTakeAttendance">
          <i class="bi bi-plus-lg"></i>
          កត់ត្រាវត្តមាន
        </button>
      </div>

      <div v-if="pageError" class="warning-message" role="status">
        {{ pageError }}
      </div>

      <div class="history-filters">
        <label class="history-filter">
          <span>កាលបរិច្ឆេទ</span>
          <input type="date" v-model="historyDate" @change="fetchAttendanceHistory" />
        </label>
        <label class="history-filter">
          <span>ថ្នាក់រៀន</span>
          <select v-model="historyClassId" @change="fetchAttendanceHistory">
            <option value="">គ្រប់ថ្នាក់</option>
            <option v-for="cls in classList" :key="cls.id" :value="String(cls.id)">
              {{ cls.name }}
            </option>
          </select>
        </label>
        <label class="history-filter">
          <span>មុខវិជ្ជា</span>
          <select v-model="historySubjectId" @change="fetchAttendanceHistory">
            <option value="">គ្រប់មុខវិជ្ជា</option>
            <option v-for="subject in historySubjects" :key="subject.id" :value="String(subject.id)">
              {{ subject.name }}
            </option>
          </select>
        </label>
        <label class="history-filter search-filter">
          <span>ស្វែងរក</span>
          <input
            v-model="historySearch"
            type="search"
            placeholder="ឈ្មោះ កូដសិស្ស ឬថ្នាក់..."
          />
        </label>
      </div>

      <div v-if="historyError" class="error-message" role="alert">
        {{ historyError }}
        <button type="button" @click="fetchAttendanceHistory">ព្យាយាមម្ដងទៀត</button>
      </div>
      <div v-else-if="historyActionError" class="error-message" role="alert">
        {{ historyActionError }}
        <button type="button" @click="historyActionError = ''">បិទ</button>
      </div>
      <div v-else-if="historyLoading" class="loading-state" role="status">
        កំពុងទាញយកប្រវត្តិវត្តមាន...
      </div>
      <div v-else class="content-card">
        <div class="history-summary">
          កំណត់ត្រាចំនួន <strong>{{ filteredHistory.length }}</strong>
        </div>
        <div class="table-responsive">
          <table class="data-table history-table">
            <thead>
              <tr>
                <th>សិស្ស</th>
                <th>កូដសិស្ស</th>
                <th>ថ្នាក់</th>
                <th>មុខវិជ្ជា</th>
                <th>កាលបរិច្ឆេទ</th>
                <th>ស្ថានភាព</th>
                <th>សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredHistory" :key="record.id">
                <td>
                  <div class="student-profile">
                    <div class="avatar-sm">
                      <img
                        v-if="getStudentAvatar(record)"
                        :src="getStudentAvatar(record)"
                        :alt="`រូប Profile របស់ ${getStudentName(record)}`"
                      />
                      <i v-else class="bi bi-person-fill" aria-hidden="true"></i>
                    </div>
                    <strong>{{ getStudentName(record) }}</strong>
                  </div>
                </td>
                <td><span class="badge-code">{{ getStudentCode(record) }}</span></td>
                <td>{{ record.class_name || "—" }}</td>
                <td>{{ record.subject_name || "—" }}</td>
                <td>{{ String(record.date).slice(0, 10) }}</td>
                <td>
                  <span :class="['status-badge', `status-${record.status}`]">
                    {{ displayStatus(record.status) }}
                  </span>
                </td>
                <td>
                  <div class="history-actions">
                    <button
                      type="button"
                      class="history-action view-action"
                      title="មើលព័ត៌មាន"
                      aria-label="មើលព័ត៌មានវត្តមាន"
                      @click="openHistoryDetails(record)"
                    >
                      <i class="bi bi-eye" aria-hidden="true"></i>
                      <span>មើល</span>
                    </button>
                    <button
                      type="button"
                      class="history-action edit-action"
                      title="កែប្រែវត្តមាន"
                      aria-label="កែប្រែវត្តមាន"
                      @click="openHistoryEdit(record)"
                    >
                      <i class="bi bi-pencil-square" aria-hidden="true"></i>
                      <span>កែប្រែ</span>
                    </button>
                    <button
                      v-if="isAdmin"
                      type="button"
                      class="history-action delete-action"
                      title="លុបវត្តមាន"
                      aria-label="លុបកំណត់ត្រាវត្តមាន"
                      @click="openHistoryDelete(record)"
                    >
                      <i class="bi bi-trash3" aria-hidden="true"></i>
                      <span>លុប</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredHistory.length === 0">
                <td colspan="7" class="empty-history">
                  មិនមានកំណត់ត្រាវត្តមានដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <BaseModal
      :is-open="isHistoryDetailsOpen"
      title="ព័ត៌មានលម្អិតវត្តមាន"
      @close="isHistoryDetailsOpen = false"
    >
      <dl v-if="selectedHistoryRecord" class="history-details">
        <div>
          <dt>សិស្ស</dt>
          <dd>{{ getStudentName(selectedHistoryRecord) }}</dd>
        </div>
        <div>
          <dt>កូដសិស្ស</dt>
          <dd>{{ getStudentCode(selectedHistoryRecord) }}</dd>
        </div>
        <div>
          <dt>ថ្នាក់រៀន</dt>
          <dd>{{ selectedHistoryRecord.class_name || "—" }}</dd>
        </div>
        <div>
          <dt>មុខវិជ្ជា</dt>
          <dd>{{ selectedHistoryRecord.subject_name || "—" }}</dd>
        </div>
        <div>
          <dt>កាលបរិច្ឆេទ</dt>
          <dd>{{ String(selectedHistoryRecord.date).slice(0, 10) }}</dd>
        </div>
        <div>
          <dt>ស្ថានភាព</dt>
          <dd>
            <span :class="['status-badge', `status-${selectedHistoryRecord.status}`]">
              {{ displayStatus(selectedHistoryRecord.status) }}
            </span>
          </dd>
        </div>
        <div>
          <dt>លេខកំណត់ត្រា</dt>
          <dd>#{{ selectedHistoryRecord.id }}</dd>
        </div>
      </dl>
      <p v-if="historyActionError" class="history-action-error" role="alert">
        {{ historyActionError }}
      </p>
      <template #footer>
        <button
          class="history-action edit-action"
          type="button"
          @click="editHistoryRecordFromDetails"
        >
          <i class="bi bi-pencil-square" aria-hidden="true"></i>
          កែប្រែ
        </button>
        <button class="history-close-button" type="button" @click="isHistoryDetailsOpen = false">
          បិទ
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isHistoryEditOpen"
      title="កែប្រែកំណត់ត្រាវត្តមាន"
      @close="isHistoryEditOpen = false"
    >
      <div v-if="selectedHistoryRecord" class="history-edit-form">
        <p class="history-edit-student">
          {{ getStudentName(selectedHistoryRecord) }}
          <span>{{ getStudentCode(selectedHistoryRecord) }} · {{ selectedHistoryRecord.class_name || "—" }}</span>
        </p>
        <label class="history-edit-field">
          <span>កាលបរិច្ឆេទ</span>
          <input v-model="historyEditForm.date" type="date" required />
        </label>
        <label class="history-edit-field">
          <span>មុខវិជ្ជា</span>
          <select v-model="historyEditForm.subject_id" required>
            <option value="" disabled>ជ្រើសរើសមុខវិជ្ជា</option>
            <option
              v-for="subject in subjectList"
              :key="subject.id"
              :value="String(subject.id)"
            >
              {{ subject.name }}
            </option>
          </select>
        </label>
        <label class="history-edit-field">
          <span>ស្ថានភាព</span>
          <select v-model="historyEditForm.status" required>
            <option value="present">មានវត្តមាន</option>
            <option value="absent">អវត្តមាន</option>
            <option value="late">មកយឺត</option>
          </select>
        </label>
        <p v-if="historyActionError" class="history-action-error" role="alert">
          {{ historyActionError }}
        </p>
      </div>
      <template #footer>
        <button
          class="history-close-button"
          type="button"
          :disabled="savingHistoryEdit"
          @click="isHistoryEditOpen = false"
        >
          បោះបង់
        </button>
        <button
          class="history-save-button"
          type="button"
          :disabled="savingHistoryEdit"
          @click="saveHistoryEdit"
        >
          {{ savingHistoryEdit ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isHistoryDeleteOpen"
      title="បញ្ជាក់ការលុបវត្តមាន"
      :close-on-backdrop="!deletingAttendance"
      @close="!deletingAttendance && (isHistoryDeleteOpen = false)"
    >
      <div class="history-delete-confirmation">
        <p>តើអ្នកពិតជាចង់លុបកំណត់ត្រាវត្តមាននេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</p>
        <strong v-if="selectedHistoryRecord">
          {{ getStudentName(selectedHistoryRecord) }}
          · {{ selectedHistoryRecord.class_name || "—" }}
          · {{ String(selectedHistoryRecord.date).slice(0, 10) }}
          · {{ displayStatus(selectedHistoryRecord.status) }}
        </strong>
        <p v-if="historyDeleteError" class="history-action-error" role="alert">
          {{ historyDeleteError }}
        </p>
      </div>
      <template #footer>
        <button
          class="history-close-button"
          type="button"
          :disabled="deletingAttendance"
          @click="isHistoryDeleteOpen = false"
        >
          បោះបង់
        </button>
        <button
          class="history-delete-button"
          type="button"
          :disabled="deletingAttendance || !isAdmin"
          @click="deleteHistoryRecord"
        >
          {{ deletingAttendance ? "កំពុងលុប..." : "លុបវត្តមាន" }}
        </button>
      </template>
    </BaseModal>

    <!-- =========================================================
         VIEW 1: CLASS CARDS GRID
    ========================================================== -->
    <div v-if="!isHistoryView && !selectedClass">
      <div class="page-header">
        <div class="header-title">
          <div class="icon-badge">
            <i class="bi bi-door-open"></i>
          </div>
          <div>
            <h2>វត្តមានតាមថ្នាក់រៀន</h2>
            <p>សូមជ្រើសរើសថ្នាក់រៀនខាងក្រោម ដើម្បីគ្រប់គ្រង និងស្រង់វត្តមានសិស្ស</p>
          </div>
        </div>

        <div class="header-filter-group">
          <!-- Filter មុខវិជ្ជា -->
          <div class="select-box">
            <i class="bi bi-journal-bookmark"></i>
            <select v-model="selectedSubjectId" @change="onFilterChange">
              <option value="">-- គ្រប់មុខវិជ្ជា --</option>
              <option v-for="sub in subjectList" :key="sub.id" :value="sub.id">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <!-- Filter កាលបរិច្ឆេទ -->
          <div class="date-picker-box">
            <i class="bi bi-calendar3"></i>
            <input type="date" v-model="filterDate" @change="onFilterChange" />
          </div>
        </div>
      </div>

      <div v-if="pageError" class="error-message" role="alert">
        {{ pageError }}
        <button type="button" @click="retryLoadClasses">ព្យាយាមម្ដងទៀត</button>
      </div>
      <div v-else-if="classesLoading" class="loading-state" role="status">
        កំពុងទាញយកទិន្នន័យថ្នាក់រៀន...
      </div>

      <div v-else-if="classList.length" class="class-grid">
        <div
          v-for="cls in classList"
          :key="cls.id"
          class="class-card"
          role="button"
          tabindex="0"
          @click="fetchClassAttendance(cls)"
          @keydown.enter="fetchClassAttendance(cls)"
          @keydown.space.prevent="fetchClassAttendance(cls)"
        >
          <div class="card-top">
            <div class="class-icon">
              <i class="bi bi-book"></i>
            </div>
            <span class="badge-student-count">
              <i class="bi bi-people"></i> {{ cls.student_count || cls.students_count || 0 }} សិស្ស
            </span>
          </div>

          <div class="card-body">
            <h3>{{ cls.name }}</h3>
            <p class="grade-level">កម្រិត៖ {{ cls.grade_level || 'General' }}</p>
          </div>

          <div class="card-footer">
            <span>ស្រង់វត្តមាន</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
      <div v-else class="empty-history">
          មិនទាន់មានថ្នាក់រៀនក្នុងប្រព័ន្ធទេ
      </div>
    </div>

    <!-- =========================================================
         VIEW 2: STUDENT TABLE
    ========================================================== -->
    <div v-if="!isHistoryView && selectedClass">
      <div class="page-header">
        <div class="header-title">
          <button class="btn-back" @click="backToClasses" title="ត្រឡប់ក្រោយ">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div>
            <h2>ថ្នាក់រៀន៖ {{ selectedClass.name }}</h2>
            <p>កាលបរិច្ឆេទ៖ {{ filterDate }}</p>
          </div>
        </div>

        <div class="header-actions">
          <!-- Select មុខវិជ្ជា ក្នុង Table View -->
          <div class="select-box">
            <i class="bi bi-journal-text"></i>
            <select v-model="selectedSubjectId" @change="onFilterChange">
              <option value="" disabled>-- ជ្រើសរើសមុខវិជ្ជា --</option>
              <option v-for="sub in subjectList" :key="sub.id" :value="String(sub.id)">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <div class="search-box">
            <i class="bi bi-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ស្វែងរកឈ្មោះ ឬកូដសិស្ស..."
            />
          </div>
        </div>
      </div>

      <div v-if="pageError" class="error-message" role="alert">
        {{ pageError }}
        <button type="button" @click="fetchClassAttendance(selectedClass)">ព្យាយាមម្ដងទៀត</button>
      </div>
      <div v-if="attendanceNotice" class="attendance-notice" role="status">
        {{ attendanceNotice }}
      </div>
      <div v-if="!subjectList.length && !loading" class="warning-message" role="status">
        មិនទាន់មានមុខវិជ្ជាសម្រាប់កត់ត្រាវត្តមានទេ។ សូមបន្ថែមមុខវិជ្ជាជាមុនសិន។
      </div>

      <!-- Table Content -->
      <div class="content-card">
        <div class="attendance-submit-bar">
          <span :class="{ 'has-pending': pendingAttendance.length > 0 }">
            <i class="bi bi-check2-square" aria-hidden="true"></i>
            {{ pendingAttendance.length
              ? `មាន ${pendingAttendance.length} នាក់មិនទាន់ដាក់ស្នើ`
              : "មិនមានការកែប្រែមិនទាន់ដាក់ស្នើ"
            }}
          </span>
          <button
            type="button"
            class="submit-attendance-button"
            :disabled="pendingAttendance.length === 0 || savingAttendance || loading || !selectedSubjectId"
            @click="submitAttendance"
          >
            <i
              :class="['bi', savingAttendance ? 'bi-arrow-repeat' : 'bi-send-check']"
              aria-hidden="true"
            ></i>
            {{ savingAttendance ? attendanceSaveProgress : "ដាក់ស្នើវត្តមាន" }}
          </button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ឈ្មោះសិស្ស</th>
                <th>កូដសិស្ស</th>
                <th>កាលបរិច្ឆេទ</th>
                <th class="text-center">ជ្រើសរើសវត្តមាន</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-4">កំពុងទាញយកបញ្ជីសិស្ស...</td>
              </tr>
              <tr v-else-if="filteredStudents.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">មិនមានសិស្សក្នុងថ្នាក់នេះឡើយ</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in filteredStudents"
                :key="item.id || item.student_id || index"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="student-profile">
                    <div class="avatar-sm">
                      <img
                        v-if="getStudentAvatar(item)"
                        :src="getStudentAvatar(item)"
                        :alt="`រូប Profile របស់ ${getStudentName(item)}`"
                      />
                      <i v-else class="bi bi-person-fill" aria-hidden="true"></i>
                    </div>
                    <strong>{{ getStudentName(item) }}</strong>
                  </div>
                </td>
                <td>
                  <span class="badge-code">{{ getStudentCode(item) }}</span>
                </td>
                <td>{{ filterDate }}</td>
                <td>
                  <div class="attendance-toggle-group">
                    <button
                      type="button"
                      :class="['toggle-btn', 'present', { active: item.status === 'present' }]"
                      :disabled="!selectedSubjectId || savingAttendance"
                      @click="updateStatus(item, 'present')"
                    >
                      <i class="bi bi-check-circle-fill"></i> មានវត្តមាន
                    </button>

                    <button
                      type="button"
                      :class="['toggle-btn', 'absent', { active: item.status === 'absent' }]"
                      :disabled="!selectedSubjectId || savingAttendance"
                      @click="updateStatus(item, 'absent')"
                    >
                      <i class="bi bi-x-circle-fill"></i> អវត្តមាន
                    </button>

                    <button
                      type="button"
                      :class="['toggle-btn', 'late', { active: item.status === 'late' }]"
                      :disabled="!selectedSubjectId || savingAttendance"
                      @click="updateStatus(item, 'late')"
                    >
                      <i class="bi bi-clock-fill"></i> មកយឺត
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attendance-page {
  padding: 24px;
}

.history-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e6ede9;
  border-radius: 14px;
  background: #fff;
}

.history-filter {
  display: grid;
  gap: 6px;
  color: #66736d;
  font-size: 12px;
  font-weight: 600;
}

.history-filter input,
.history-filter select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #dfe8e3;
  border-radius: 9px;
  background: #fff;
  color: #1b2d25;
  font: inherit;
  font-size: 12px;
}

.history-summary {
  padding: 0 0 14px;
  color: #75877e;
  font-size: 12px;
}

.history-summary strong {
  color: #16834b;
}

.history-table {
  min-width: 680px;
}

.history-actions {
  display: flex;
  gap: 6px;
}

.history-action,
.history-close-button,
.history-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.view-action {
  border-color: #dce8f4;
  background: #f2f7fc;
  color: #356b9a;
}

.edit-action {
  border-color: #d3eadc;
  background: #eff8f2;
  color: #16834b;
}

.delete-action {
  border-color: #f2d4d4;
  background: #fff5f5;
  color: #b8333e;
}

.history-close-button {
  border-color: #dfe8e3;
  background: #fff;
  color: #52625a;
}

.history-save-button {
  background: #16834b;
  color: #fff;
}

.history-delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 7px;
  background: #c53d43;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.history-close-button:disabled,
.history-save-button:disabled,
.history-delete-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.history-delete-confirmation {
  color: #586c62;
  font-size: 13px;
  line-height: 1.6;
}

.history-delete-confirmation p {
  margin: 0 0 10px;
}

.history-delete-confirmation strong {
  color: #34483e;
}

.history-details {
  display: grid;
  gap: 0;
  margin: 0;
}

.history-details > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #edf1ef;
}

.history-details > div:last-child {
  border-bottom: 0;
}

.history-details dt {
  color: #75877e;
  font-size: 12px;
}

.history-details dd {
  margin: 0;
  color: #27372f;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.history-edit-form {
  display: grid;
  gap: 14px;
}

.history-edit-student {
  margin: 0;
  color: #27372f;
  font-size: 14px;
  font-weight: 700;
}

.history-edit-student span {
  display: block;
  margin-top: 4px;
  color: #87938d;
  font-size: 11px;
  font-weight: 400;
}

.history-edit-field {
  display: grid;
  gap: 6px;
  color: #52625a;
  font-size: 12px;
  font-weight: 600;
}

.history-edit-field input,
.history-edit-field select {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid #dfe8e3;
  border-radius: 8px;
  background: #fff;
  color: #1b2d25;
  font: inherit;
  font-size: 13px;
}

.history-action-error {
  margin: 0;
  color: #b43d43;
  font-size: 12px;
  line-height: 1.5;
}

.history-actions {
  display: flex;
  gap: 6px;
}

.history-action,
.history-close-button,
.history-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.view-action {
  border-color: #dce8f4;
  background: #f2f7fc;
  color: #356b9a;
}

.edit-action {
  border-color: #d3eadc;
  background: #eff8f2;
  color: #16834b;
}

.history-close-button {
  border-color: #dfe8e3;
  background: #fff;
  color: #52625a;
}

.history-save-button {
  background: #16834b;
  color: #fff;
}

.history-close-button:disabled,
.history-save-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.history-details {
  display: grid;
  gap: 0;
  margin: 0;
}

.history-details > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #edf1ef;
}

.history-details > div:last-child {
  border-bottom: 0;
}

.history-details dt {
  color: #75877e;
  font-size: 12px;
}

.history-details dd {
  margin: 0;
  color: #27372f;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.history-edit-form {
  display: grid;
  gap: 14px;
}

.history-edit-student {
  margin: 0;
  color: #27372f;
  font-size: 14px;
  font-weight: 700;
}

.history-edit-student span {
  display: block;
  margin-top: 4px;
  color: #87938d;
  font-size: 11px;
  font-weight: 400;
}

.history-edit-field {
  display: grid;
  gap: 6px;
  color: #52625a;
  font-size: 12px;
  font-weight: 600;
}

.history-edit-field input,
.history-edit-field select {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid #dfe8e3;
  border-radius: 8px;
  background: #fff;
  color: #1b2d25;
  font: inherit;
  font-size: 13px;
}

.history-action-error {
  margin: 0;
  color: #b43d43;
  font-size: 12px;
  line-height: 1.5;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.status-badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.status-present {
  background: #e3f4ea;
  color: #16834b;
}

.status-absent {
  background: #fef2f2;
  color: #dc2626;
}

.status-late {
  background: #eff6ff;
  color: #2563eb;
}

.empty-history {
  padding: 32px 16px !important;
  color: #8a9690 !important;
  text-align: center;
}

.error-message,
.warning-message {
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid #f1c9c9;
  border-radius: 10px;
  background: #fff7f7;
  color: #a93535;
  font-size: 13px;
  line-height: 1.5;
}

.warning-message {
  border-color: #f0e0b0;
  background: #fffaf0;
  color: #886318;
}

.error-message button {
  margin-left: 8px;
  padding: 5px 9px;
  border: 0;
  border-radius: 6px;
  background: #fbe3e3;
  color: #9c3030;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-badge {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #e3f4ea;
  color: #16834b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.btn-back {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dfe8e3;
  color: #1b2d25;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e3f4ea;
  color: #16834b;
  border-color: #16834b;
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1b2d25;
}

.header-title p {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #8a9690;
}

.header-filter-group,
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select-box,
.date-picker-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 0 14px;
  height: 40px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  color: #16834b;
}

.select-box select,
.date-picker-box input {
  border: none;
  outline: none;
  font-size: 12px;
  color: #1b2d25;
  background: transparent;
}

.search-box {
  position: relative;
  width: 240px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a9690;
}

.search-box input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 34px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  font-size: 12px;
  outline: none;
  background: #fafcfb;
}

/* Class Grid */
.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.class-card {
  background: white;
  border: 1px solid #e6ede9;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.class-card:hover {
  transform: translateY(-4px);
  border-color: #16834b;
  box-shadow: 0 10px 25px rgba(22, 131, 75, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.class-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #e3f4ea;
  color: #16834b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.badge-student-count {
  font-size: 11px;
  font-weight: 600;
  color: #52625a;
  background: #f0f4f2;
  padding: 4px 10px;
  border-radius: 20px;
}

.card-body h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1b2d25;
}

.grade-level {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #8a9690;
}

.card-footer {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #f0f4f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #16834b;
}

/* Content & Table */
.content-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e6ede9;
  padding: 20px;
}

.attendance-submit-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf1ef;
}

.attendance-submit-bar > span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #78877f;
  font-size: 12px;
}

.attendance-submit-bar > span.has-pending {
  color: #8b6419;
  font-weight: 600;
}

.submit-attendance-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: #16834b;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.submit-attendance-button:hover:not(:disabled) {
  background: #11683b;
}

.submit-attendance-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.attendance-notice {
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid #cde8d6;
  border-radius: 10px;
  background: #f0faf3;
  color: #176b3e;
  font-size: 13px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: #fafcfb;
  color: #52625a;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e6ede9;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f4f2;
  color: #27372f;
}

.student-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-sm {
  display: flex;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #707579;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  overflow: hidden;
}

.avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-code {
  background: #f0f4f2;
  color: #16834b;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.attendance-toggle-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.toggle-btn {
  border: 1px solid #dfe8e3;
  background: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8a9690;
  transition: all 0.15s;
}

.toggle-btn:disabled {
  cursor: wait;
  opacity: 0.55;
}

.toggle-btn.present.active {
  background: #e3f4ea;
  color: #16834b;
  border-color: #16834b;
}

.toggle-btn.absent.active {
  background: #fef2f2;
  color: #dc2626;
  border-color: #dc2626;
}

.toggle-btn.late.active {
  background: #eff6ff;
  color: #2563eb;
  border-color: #2563eb;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #8a9690;
}

@media (max-width: 900px) {
  .history-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .attendance-page {
    padding: 16px 12px;
  }

  .history-filters {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .history-view > .page-header {
    align-items: stretch;
  }

  .btn-take-attendance {
    min-height: 40px;
    border: 0;
    border-radius: 9px;
    background: #16834b;
    color: #fff;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .content-card {
    padding: 14px;
  }

  .attendance-submit-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .submit-attendance-button {
    width: 100%;
  }

  .header-filter-group,
  .header-actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .select-box,
  .date-picker-box,
  .search-box {
    box-sizing: border-box;
    width: 100%;
  }

  .attendance-toggle-group {
    min-width: 320px;
  }
}
</style>