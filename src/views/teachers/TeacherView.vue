<script setup>
import { onMounted, reactive, ref } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import BaseModal from "@/components/ui/BaseModal.vue";

const adminStore = useAdminStore();
const isCreateModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const notice = ref({ type: "", text: "" });
const selectedTeacher = ref(null);
const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  status: "active",
});
const editForm = reactive({
  name: "",
  email: "",
  status: "active",
});
const message = ref({ type: "", text: "" });

onMounted(() => {
  adminStore.fetchTeachers();
});

const openCreateModal = () => {
  Object.assign(form, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });
  message.value = { type: "", text: "" };
  isCreateModalOpen.value = true;
};

const openViewModal = async (teacher) => {
  try {
    selectedTeacher.value = await adminStore.getTeacher(teacher.id);
    isViewModalOpen.value = true;
  } catch (error) {
    notice.value = {
      type: "error",
      text: typeof error === "string" ? error : "មិនអាចទាញយកព័ត៌មានគ្រូបានទេ។",
    };
  }
};

const openEditModal = (teacher) => {
  selectedTeacher.value = teacher;
  Object.assign(editForm, {
    name: teacher.name,
    email: teacher.email,
    status: teacher.status,
  });
  message.value = { type: "", text: "" };
  isEditModalOpen.value = true;
};

const updateTeacher = async () => {
  if (!selectedTeacher.value) return;

  try {
    await adminStore.updateTeacher(selectedTeacher.value.id, {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      status: editForm.status,
    });
    isEditModalOpen.value = false;
    notice.value = { type: "success", text: "បានកែប្រែព័ត៌មានគ្រូជោគជ័យ។" };
  } catch (error) {
    message.value = {
      type: "error",
      text: typeof error === "string" ? error : "មិនអាចកែប្រែព័ត៌មានគ្រូបានទេ។",
    };
  }
};

const openDeleteModal = (teacher) => {
  selectedTeacher.value = teacher;
  isDeleteModalOpen.value = true;
};

const deleteTeacher = async () => {
  if (!selectedTeacher.value) return;

  try {
    await adminStore.deleteTeacher(selectedTeacher.value.id);
    isDeleteModalOpen.value = false;
    notice.value = { type: "success", text: "បានលុបគណនីគ្រូជោគជ័យ។" };
    selectedTeacher.value = null;
  } catch (error) {
    notice.value = {
      type: "error",
      text: typeof error === "string" ? error : "មិនអាចលុបគណនីគ្រូបានទេ។",
    };
  }
};

const createTeacher = async () => {
  message.value = { type: "", text: "" };

  if (form.password !== form.confirmPassword) {
    message.value = {
      type: "error",
      text: "ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។",
    };
    return;
  }

  try {
    await adminStore.createTeacher({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      status: form.status,
      role: "teacher",
    });
    isCreateModalOpen.value = false;
    notice.value = {
      type: "success",
      text: "បានបង្កើតគណនីគ្រូជោគជ័យ។",
    };
    await adminStore.fetchTeachers();
  } catch (error) {
    message.value = {
      type: "error",
      text: typeof error === "string" ? error : "មិនអាចបង្កើតគណនីគ្រូបានទេ។",
    };
  }
};
</script>

<template>
  <main class="teacher-page">
    <header class="page-header">
      <div class="heading-icon">
        <i class="bi bi-person-workspace"></i>
      </div>
      <div>
        <h1>គ្រប់គ្រងគ្រូបង្រៀន</h1>
        <p>បញ្ជីគណនីគ្រូបង្រៀន និងស្ថានភាពគណនី។</p>
      </div>
      <button class="create-button" type="button" @click="openCreateModal">
        <i class="bi bi-person-plus-fill"></i>
        បង្កើតគ្រូថ្មី
      </button>
    </header>

    <div v-if="notice.text" class="page-message success" role="status">
      {{ notice.text }}
    </div>

    <section class="teacher-card">
      <div class="table-heading">
        <div>
          <h2>បញ្ជីគ្រូបង្រៀន</h2>
          <p>សរុប {{ adminStore.teachers.length }} គណនី</p>
        </div>
      </div>

      <div v-if="adminStore.error" class="page-message error" role="alert">
        {{ adminStore.error }}
      </div>

      <div class="table-responsive">
        <table class="teacher-table">
          <thead>
            <tr>
              <th>#</th>
              <th>រូបភាព</th>
              <th>ឈ្មោះពេញ</th>
              <th>អ៊ីមែល</th>
              <th>តួនាទី</th>
              <th>ស្ថានភាព</th>
              <th>ថ្ងៃបង្កើត</th>
              <th class="actions-heading">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="adminStore.loading && !adminStore.teachers.length">
              <td colspan="8" class="table-state">កំពុងផ្ទុកបញ្ជីគ្រូ...</td>
            </tr>
            <tr v-else-if="!adminStore.teachers.length">
              <td colspan="8" class="table-state">មិនទាន់មានគ្រូបង្រៀនទេ។</td>
            </tr>
            <tr v-for="(teacher, index) in adminStore.teachers" :key="teacher.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img
                  v-if="teacher.avatar_url"
                  class="teacher-avatar"
                  :src="teacher.avatar_url"
                  :alt="`រូប Profile របស់ ${teacher.name}`"
                  loading="lazy"
                />
                <span v-else class="teacher-avatar-placeholder" aria-label="មិនមានរូប Profile">
                  {{ teacher.name?.trim().charAt(0).toUpperCase() || "T" }}
                </span>
              </td>
              <td class="teacher-name">{{ teacher.name }}</td>
              <td>{{ teacher.email }}</td>
              <td><span class="role-badge">Teacher</span></td>
              <td>
                <span class="status-badge" :class="teacher.status">
                  {{ teacher.status === "active" ? "សកម្ម" : "អសកម្ម" }}
                </span>
              </td>
              <td>{{ teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : "—" }}</td>
              <td>
                <div class="row-actions">
                  <button type="button" class="action-button view-action" title="មើលព័ត៌មាន" aria-label="មើលព័ត៌មានគ្រូ" @click="openViewModal(teacher)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button type="button" class="action-button edit-action" title="កែប្រែ" aria-label="កែប្រែព័ត៌មានគ្រូ" @click="openEditModal(teacher)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button type="button" class="action-button delete-action" title="លុប" aria-label="លុបគ្រូ" @click="openDeleteModal(teacher)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal
      :is-open="isCreateModalOpen"
      title="បង្កើតគណនីគ្រូថ្មី"
      @close="isCreateModalOpen = false"
    >
      <form id="create-teacher-form" class="teacher-form" @submit.prevent="createTeacher">
        <label>
          ឈ្មោះពេញ
          <input v-model="form.name" type="text" autocomplete="name" placeholder="បញ្ចូលឈ្មោះគ្រូ" required />
        </label>
        <label>
          អ៊ីមែល
          <input v-model="form.email" type="email" autocomplete="email" placeholder="teacher@example.com" required />
        </label>
        <label>
          ពាក្យសម្ងាត់
          <input v-model="form.password" type="password" autocomplete="new-password" minlength="6" placeholder="យ៉ាងតិច ៦ តួអក្សរ" required />
        </label>
        <label>
          បញ្ជាក់ពាក្យសម្ងាត់
          <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="6" placeholder="បញ្ចូលពាក្យសម្ងាត់ម្ដងទៀត" required />
        </label>
        <label>
          ស្ថានភាព
          <select v-model="form.status" required>
            <option value="active">សកម្ម (Active)</option>
            <option value="inactive">អសកម្ម (Inactive)</option>
          </select>
        </label>
        <div v-if="message.text" class="form-message" :class="message.type" role="alert">
          {{ message.text }}
        </div>
      </form>
      <template #footer>
        <button class="cancel-button" type="button" @click="isCreateModalOpen = false">បោះបង់</button>
        <button class="create-button modal-submit" type="submit" form="create-teacher-form" :disabled="adminStore.loading">
          <i class="bi bi-person-plus-fill"></i>
          {{ adminStore.loading ? "កំពុងបង្កើត..." : "បង្កើតគណនីគ្រូ" }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isViewModalOpen"
      title="ព័ត៌មានគ្រូបង្រៀន"
      @close="isViewModalOpen = false"
    >
      <div v-if="selectedTeacher" class="teacher-details">
        <img
          v-if="selectedTeacher.avatar_url"
          class="detail-avatar"
          :src="selectedTeacher.avatar_url"
          :alt="`រូប Profile របស់ ${selectedTeacher.name}`"
        />
        <span v-else class="detail-avatar detail-avatar-placeholder">
          {{ selectedTeacher.name?.trim().charAt(0).toUpperCase() || "T" }}
        </span>
        <dl>
          <div><dt>ឈ្មោះពេញ</dt><dd>{{ selectedTeacher.name }}</dd></div>
          <div><dt>អ៊ីមែល</dt><dd>{{ selectedTeacher.email }}</dd></div>
          <div><dt>តួនាទី</dt><dd>Teacher</dd></div>
          <div><dt>ស្ថានភាព</dt><dd>{{ selectedTeacher.status === "active" ? "សកម្ម" : "អសកម្ម" }}</dd></div>
          <div><dt>ថ្ងៃបង្កើត</dt><dd>{{ selectedTeacher.created_at ? new Date(selectedTeacher.created_at).toLocaleString() : "—" }}</dd></div>
        </dl>
      </div>
      <template #footer>
        <button class="cancel-button" type="button" @click="isViewModalOpen = false">បិទ</button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isEditModalOpen"
      title="កែប្រែព័ត៌មានគ្រូ"
      @close="isEditModalOpen = false"
    >
      <form id="edit-teacher-form" class="teacher-form" @submit.prevent="updateTeacher">
        <label>
          ឈ្មោះពេញ
          <input v-model="editForm.name" type="text" autocomplete="name" required />
        </label>
        <label>
          អ៊ីមែល
          <input v-model="editForm.email" type="email" autocomplete="email" required />
        </label>
        <label>
          ស្ថានភាព
          <select v-model="editForm.status" required>
            <option value="active">សកម្ម (Active)</option>
            <option value="inactive">អសកម្ម (Inactive)</option>
          </select>
        </label>
        <div v-if="message.text" class="form-message error" role="alert">{{ message.text }}</div>
      </form>
      <template #footer>
        <button class="cancel-button" type="button" @click="isEditModalOpen = false">បោះបង់</button>
        <button class="create-button modal-submit" type="submit" form="edit-teacher-form" :disabled="adminStore.loading">
          {{ adminStore.loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isDeleteModalOpen"
      title="បញ្ជាក់ការលុបគ្រូ"
      @close="isDeleteModalOpen = false"
    >
      <p class="delete-confirmation">
        តើអ្នកប្រាកដថាចង់លុបគណនីគ្រូ
        <strong>{{ selectedTeacher?.name }}</strong>
        មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
      </p>
      <template #footer>
        <button class="cancel-button" type="button" @click="isDeleteModalOpen = false">បោះបង់</button>
        <button class="delete-confirm-button" type="button" :disabled="adminStore.loading" @click="deleteTeacher">
          {{ adminStore.loading ? "កំពុងលុប..." : "លុបគ្រូ" }}
        </button>
      </template>
    </BaseModal>
  </main>
</template>

<style scoped>
.teacher-page {
  min-height: calc(100vh - 70px);
  padding: 32px 24px;
  color: #172b23;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.page-header > div:nth-child(2) {
  flex: 1;
}

.heading-icon {
  display: grid;
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  place-items: center;
  border-radius: 16px;
  background: #e8f6ed;
  color: #16834b;
  font-size: 24px;
}

.page-header h1,
.card-heading h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.page-header p,
.card-heading p {
  margin: 5px 0 0;
  color: #738078;
  font-size: 14px;
}

.teacher-card {
  width: 100%;
  border: 1px solid #e2ebe6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgb(21 54 37 / 5%);
  overflow: hidden;
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #edf1ee;
}

.table-heading h2 {
  margin: 0;
  font-size: 18px;
}

.table-heading p {
  margin: 4px 0 0;
  color: #738078;
  font-size: 13px;
}

.table-responsive {
  overflow-x: auto;
}

.teacher-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

.teacher-table th,
.teacher-table td {
  padding: 16px 22px;
  border-bottom: 1px solid #edf1ee;
  font-size: 14px;
}

.teacher-table th {
  color: #718078;
  font-size: 12px;
  font-weight: 700;
}

.actions-heading {
  text-align: center;
}

.row-actions {
  display: flex;
  justify-content: center;
  gap: 7px;
}

.action-button {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid #e1e9e4;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.action-button:hover {
  background: #f5f9f6;
}

.view-action {
  color: #2563eb;
}

.edit-action {
  color: #16834b;
}

.delete-action {
  color: #dc2626;
}

.teacher-name {
  color: #243b2e;
  font-weight: 600;
}

.teacher-avatar,
.teacher-avatar-placeholder {
  display: inline-grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
}

.teacher-avatar {
  object-fit: cover;
}

.teacher-avatar-placeholder {
  background: #e8f6ed;
  color: #16834b;
  font-size: 15px;
  font-weight: 700;
}

.role-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge {
  background: #eff6ff;
  color: #2563eb;
}

.status-badge.active {
  background: #e8f6ed;
  color: #16834b;
}

.status-badge.inactive {
  background: #f1f3f2;
  color: #64716a;
}

.table-state {
  padding: 36px !important;
  color: #738078;
  text-align: center;
}

.page-message {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 9px;
  font-size: 14px;
}

.page-message.success {
  background: #e8f6ed;
  color: #166534;
}

.page-message.error {
  background: #fef2f2;
  color: #b91c1c;
}

.create-button,
.cancel-button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.create-button {
  background: #16834b;
  color: #fff;
}

.create-button:hover:not(:disabled) {
  background: #11683b;
}

.cancel-button {
  border: 1px solid #dfe8e3;
  background: #fff;
  color: #52625a;
}

.modal-submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.teacher-form {
  display: grid;
  gap: 14px;
  padding-top: 8px;
}

.teacher-form label {
  display: grid;
  gap: 8px;
  color: #35483d;
  font-size: 14px;
  font-weight: 600;
}

.teacher-form input,
.teacher-form select {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #d9e4dd;
  border-radius: 10px;
  outline: none;
  background: #fbfdfb;
  color: #172b23;
  font: inherit;
  font-weight: 400;
}

.teacher-form input:focus {
  border-color: #16834b;
  box-shadow: 0 0 0 3px rgb(22 131 75 / 10%);
}

.teacher-form select:focus {
  border-color: #16834b;
  box-shadow: 0 0 0 3px rgb(22 131 75 / 10%);
}

.form-message {
  padding: 12px 14px;
  border-radius: 9px;
  font-size: 14px;
}

.form-message.success {
  background: #e8f6ed;
  color: #166534;
}

.form-message.error {
  background: #fef2f2;
  color: #b91c1c;
}

.teacher-details {
  display: grid;
  justify-items: center;
  gap: 20px;
  padding: 12px 0;
}

.detail-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
}

.detail-avatar-placeholder {
  display: grid;
  place-items: center;
  background: #e8f6ed;
  color: #16834b;
  font-size: 28px;
  font-weight: 700;
}

.teacher-details dl {
  display: grid;
  width: 100%;
  gap: 12px;
  margin: 0;
}

.teacher-details dl > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1ee;
}

.teacher-details dt {
  color: #738078;
}

.teacher-details dd {
  margin: 0;
  color: #243b2e;
  font-weight: 600;
  text-align: right;
}

.delete-confirmation {
  color: #52625a;
  line-height: 1.7;
}

.delete-confirmation strong {
  color: #243b2e;
}

.delete-confirm-button {
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: #dc2626;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.delete-confirm-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .teacher-page {
    padding: 24px 16px;
  }

  .page-header {
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .create-button {
    width: 100%;
  }

  .table-heading {
    padding: 20px;
  }

  .teacher-table th,
  .teacher-table td {
    padding: 14px 16px;
  }
}
</style>
