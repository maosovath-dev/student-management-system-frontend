<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useSubjectStore } from "../../stores/subject.store";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTable from "@/components/ui/BaseTable.vue";

// Import UI Modal Component
import BaseModal from "@/components/ui/BaseModal.vue";
import { useToast } from "@/composables/useToast";

const subjectStore = useSubjectStore();
const { showToast } = useToast();
const search = ref("");

// Modal Visibility Controls
const isCreateModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const selectedSubject = ref(null);

// Form Reactive States
const createForm = reactive({
  name: "",
  description: "",
});

const updateForm = reactive({
  id: null,
  name: "",
  description: "",
});

const subjectTableColumns = [
  { key: "number", label: "#" },
  { key: "subject", label: "ឈ្មោះមុខវិជ្ជា" },
  { key: "description", label: "ការពិពណ៌នា" },
  { key: "actions", label: "សកម្មភាព" },
];

onMounted(() => {
  subjectStore.fetchSubjects();
});

// Search Filter
const filteredSubjects = computed(() => {
  if (!search.value) return subjectStore.subjects;

  const keyword = search.value.toLowerCase();
  return subjectStore.subjects.filter((item) => {
    return (
      String(item.id).toLowerCase().includes(keyword) ||
      String(item.name || "").toLowerCase().includes(keyword) ||
      String(item.description || "").toLowerCase().includes(keyword)
    );
  });
});

// Modal Actions
const openCreateModal = () => {
  createForm.name = "";
  createForm.description = "";
  isCreateModalOpen.value = true;
};

const openEditModal = (item) => {
  updateForm.id = item.id;
  updateForm.name = item.name;
  updateForm.description = item.description || "";
  isUpdateModalOpen.value = true;
};

const openDeleteModal = (item) => {
  selectedSubject.value = item;
  isDeleteModalOpen.value = true;
};

// Handlers connected to Pinia Store
const handleCreateSubject = async () => {
  if (!createForm.name.trim()) {
    showToast("សូមបញ្ចូលឈ្មោះមុខវិជ្ជា។", "warning");
    return;
  }
  try {
    await subjectStore.createSubject({ ...createForm });
    isCreateModalOpen.value = false;
    showToast("បានបន្ថែមមុខវិជ្ជាជោគជ័យ។", "success");
  } catch (error) {
    showToast(
      error.response?.data?.message ||
        error.response?.data?.msg ||
        "មិនអាចបន្ថែមមុខវិជ្ជាបានទេ។",
      "error"
    );
  }
};

const handleUpdateSubject = async () => {
  if (!updateForm.name.trim()) {
    showToast("សូមបញ្ចូលឈ្មោះមុខវិជ្ជា។", "warning");
    return;
  }
  try {
    await subjectStore.updateSubject(updateForm.id, { ...updateForm });
    isUpdateModalOpen.value = false;
    showToast("បានកែប្រែមុខវិជ្ជាជោគជ័យ។", "success");
  } catch (error) {
    showToast(
      error.response?.data?.message ||
        error.response?.data?.msg ||
        "មិនអាចកែប្រែមុខវិជ្ជាបានទេ។",
      "error"
    );
  }
};

const handleDeleteSubject = async () => {
  if (!selectedSubject.value) return;
  try {
    await subjectStore.deleteSubject(selectedSubject.value.id);
    isDeleteModalOpen.value = false;
    showToast("បានលុបមុខវិជ្ជាជោគជ័យ។", "success");
  } catch (error) {
    showToast(
      error.response?.data?.message ||
        error.response?.data?.msg ||
        "មិនអាចលុបមុខវិជ្ជាបានទេ។",
      "error"
    );
  }
};
</script>

<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title">
        <div class="title-icon">📚</div>
        <div>
          <h1>មុខវិជ្ជា</h1>
          <p>គ្រប់គ្រង និងមើលព័ត៌មានមុខវិជ្ជាសិក្សា</p>
        </div>
      </div>

      <BaseButton variant="primary" icon="bi bi-plus-lg" @click="openCreateModal">
        បន្ថែមមុខវិជ្ជា
      </BaseButton>
    </div>

    <!-- Summary Card -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-icon">📚</div>
        <div>
          <p>ចំនួនមុខវិជ្ជា</p>
          <h2>{{ subjectStore.totalSubjects }}</h2>
          <span>មុខវិជ្ជាសរុបក្នុងប្រព័ន្ធ</span>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <section class="table-card">
      <div class="table-header">
        <div>
          <h2>បញ្ជីមុខវិជ្ជា</h2>
          <p>មានមុខវិជ្ជាសរុប {{ filteredSubjects.length }} មុខ</p>
        </div>

        <div class="table-search">
          <span>⌕</span>
          <BaseInput
            v-model="search"
            type="text"
            placeholder="ស្វែងរកមុខវិជ្ជា..."
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="subjectStore.loading" class="loading">
        កំពុងផ្ទុកទិន្នន័យ...
      </div>

      <!-- Error State -->
      <div v-else-if="subjectStore.error" class="error">
        {{ subjectStore.error }}
      </div>

      <!-- Table View -->
      <div v-else class="table-wrapper">
        <BaseTable
          :columns="subjectTableColumns"
          :items="filteredSubjects"
          empty-text="មិនមានទិន្នន័យមុខវិជ្ជាទេ"
        >
          <template #cell-number="{ index }">{{ index + 1 }}</template>
          <template #cell-subject="{ row }">
            <div class="subject-info">
              <div class="subject-avatar">📚</div>
              <div><strong>{{ row.name }}</strong></div>
            </div>
          </template>
          <template #cell-description="{ row }">{{ row.description || "-" }}</template>
          <template #cell-actions="{ row }">
            <div class="actions">
              <BaseButton
                variant="ghost"
                size="sm"
                icon="bi bi-pencil-square"
                icon-only
                icon-tone="edit"
                title="កែប្រែមុខវិជ្ជា"
                :aria-label="`កែប្រែមុខវិជ្ជា ${row.name}`"
                @click="openEditModal(row)"
              />
              <BaseButton
                variant="ghost"
                size="sm"
                icon="bi bi-trash3"
                icon-only
                icon-tone="delete"
                title="លុបមុខវិជ្ជា"
                :aria-label="`លុបមុខវិជ្ជា ${row.name}`"
                @click="openDeleteModal(row)"
              />
            </div>
          </template>
        </BaseTable>
      </div>
    </section>

    <!-- Create Modal -->
    <BaseModal
      :is-open="isCreateModalOpen"
      title="បន្ថែមមុខវិជ្ជា"
      @close="isCreateModalOpen = false"
    >
      <form @submit.prevent="handleCreateSubject" class="modal-form">
        <div class="form-group">
          <label>ឈ្មោះមុខវិជ្ជា</label>
          <BaseInput
            v-model="createForm.name"
            type="text"
            placeholder="ឧ. Web Development"
            required
          />
        </div>

        <div class="form-group">
          <label>ការពិពណ៌នា</label>
          <textarea v-model="createForm.description" rows="3" />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="isCreateModalOpen = false">
          បោះបង់
        </BaseButton>
        <BaseButton variant="primary" @click="handleCreateSubject">
          រក្សាទុក
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Update Modal -->
    <BaseModal
      :is-open="isUpdateModalOpen"
      title="កែប្រែមុខវិជ្ជា"
      @close="isUpdateModalOpen = false"
    >
      <form @submit.prevent="handleUpdateSubject" class="modal-form">
        <div class="form-group">
          <label>ឈ្មោះមុខវិជ្ជា</label>
          <BaseInput v-model="updateForm.name" type="text" required />
        </div>

        <div class="form-group">
          <label>ការពិពណ៌នា</label>
          <textarea v-model="updateForm.description" rows="3" />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="isUpdateModalOpen = false">
          បោះបង់
        </BaseButton>
        <BaseButton variant="primary" @click="handleUpdateSubject">
          បច្ចុប្បន្នភាព
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal
      :is-open="isDeleteModalOpen"
      title="លុបមុខវិជ្ជា"
      @close="isDeleteModalOpen = false"
    >
      <div class="delete-confirm-text">
        <p>តើអ្នកពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ?</p>
        <strong v-if="selectedSubject">{{ selectedSubject.name }}</strong>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">
          បោះបង់
        </BaseButton>
        <BaseButton variant="danger" @click="handleDeleteSubject">
          លុប
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page {
  max-width: 100%;
  box-sizing: border-box;
  padding: 32px 24px;
  font-family: 'Kantumruy Pro', sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: #e0f7ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.page-title h1 {
  margin: 0 0 5px;
  font-size: 28px;
  font-weight: 800;
  color: #183c2b;
}

.page-title p {
  margin: 0;
  color: #8b9992;
  font-size: 13px;
}

.summary-grid {
  display: flex;
  margin-bottom: 34px;
}

.summary-card {
  width: 325px;
  background: white;
  border: 1px solid #e3eee8;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-icon {
  width: 65px;
  height: 65px;
  background: #e3f7ec;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.summary-card p,
.summary-card span,
.table-header p {
  font-size: 13px;
}

.summary-card h2 {
  font-size: 24px;
  font-weight: 800;
}

.table-header h2 {
  font-size: 18px;
  font-weight: 700;
}

.table-card {
  background: white;
  border-radius: 22px;
  border: 1px solid #e1ebe6;
  overflow: hidden;
}

.table-header {
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-search {
  width: 390px;
  height: 56px;
  border: 1px solid #dce7e1;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.table-search input {
  width: 100%;
  border: 0;
  outline: 0;
  margin-left: 12px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

:deep(.base-table) {
  width: 100%;
  border-collapse: collapse;
}

:deep(.base-table thead) {
  background: #f1f8f4;
}

:deep(.base-table th),
:deep(.base-table td) {
  padding: 18px 22px;
  text-align: left;
  border-top: 1px solid #edf2ef;
  font-size: 13px;
}

:deep(.base-table th) {
  font-size: 11px;
  font-weight: 800;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 13px;
}

.subject-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e2f7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code {
  padding: 7px 13px;
  border-radius: 8px;
  background: #eaf8f0;
  color: #149b50;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 7px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dce7e1;
  border-radius: 10px;
  outline: none;
}

@media (max-width: 768px) {
  .page {
    padding: 32px 16px;
  }
}
</style>