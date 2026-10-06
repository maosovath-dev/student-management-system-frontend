<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api/api";
import scoreApi from "@/api/scores";
import BaseModal from "@/components/ui/BaseModal.vue";

const scores = ref([]);
const students = ref([]);
const subjects = ref([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const loadError = ref("");
const actionError = ref("");
const search = ref("");
const selectedSemester = ref("");
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedScore = ref(null);
const form = reactive({
  id: null,
  student_id: "",
  subject_id: "",
  score: "",
  semester: "",
});

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
});
const canDeleteScores = computed(() => currentUser.value.role === "admin");

const getList = (response) => {
  const result = response.data?.data ?? response.data;
  if (!Array.isArray(result)) {
    throw new Error("The server returned an invalid list.");
  }
  return result;
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "An unexpected error occurred.";

const fetchData = async () => {
  loading.value = true;
  loadError.value = "";

  try {
    const [scoresResponse, studentsResponse, subjectsResponse] = await Promise.all([
      scoreApi.getAll(),
      api.get("/students"),
      api.get("/subjects"),
    ]);

    scores.value = getList(scoresResponse);
    students.value = getList(studentsResponse);
    subjects.value = getList(subjectsResponse);
  } catch (error) {
    loadError.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const semesters = computed(() =>
  [...new Set(scores.value.map((item) => item.semester).filter(Boolean))].sort()
);

const filteredScores = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return scores.value.filter((item) => {
    const studentName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
    const matchesSearch =
      !keyword ||
      String(item.student_code || "").toLowerCase().includes(keyword) ||
      studentName.toLowerCase().includes(keyword) ||
      String(item.subject_name || "").toLowerCase().includes(keyword);
    const matchesSemester =
      !selectedSemester.value || item.semester === selectedSemester.value;

    return matchesSearch && matchesSemester;
  });
});

const averageScore = computed(() => {
  if (scores.value.length === 0) return "0.0";
  const total = scores.value.reduce((sum, item) => sum + Number(item.score || 0), 0);
  return (total / scores.value.length).toFixed(1);
});

const openCreateModal = () => {
  Object.assign(form, {
    id: null,
    student_id: "",
    subject_id: "",
    score: "",
    semester: "",
  });
  actionError.value = "";
  isFormModalOpen.value = true;
};

const openEditModal = (item) => {
  Object.assign(form, {
    id: item.id,
    student_id: String(item.student_id),
    subject_id: String(item.subject_id),
    score: item.score,
    semester: item.semester || "",
  });
  actionError.value = "";
  isFormModalOpen.value = true;
};

const openDeleteModal = (item) => {
  selectedScore.value = item;
  actionError.value = "";
  isDeleteModalOpen.value = true;
};

const saveScore = async () => {
  const scoreValue = Number(form.score);
  if (!form.student_id || !form.subject_id) {
    actionError.value = "សូមជ្រើសរើសសិស្ស និងមុខវិជ្ជា។";
    return;
  }
  if (form.score === "" || !Number.isFinite(scoreValue) || scoreValue < 0 || scoreValue > 100) {
    actionError.value = "ពិន្ទុត្រូវតែស្ថិតនៅចន្លោះ 0 និង 100។";
    return;
  }

  saving.value = true;
  actionError.value = "";

  const payload = {
    student_id: Number(form.student_id),
    subject_id: Number(form.subject_id),
    score: scoreValue,
    semester: form.semester.trim() || null,
  };

  try {
    if (form.id) {
      await scoreApi.update(form.id, payload);
    } else {
      await scoreApi.create(payload);
    }
    isFormModalOpen.value = false;
    await fetchData();
  } catch (error) {
    actionError.value = getErrorMessage(error);
  } finally {
    saving.value = false;
  }
};

const deleteScore = async () => {
  if (!selectedScore.value) return;

  deleting.value = true;
  actionError.value = "";
  try {
    await scoreApi.delete(selectedScore.value.id);
    isDeleteModalOpen.value = false;
    selectedScore.value = null;
    await fetchData();
  } catch (error) {
    actionError.value = getErrorMessage(error);
  } finally {
    deleting.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="page-title">
        <div class="title-icon" aria-hidden="true">
          <i class="bi bi-bar-chart-fill"></i>
        </div>
        <div>
          <h1>គ្រប់គ្រងពិន្ទុ</h1>
          <p>មើល និងគ្រប់គ្រងពិន្ទុសិស្សតាមមុខវិជ្ជា</p>
        </div>
      </div>
      <button class="primary-button" type="button" @click="openCreateModal">
        <i class="bi bi-plus-lg" aria-hidden="true"></i>
        បញ្ចូលពិន្ទុ
      </button>
    </header>

    <div class="summary-grid">
      <article class="summary-card">
        <div class="summary-icon">
          <i class="bi bi-journal-check" aria-hidden="true"></i>
        </div>
        <div>
          <p>ពិន្ទុសរុប</p>
          <strong>{{ scores.length }}</strong>
          <span>កំណត់ត្រាពិន្ទុ</span>
        </div>
      </article>
      <article class="summary-card">
        <div class="summary-icon average-icon">
          <i class="bi bi-graph-up-arrow" aria-hidden="true"></i>
        </div>
        <div>
          <p>មធ្យមភាគ</p>
          <strong>{{ averageScore }}<small> / 100</small></strong>
          <span>ពិន្ទុជាមធ្យម</span>
        </div>
      </article>
    </div>

    <section class="table-card">
      <div class="table-header">
        <div>
          <h2>បញ្ជីពិន្ទុ</h2>
          <p>បង្ហាញ {{ filteredScores.length }} ក្នុងចំណោម {{ scores.length }} កំណត់ត្រា</p>
        </div>
        <div class="toolbar">
          <label class="filter-control">
            <span class="sr-only">ត្រងតាមឆមាស</span>
            <select v-model="selectedSemester">
              <option value="">គ្រប់ឆមាស</option>
              <option v-for="semester in semesters" :key="semester" :value="semester">
                {{ semester }}
              </option>
            </select>
          </label>
          <label class="search-control">
            <i class="bi bi-search" aria-hidden="true"></i>
            <span class="sr-only">ស្វែងរកពិន្ទុ</span>
            <input
              v-model="search"
              type="search"
              placeholder="ស្វែងរកសិស្ស ឬមុខវិជ្ជា..."
            />
          </label>
        </div>
      </div>

      <div v-if="loading" class="state-message" role="status">
        កំពុងផ្ទុកទិន្នន័យ...
      </div>
      <div v-else-if="loadError" class="state-message error-message" role="alert">
        <span>មិនអាចទាញយកទិន្នន័យពិន្ទុបានទេ៖ {{ loadError }}</span>
        <button class="retry-button" type="button" @click="fetchData">ព្យាយាមម្ដងទៀត</button>
      </div>
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>សិស្ស</th>
              <th>មុខវិជ្ជា</th>
              <th>ឆមាស</th>
              <th>ពិន្ទុ</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredScores" :key="item.id">
              <td>
                <div class="student-cell">
                  <span class="student-avatar" aria-hidden="true">
                    {{ (item.first_name || "?").charAt(0).toUpperCase() }}
                  </span>
                  <div>
                    <strong>{{ `${item.first_name || ""} ${item.last_name || ""}`.trim() || "មិនស្គាល់ឈ្មោះ" }}</strong>
                    <span>{{ item.student_code || `ID: ${item.student_id}` }}</span>
                  </div>
                </div>
              </td>
              <td>{{ item.subject_name || `មុខវិជ្ជា #${item.subject_id}` }}</td>
              <td>{{ item.semester || "—" }}</td>
              <td>
                <span class="score-value">{{ Number(item.score).toFixed(1) }}</span>
                <span class="score-total">/ 100</span>
              </td>
              <td>
                <div class="row-actions">
                  <button
                    class="icon-button edit-button"
                    type="button"
                    title="កែប្រែពិន្ទុ"
                    aria-label="កែប្រែពិន្ទុ"
                    @click="openEditModal(item)"
                  >
                    <i class="bi bi-pencil-square" aria-hidden="true"></i>
                  </button>
                  <button
                    v-if="canDeleteScores"
                    class="icon-button delete-button"
                    type="button"
                    title="លុបពិន្ទុ"
                    aria-label="លុបពិន្ទុ"
                    @click="openDeleteModal(item)"
                  >
                    <i class="bi bi-trash3" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredScores.length === 0">
              <td colspan="5" class="empty-state">
                មិនមានទិន្នន័យពិន្ទុដែលត្រូវនឹងការស្វែងរកទេ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal
      :is-open="isFormModalOpen"
      :title="form.id ? 'កែប្រែពិន្ទុ' : 'បញ្ចូលពិន្ទុថ្មី'"
      @close="isFormModalOpen = false"
    >
      <form class="modal-form" @submit.prevent="saveScore">
        <div class="form-group">
          <label for="score-student">សិស្ស</label>
          <select id="score-student" v-model="form.student_id" required>
            <option value="" disabled>ជ្រើសរើសសិស្ស</option>
            <option v-for="student in students" :key="student.id" :value="String(student.id)">
              {{ student.student_code ? `${student.student_code} — ` : "" }}
              {{ `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.name || `សិស្ស #${student.id}` }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="score-subject">មុខវិជ្ជា</label>
          <select id="score-subject" v-model="form.subject_id" required>
            <option value="" disabled>ជ្រើសរើសមុខវិជ្ជា</option>
            <option v-for="subject in subjects" :key="subject.id" :value="String(subject.id)">
              {{ subject.name || subject.subject_name || `មុខវិជ្ជា #${subject.id}` }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="score-value">ពិន្ទុ (0–100)</label>
            <input
              id="score-value"
              v-model.number="form.score"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>
          <div class="form-group">
            <label for="score-semester">ឆមាស (ស្រេចចិត្ត)</label>
            <input
              id="score-semester"
              v-model="form.semester"
              type="text"
              maxlength="50"
              placeholder="ឧ. ឆមាសទី១"
            />
          </div>
        </div>
        <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
      </form>
      <template #footer>
        <button class="secondary-button" type="button" @click="isFormModalOpen = false">
          បោះបង់
        </button>
        <button class="primary-button" type="button" :disabled="saving" @click="saveScore">
          {{ saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isDeleteModalOpen"
      title="បញ្ជាក់ការលុបពិន្ទុ"
      @close="isDeleteModalOpen = false"
    >
      <div class="delete-confirmation">
        <p>តើអ្នកពិតជាចង់លុបកំណត់ត្រាពិន្ទុនេះមែនទេ?</p>
        <strong v-if="selectedScore">
          {{ selectedScore.first_name }} {{ selectedScore.last_name }}
          — {{ selectedScore.subject_name }} ({{ selectedScore.score }}/100)
        </strong>
        <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
      </div>
      <template #footer>
        <button class="secondary-button" type="button" @click="isDeleteModalOpen = false">
          បោះបង់
        </button>
        <button class="danger-button" type="button" :disabled="deleting" @click="deleteScore">
          {{ deleting ? "កំពុងលុប..." : "លុបពិន្ទុ" }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page {
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
  padding: 32px 24px;
  color: #20352b;
  font-family: "Kantumruy Pro", sans-serif;
}

.page-header,
.page-title,
.table-header,
.toolbar,
.student-cell,
.row-actions {
  display: flex;
  align-items: center;
}

.page-header,
.table-header {
  justify-content: space-between;
  gap: 20px;
}

.page-header {
  margin-bottom: 26px;
}

.page-title {
  gap: 16px;
}

.title-icon,
.summary-icon,
.student-avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}

.title-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #e7f4ec;
  color: #218455;
  font-size: 23px;
}

h1,
h2,
p {
  margin: 0;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 700;
}

.page-title p,
.table-header p {
  margin-top: 5px;
  color: #75877e;
  font-size: 13px;
}

.primary-button,
.secondary-button,
.danger-button,
.retry-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #218455;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: #176b43;
}

.secondary-button {
  border: 1px solid #dce7e0;
  background: white;
  color: #496357;
}

.danger-button {
  background: #c53d43;
  color: white;
}

.primary-button:disabled,
.danger-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 116px;
  padding: 20px;
  border: 1px solid #e4eee8;
  border-radius: 14px;
  background: white;
  box-shadow: 0 5px 18px rgb(23 70 49 / 4%);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #eaf4ff;
  color: #4680bd;
  font-size: 20px;
}

.average-icon {
  background: #f1edff;
  color: #7a65bd;
}

.summary-card p {
  color: #75877e;
  font-size: 12px;
}

.summary-card strong {
  display: block;
  margin: 4px 0 1px;
  color: #20352b;
  font-size: 24px;
}

.summary-card small {
  color: #75877e;
  font-size: 12px;
  font-weight: 500;
}

.summary-card span {
  color: #97a69f;
  font-size: 11px;
}

.table-card {
  overflow: hidden;
  border: 1px solid #e4eee8;
  border-radius: 14px;
  background: white;
  box-shadow: 0 5px 18px rgb(23 70 49 / 4%);
}

.table-header {
  min-height: 82px;
  padding: 16px 20px;
  border-bottom: 1px solid #edf2ef;
}

.table-header h2 {
  font-size: 16px;
}

.toolbar {
  justify-content: flex-end;
  gap: 10px;
}

.search-control,
.filter-control select {
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #e0e9e4;
  border-radius: 8px;
  background: #fff;
  color: #75877e;
}

.search-control {
  gap: 9px;
  width: 270px;
  padding: 0 11px;
}

.search-control input,
.filter-control select {
  width: 100%;
  border: 0;
  outline: 0;
  color: #33483e;
  font: inherit;
  font-size: 12px;
}

.filter-control select {
  min-width: 130px;
  padding: 0 10px;
}

.table-wrapper {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px 20px;
  border-bottom: 1px solid #edf2ef;
  font-size: 12px;
}

th {
  background: #fbfdfb;
  color: #74867d;
  font-weight: 600;
  white-space: nowrap;
}

td {
  color: #4e6359;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.student-cell {
  gap: 10px;
  min-width: 180px;
}

.student-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e7f4ec;
  color: #218455;
  font-size: 13px;
  font-weight: 700;
}

.student-cell strong,
.student-cell span {
  display: block;
}

.student-cell strong {
  color: #344b40;
  font-size: 12px;
  font-weight: 600;
}

.student-cell div > span {
  margin-top: 3px;
  color: #94a39b;
  font-size: 10px;
}

.score-value {
  color: #20352b;
  font-size: 14px;
  font-weight: 700;
}

.score-total {
  margin-left: 3px;
  color: #94a39b;
  font-size: 11px;
}

.row-actions {
  gap: 7px;
}

.icon-button {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border: 0;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
}

.edit-button {
  color: #4d82b4;
}

.delete-button {
  color: #c45a5a;
}

.icon-button:hover {
  background: #f2f6f3;
}

.empty-state,
.state-message {
  padding: 38px 20px;
  color: #87978f;
  text-align: center;
}

.state-message {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.error-message,
.form-error {
  color: #b43d43;
}

.retry-button {
  min-height: 34px;
  background: #e7f4ec;
  color: #218455;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.modal-form {
  display: grid;
  gap: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-group label {
  color: #51665c;
  font-size: 12px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid #dce7e0;
  border-radius: 8px;
  background: white;
  color: #34483e;
  font: inherit;
  font-size: 13px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #56a77c;
  outline: 3px solid rgb(86 167 124 / 15%);
}

.form-error {
  margin: 0;
  font-size: 12px;
}

.delete-confirmation {
  color: #586c62;
  font-size: 13px;
  line-height: 1.6;
}

.delete-confirmation strong {
  color: #34483e;
}

.delete-confirmation .form-error {
  margin-top: 12px;
}

@media (max-width: 720px) {
  .page {
    padding: 22px 14px;
  }

  .page-header,
  .table-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar {
    width: 100%;
  }

  .filter-control {
    flex: 0 0 auto;
  }

  .search-control {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  .summary-grid {
    gap: 10px;
  }

  .summary-card {
    gap: 10px;
    padding: 14px;
  }
}

@media (max-width: 560px) {
  .page {
    padding: 18px 12px;
  }

  .page-header {
    gap: 14px;
  }

  .page-title {
    gap: 11px;
  }

  .title-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 19px;
  }

  .page-title h1 {
    font-size: 20px;
  }

  .page-title p {
    font-size: 12px;
  }

  .page-header > .primary-button {
    width: 100%;
  }

  .table-header {
    gap: 14px;
    padding: 15px;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-control,
  .filter-control select,
  .search-control {
    box-sizing: border-box;
    width: 100%;
  }

  .table-header p {
    font-size: 12px;
  }

  th,
  td {
    padding: 12px 14px;
  }

  :deep(.base-modal__panel) {
    max-height: calc(100dvh - 1rem);
    padding: 1rem;
  }

  :deep(.base-modal__footer) {
    flex-wrap: wrap;
  }
}

@media (max-width: 460px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .summary-card {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    padding: 12px;
  }

  .summary-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    font-size: 17px;
  }

  .summary-card strong {
    font-size: 21px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  :deep(.base-modal__footer) {
    flex-direction: column-reverse;
  }

  :deep(.base-modal__footer > button) {
    width: 100%;
  }
}

@media (max-width: 360px) {
  .page {
    padding-right: 9px;
    padding-left: 9px;
  }

  .page-title h1 {
    font-size: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    align-items: center;
    flex-direction: row;
    min-height: 90px;
  }
}
</style>
