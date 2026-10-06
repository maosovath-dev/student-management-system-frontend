<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import { useStudentStore } from "../../stores/student.store";
import { useClassStore } from "../../stores/classe.store";
import BaseModal from "@/components/ui/BaseModal.vue";

const studentStore = useStudentStore();
const classStore = useClassStore();

// Filter & Search
const search = ref("");
const selectedClassFilter = ref("");

// Modal Visibility States
const isInviteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isViewModalOpen = ref(false);
const inviteAvatarInput = ref(null);
const inviteAvatarFile = ref(null);
const inviteAvatarPreview = ref("");
const editAvatarInput = ref(null);
const editAvatarFile = ref(null);
const editAvatarPreview = ref("");
const removeEditAvatar = ref(false);

const inviteForm = reactive({
  student_code: "",
  first_name: "",
  last_name: "",
  gender: "female",
  date_of_birth: "",
  phone: "",
  address: "",
  class_id: "",
});

// 2. Edit Form State
const editForm = reactive({
  id: null,
  student_code: "",
  first_name: "",
  last_name: "",
  gender: "female",
  date_of_birth: "",
  phone: "",
  address: "",
  class_id: "",
});

const selectedStudent = ref(null);

const getStudentName = (student) =>
  student?.name ||
  `${student?.first_name || ""} ${student?.last_name || ""}`.trim() ||
  "គ្មានឈ្មោះ";

const getGenderLabel = (gender) => {
  if (gender === "female" || gender === "F") return "ស្រី";
  if (gender === "male" || gender === "M") return "ប្រុស";
  return "មិនបានបញ្ជាក់";
};

const clearInviteAvatar = () => {
  if (inviteAvatarPreview.value) {
    URL.revokeObjectURL(inviteAvatarPreview.value);
  }
  inviteAvatarFile.value = null;
  inviteAvatarPreview.value = "";
  if (inviteAvatarInput.value) {
    inviteAvatarInput.value.value = "";
  }
};

const handleInviteAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("សូមជ្រើសរើសឯកសាររូបភាព។");
    event.target.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("ទំហំរូបភាពមិនអាចលើស 2MB បានទេ។");
    event.target.value = "";
    return;
  }

  clearInviteAvatar();
  inviteAvatarFile.value = file;
  inviteAvatarPreview.value = URL.createObjectURL(file);
};

const closeInviteModal = () => {
  isInviteModalOpen.value = false;
  clearInviteAvatar();
};

const clearEditAvatar = () => {
  if (editAvatarPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(editAvatarPreview.value);
  }
  editAvatarFile.value = null;
  editAvatarPreview.value = "";
  removeEditAvatar.value = false;
  if (editAvatarInput.value) {
    editAvatarInput.value.value = "";
  }
};

const handleEditAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("សូមជ្រើសរើសឯកសាររូបភាព។");
    event.target.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("ទំហំរូបភាពមិនអាចលើស 2MB បានទេ។");
    event.target.value = "";
    return;
  }

  if (editAvatarPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(editAvatarPreview.value);
  }
  editAvatarFile.value = file;
  editAvatarPreview.value = URL.createObjectURL(file);
  removeEditAvatar.value = false;
};

const removeCurrentEditAvatar = () => {
  if (editAvatarPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(editAvatarPreview.value);
  }
  editAvatarFile.value = null;
  editAvatarPreview.value = "";
  removeEditAvatar.value = true;
  if (editAvatarInput.value) {
    editAvatarInput.value.value = "";
  }
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  clearEditAvatar();
};

onMounted(() => {
  studentStore.fetchStudents();
  classStore.fetchClasses();
});

onUnmounted(() => {
  clearInviteAvatar();
  clearEditAvatar();
});

// Helper ទាញយកឈ្មោះថ្នាក់រៀន
const getClassName = (classId) => {
  if (!classId) return "មិនទាន់មានថ្នាក់";
  const found = classStore.classes.find((c) => Number(c.id) === Number(classId));
  return found ? (found.name || found.class_name) : `ថ្នាក់ #${classId}`;
};

// Filtered & Sorted Students List (តម្រៀបឱ្យទិន្នន័យថ្មីនៅខាងក្រោមគេ)
const filteredStudents = computed(() => {
  const list = studentStore.students.filter((student) => {
    const fullName = (student.name || `${student.first_name || ""} ${student.last_name || ""}`).toLowerCase();
    const code = String(student.student_code || "").toLowerCase();
    const keyword = search.value.toLowerCase();

    const matchesSearch = fullName.includes(keyword) || code.includes(keyword);
    const matchesClass = selectedClassFilter.value
      ? Number(student.class_id) === Number(selectedClassFilter.value)
      : true;

    return matchesSearch && matchesClass;
  });

  // តម្រៀបតាម ID ឬ Index ពីចាស់ទៅថ្មី (ទិន្នន័យថ្មីនៅខាងក្រោមគេ)
  return list.sort((a, b) => Number(a.id) - Number(b.id));
});

// Actions សម្រាប់បើក Modals
const openInviteModal = () => {
  Object.assign(inviteForm, {
    student_code: "",
    first_name: "",
    last_name: "",
    gender: "female",
    date_of_birth: "",
    phone: "",
    address: "",
    class_id: "",
  });
  isInviteModalOpen.value = true;
};

const openEditModal = (student) => {
  clearEditAvatar();
  editForm.id = student.id;
  editForm.student_code = student.student_code || "";
  const nameParts = String(student.name || "").trim().split(/\s+/);
  editForm.first_name = student.first_name || nameParts.shift() || "";
  editForm.last_name = student.last_name || nameParts.join(" ");
  editForm.gender = student.gender || "female";
  editForm.date_of_birth = String(student.date_of_birth || "").slice(0, 10);
  editForm.phone = student.phone || "";
  editForm.address = student.address || "";
  editForm.class_id = student.class_id || "";
  editAvatarPreview.value = student.avatar_url || "";

  isEditModalOpen.value = true;
};

const openDeleteModal = (student) => {
  selectedStudent.value = student;
  isDeleteModalOpen.value = true;
};

const openViewModal = (student) => {
  selectedStudent.value = student;
  isViewModalOpen.value = true;
};

// Create a student record; student records do not have login accounts.
const handleInviteStudent = async () => {
  try {
    const formData = new FormData();
    formData.append("student_code", inviteForm.student_code.trim());
    formData.append("first_name", inviteForm.first_name.trim());
    formData.append("last_name", inviteForm.last_name.trim());
    formData.append("gender", inviteForm.gender);
    formData.append("date_of_birth", inviteForm.date_of_birth || "");
    formData.append("phone", inviteForm.phone.trim());
    formData.append("address", inviteForm.address.trim());
    formData.append("class_id", inviteForm.class_id || "");
    if (inviteAvatarFile.value) {
      formData.append("avatar", inviteAvatarFile.value);
    }

    await studentStore.createStudent(formData);

    clearInviteAvatar();

    alert("បានបង្កើតសិស្សជោគជ័យ!");
    isInviteModalOpen.value = false;
  } catch (err) {
    alert("មានបញ្ហា៖ " + err);
  }
};

// 2. Submit Update Student Profile
const handleUpdateStudent = async () => {
  try {
    const formData = new FormData();
    formData.append("student_code", editForm.student_code.trim());
    formData.append("first_name", editForm.first_name.trim());
    formData.append("last_name", editForm.last_name.trim());
    formData.append("gender", editForm.gender);
    formData.append("date_of_birth", editForm.date_of_birth || "");
    formData.append("phone", editForm.phone.trim());
    formData.append("address", editForm.address.trim());
    formData.append("class_id", editForm.class_id || "");
    if (editAvatarFile.value) {
      formData.append("avatar", editAvatarFile.value);
    }
    if (removeEditAvatar.value) {
      formData.append("remove_avatar", "true");
    }

    await studentStore.updateStudent(editForm.id, formData);

    alert("បានបច្ចុប្បន្នភាពព័ត៌មានសិស្សជោគជ័យ!");
    closeEditModal();
  } catch (err) {
    alert("មានបញ្ហា៖ " + err);
  }
};

// 3. Submit Delete Student
const handleDeleteStudent = async () => {
  if (!selectedStudent.value) return;
  try {
    await studentStore.deleteStudent(selectedStudent.value.id);
    studentStore.students = studentStore.students.filter(s => s.id !== selectedStudent.value.id);
    isDeleteModalOpen.value = false;
    selectedStudent.value = null;
  } catch (err) {
    alert("មានបញ្ហាពេលលុប៖ " + err);
  }
};
</script>

<template>
  <div class="page-container">
    <!-- Header Page -->
    <div class="page-header">
      <div class="title-section">
        <div class="icon-box">👨‍🎓</div>
        <div>
          <h2>គ្រប់គ្រងសិស្ស</h2>
          <p class="subtitle">គ្រប់គ្រងទិន្នន័យសិស្ស និងចាត់ថ្នាក់រៀន</p>
        </div>
      </div>

      <button class="btn-primary" @click="openInviteModal">
        <span class="plus-icon">＋</span> បន្ថែមសិស្សថ្មី
      </button>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card">
      <div class="toolbar">
        <div class="filter-group">
          <select v-model="selectedClassFilter" class="select-input">
            <option value="">-- បង្ហាញគ្រប់ថ្នាក់រៀន --</option>
            <option v-for="c in classStore.classes" :key="c.id" :value="c.id">
              {{ c.name || c.class_name }}
            </option>
          </select>

          <span class="total-badge">
            សរុប៖ <strong>{{ filteredStudents.length }}</strong> នាក់
          </span>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="search"
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ ឬកូដសិស្ស..."
          />
        </div>
      </div>

      <!-- State Loading & Error -->
      <div v-if="studentStore.loading" class="state-msg">កំពុងផ្ទុកទិន្នន័យ...</div>
      <div v-else-if="studentStore.error" class="state-msg error">{{ studentStore.error }}</div>

      <!-- Data Table -->
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ឈ្មោះសិស្ស</th>
              <th>កូដសិស្ស</th>
              <th>ភេទ</th>
              <th>ថ្នាក់រៀន</th>
              <th class="text-center">សកម្មភាព</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in filteredStudents" :key="item.id || index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="student-profile">
                  <img
                    v-if="item.avatar_url"
                    class="avatar avatar-image"
                    :src="item.avatar_url"
                    :alt="`រូប Profile របស់ ${getStudentName(item)}`"
                  />
                  <div v-else class="avatar avatar-placeholder" aria-hidden="true">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <strong>{{ item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'គ្មានឈ្មោះ' }}</strong>
                </div>
              </td>
              <td><span class="code-tag">{{ item.student_code || '---' }}</span></td>
              <td>
                {{
                  item.gender === 'female' || item.gender === 'F'
                    ? 'ស្រី'
                    : (item.gender === 'male' || item.gender === 'M' ? 'ប្រុស' : '---')
                }}
              </td>
              <td>
                <span :class="['class-tag', item.class_id ? 'has-class' : 'no-class']">
                  {{ getClassName(item.class_id) }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button
                    class="btn-icon view"
                    type="button"
                    title="មើលព័ត៌មានសិស្ស"
                    :aria-label="`មើលព័ត៌មាន ${getStudentName(item)}`"
                    @click="openViewModal(item)"
                  >
                    <i class="bi bi-eye" aria-hidden="true"></i>
                  </button>
                  <button
                    class="btn-icon edit"
                    type="button"
                    title="កែប្រែ / ចាត់ថ្នាក់"
                    :aria-label="`កែប្រែ ${getStudentName(item)}`"
                    @click="openEditModal(item)"
                  >
                    <i class="bi bi-pencil-square" aria-hidden="true"></i>
                  </button>
                  <button
                    class="btn-icon delete"
                    type="button"
                    title="លុបសិស្ស"
                    :aria-label="`លុប ${getStudentName(item)}`"
                    @click="openDeleteModal(item)"
                  >
                    <i class="bi bi-trash3" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredStudents.length === 0">
              <td colspan="6" class="state-msg">មិនមានទិន្នន័យសិស្សឡើយ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Student Details -->
    <BaseModal
      :is-open="isViewModalOpen"
      wide
      title="ព័ត៌មានលម្អិតសិស្ស"
      @close="isViewModalOpen = false"
    >
      <div v-if="selectedStudent" class="student-details">
        <div class="student-details-header">
          <div
            v-if="selectedStudent.avatar_url"
            class="student-details-avatar"
          >
            <img
              :src="selectedStudent.avatar_url"
              :alt="`រូប Profile របស់ ${getStudentName(selectedStudent)}`"
            />
          </div>
          <div
            v-else
            class="student-details-avatar student-details-avatar-placeholder"
            aria-hidden="true"
          >
            <i class="bi bi-person-fill"></i>
          </div>
          <div class="student-details-identity">
            <span class="student-details-eyebrow">ប្រវត្តិរូបសិស្ស</span>
            <h4>{{ getStudentName(selectedStudent) }}</h4>
            <div class="student-details-tags">
              <span class="student-details-code">
                <i class="bi bi-upc-scan" aria-hidden="true"></i>
                {{ selectedStudent.student_code || "---" }}
              </span>
              <span
                :class="['student-details-class', selectedStudent.class_id ? 'has-class' : 'no-class']"
              >
                <i class="bi bi-mortarboard" aria-hidden="true"></i>
                {{ getClassName(selectedStudent.class_id) }}
              </span>
            </div>
          </div>
        </div>
        <div class="student-details-grid">
          <section class="student-details-section">
            <h5><i class="bi bi-person-vcard" aria-hidden="true"></i> ព័ត៌មានផ្ទាល់ខ្លួន</h5>
            <dl class="student-details-list">
              <div>
                <dt>ភេទ</dt>
                <dd>{{ getGenderLabel(selectedStudent.gender) }}</dd>
              </div>
              <div>
                <dt>ថ្ងៃខែឆ្នាំកំណើត</dt>
                <dd>{{ selectedStudent.date_of_birth || "មិនបានបញ្ជាក់" }}</dd>
              </div>
            </dl>
          </section>
          <section class="student-details-section">
            <h5><i class="bi bi-telephone" aria-hidden="true"></i> ព័ត៌មានទំនាក់ទំនង</h5>
            <dl class="student-details-list">
              <div>
                <dt>លេខទូរស័ព្ទ</dt>
                <dd>{{ selectedStudent.phone || "មិនបានបញ្ជាក់" }}</dd>
              </div>
              <div>
                <dt>អាសយដ្ឋាន</dt>
                <dd>{{ selectedStudent.address || "មិនបានបញ្ជាក់" }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
      <template #footer>
        <button type="button" class="btn-secondary" @click="isViewModalOpen = false">
          បិទ
        </button>
        <button
          v-if="selectedStudent"
          type="button"
          class="btn-primary"
          @click="isViewModalOpen = false; openEditModal(selectedStudent)"
        >
          <i class="bi bi-pencil-square" aria-hidden="true"></i>
          កែប្រែព័ត៌មាន
        </button>
      </template>
    </BaseModal>

    <!-- Modal 1: Create Student -->
    <BaseModal
      :is-open="isInviteModalOpen"
      wide
      title="បន្ថែមសិស្សថ្មី"
      @close="closeInviteModal"
    >
      <form id="invite-student-form" @submit.prevent="handleInviteStudent" class="modal-form create-student-form">
        <p class="create-student-intro">បំពេញព័ត៌មានខាងក្រោម ដើម្បីបញ្ចូលសិស្សថ្មីទៅក្នុងប្រព័ន្ធ។</p>

        <section class="create-student-section create-student-avatar-section" aria-labelledby="student-avatar-heading">
          <h4 id="student-avatar-heading">រូប Profile សិស្ស</h4>
          <div class="student-avatar-upload">
            <div class="student-avatar-preview">
              <img
                v-if="inviteAvatarPreview"
                :src="inviteAvatarPreview"
                alt="រូប Profile ដែលបានជ្រើស"
              />
              <i v-else class="bi bi-person-fill" aria-hidden="true"></i>
            </div>
            <div class="student-avatar-controls">
              <label for="new-student-avatar">ជ្រើសរើសរូបភាព</label>
              <input
                ref="inviteAvatarInput"
                id="new-student-avatar"
                type="file"
                accept="image/*"
                @change="handleInviteAvatarChange"
              />
              <small>ឯកសាររូបភាព មិនលើស 2MB (ជាជម្រើស)</small>
              <button
                v-if="inviteAvatarPreview"
                type="button"
                class="remove-avatar-btn"
                @click="clearInviteAvatar"
              >
                ដករូបចេញ
              </button>
            </div>
          </div>
        </section>

        <section class="create-student-section" aria-labelledby="student-basic-heading">
          <h4 id="student-basic-heading">ព័ត៌មានសិស្ស</h4>
          <div class="form-row">
            <div class="form-group">
              <label>ឈ្មោះ (First name) <span class="required">*</span></label>
              <input v-model="inviteForm.first_name" type="text" autocomplete="given-name" placeholder="បញ្ចូលឈ្មោះ" required />
            </div>
            <div class="form-group">
              <label>នាមត្រកូល (Last name) <span class="required">*</span></label>
              <input v-model="inviteForm.last_name" type="text" autocomplete="family-name" placeholder="បញ្ចូលនាមត្រកូល" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>កូដសិស្ស (Student Code) <span class="required">*</span></label>
              <input v-model="inviteForm.student_code" type="text" autocomplete="off" placeholder="ឧ. STD001" required />
            </div>
            <div class="form-group">
              <label>ភេទ <span class="required">*</span></label>
              <select v-model="inviteForm.gender" class="select-input" required>
                <option value="female">ស្រី (Female)</option>
                <option value="male">ប្រុស (Male)</option>
              </select>
            </div>
          </div>
        </section>

        <section class="create-student-section" aria-labelledby="student-enrollment-heading">
          <h4 id="student-enrollment-heading">ព័ត៌មានចុះឈ្មោះ</h4>
          <div class="form-row">
            <div class="form-group">
              <label>ថ្នាក់រៀន</label>
              <select v-model="inviteForm.class_id" class="select-input">
                <option value="">-- ជ្រើសរើសថ្នាក់រៀន --</option>
                <option v-for="c in classStore.classes" :key="c.id" :value="c.id">
                  {{ c.name || c.class_name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>ថ្ងៃខែឆ្នាំកំណើត</label>
              <input v-model="inviteForm.date_of_birth" type="date" autocomplete="bday" />
            </div>
          </div>
        </section>

        <section class="create-student-section" aria-labelledby="student-contact-heading">
          <h4 id="student-contact-heading">ព័ត៌មានទំនាក់ទំនង</h4>
          <div class="form-row">
            <div class="form-group">
              <label>លេខទូរស័ព្ទ</label>
              <input v-model="inviteForm.phone" type="tel" autocomplete="tel" placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
            </div>
            <div class="form-group">
              <label>អាសយដ្ឋាន</label>
              <input v-model="inviteForm.address" type="text" autocomplete="street-address" placeholder="បញ្ចូលអាសយដ្ឋាន" />
            </div>
          </div>
        </section>
      </form>

      <template #footer>
        <button type="button" class="btn-secondary" :disabled="studentStore.loading" @click="closeInviteModal">បោះបង់</button>
        <button
          type="submit"
          form="invite-student-form"
          class="btn-primary"
          :disabled="studentStore.loading"
        >
          {{ studentStore.loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
        </button>
      </template>
    </BaseModal>

    <!-- Modal 2: Edit / Assign Student Profile -->
    <BaseModal
      :is-open="isEditModalOpen"
      wide
      title="កែប្រែ / បញ្ចូលព័ត៌មានសិស្ស"
      @close="closeEditModal"
    >
      <form id="edit-student-form" @submit.prevent="handleUpdateStudent" class="modal-form">
        <section class="create-student-section create-student-avatar-section" aria-labelledby="edit-student-avatar-heading">
          <h4 id="edit-student-avatar-heading">រូប Profile សិស្ស</h4>
          <div class="student-avatar-upload">
            <div class="student-avatar-preview">
              <img
                v-if="editAvatarPreview"
                :src="editAvatarPreview"
                alt="រូប Profile សិស្ស"
              />
              <i v-else class="bi bi-person-fill" aria-hidden="true"></i>
            </div>
            <div class="student-avatar-controls">
              <label for="edit-student-avatar">ជ្រើសរើសរូបភាពថ្មី</label>
              <input
                id="edit-student-avatar"
                ref="editAvatarInput"
                type="file"
                accept="image/*"
                @change="handleEditAvatarChange"
              />
              <small>ឯកសាររូបភាព មិនលើស 2MB</small>
              <button
                v-if="editAvatarPreview"
                type="button"
                class="remove-avatar-btn"
                @click="removeCurrentEditAvatar"
              >
                ដករូបចេញ
              </button>
            </div>
          </div>
        </section>

        <div class="form-row">
          <div class="form-group">
            <label>នាមត្រកូល (Last name) <span class="required">*</span></label>
            <input v-model="editForm.last_name" type="text" required />
          </div>
          <div class="form-group">
            <label>ឈ្មោះ (First name) <span class="required">*</span></label>
            <input v-model="editForm.first_name" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>កូដសិស្ស (Student Code) <span class="required">*</span></label>
            <input v-model="editForm.student_code" type="text" placeholder="ឧ. STD001" required />
          </div>
          <div class="form-group">
            <label>ថ្នាក់រៀន (Assign Class)</label>
            <select v-model="editForm.class_id" class="select-input">
              <option value="">-- ជ្រើសរើសថ្នាក់រៀន --</option>
              <option v-for="c in classStore.classes" :key="c.id" :value="c.id">
                {{ c.name || c.class_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>ភេទ</label>
            <select v-model="editForm.gender" class="select-input">
              <option value="female">ស្រី (Female)</option>
              <option value="male">ប្រុស (Male)</option>
            </select>
          </div>
          <div class="form-group">
            <label>លេខទូរស័ព្ទ</label>
            <input v-model="editForm.phone" type="text" placeholder="ឧ. 015241180" />
          </div>
        </div>

        <div class="form-group">
          <label>ថ្ងៃខែឆ្នាំកំណើត</label>
          <input v-model="editForm.date_of_birth" type="date" />
        </div>

        <div class="form-group">
          <label>អាសយដ្ឋាន</label>
          <input v-model="editForm.address" type="text" placeholder="ឧ. Phnom Penh" />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn-secondary" :disabled="studentStore.loading" @click="closeEditModal">បោះបង់</button>
        <button type="submit" form="edit-student-form" class="btn-primary" :disabled="studentStore.loading">
          {{ studentStore.loading ? "កំពុងរក្សាទុក..." : "រក្សាទុកការផ្លាស់ប្តូរ" }}
        </button>
      </template>
    </BaseModal>

    <!-- Modal 3: Delete Student -->
    <BaseModal
      :is-open="isDeleteModalOpen"
      title="លុបសិស្ស"
      @close="isDeleteModalOpen = false"
    >
      <div class="delete-body">
        <p>តើអ្នកពិតជាចង់លុបសិស្សនេះចេញពីប្រព័ន្ធមែនទេ?</p>
        <div v-if="selectedStudent" class="delete-info">
          <strong>{{ selectedStudent.name || `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}` }}</strong>
          <span v-if="selectedStudent.student_code">({{ selectedStudent.student_code }})</span>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn-secondary" @click="isDeleteModalOpen = false">បោះបង់</button>
        <button type="button" class="btn-danger" @click="handleDeleteStudent">លុបចេញ</button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-container { box-sizing: border-box; width: 100%; padding: 28px 24px; font-family: 'Kantumruy Pro', sans-serif; color: #2c3e50; }
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px; }
.title-section { display: flex; align-items: center; gap: 14px; }
.icon-box { font-size: 32px; background: #e8f5e9; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.page-header h2 { margin: 0; font-size: 22px; }
.subtitle { margin: 4px 0 0; color: #7f8c8d; font-size: 13px; }

.card { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 6px 20px rgba(23, 70, 49, 0.04); overflow: hidden; }
.toolbar { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; gap: 14px; border-bottom: 1px solid #edf2f7; }
.filter-group { display: flex; align-items: center; gap: 14px; }
.total-badge { font-size: 14px; color: #64748b; }

.search-box { display: flex; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 12px; width: 260px; }
.search-box:focus-within { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12); }
.search-box input { box-sizing: border-box; border: 0; background: transparent; padding: 10px 8px; width: 100%; min-width: 0; outline: none; }

.table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table { width: 100%; min-width: 700px; border-collapse: collapse; text-align: left; }
.data-table th { background: #f8fafc; padding: 14px 18px; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 14px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.data-table tbody tr:hover { background: #fbfefc; }

.student-profile { display: flex; align-items: center; gap: 10px; }
.avatar { font-size: 20px; }
.avatar-placeholder { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: #e5e7eb; color: #707579; font-size: 22px; }
.avatar-image { display: block; width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.code-tag { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: 600; color: #475569; }

.class-tag { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.class-tag.has-class { background: #e0f2fe; color: #0369a1; }
.class-tag.no-class { background: #f3f4f6; color: #9ca3af; }

.action-buttons { display: flex; justify-content: center; gap: 6px; }
.btn-icon { display: inline-grid; place-items: center; background: #f8fafc; border: 1px solid #e2e8f0; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 15px; }
.btn-icon.view { color: #2563a6; background: #f1f7fd; border-color: #dbeafe; }
.btn-icon.edit { color: #16834b; background: #f0f9f3; border-color: #dcfce7; }
.btn-icon.delete { color: #c24145; background: #fff5f5; border-color: #fee2e2; }
.btn-icon.view:hover { background: #e2effc; }
.btn-icon.edit:hover { background: #dcfce7; }
.btn-icon.delete:hover { background: #fee2e2; }

.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 7px; background: #16a34a; color: white; border: 0; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #15803d; }
.btn-secondary { background: #e2e8f0; color: #475569; border: 0; padding: 10px 18px; border-radius: 10px; cursor: pointer; }
.btn-danger { background: #dc2626; color: white; border: 0; padding: 10px 18px; border-radius: 10px; cursor: pointer; }

.modal-form { display: flex; flex-direction: column; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.form-row { display: flex; gap: 12px; }
.select-input, .form-group input { padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; }
.required { color: #dc2626; }
.hint-text { font-size: 11px; color: #64748b; }

.create-student-form { gap: 16px; }
.create-student-intro { margin: 0; color: #64748b; font-size: 13px; }
.create-student-section { padding: 15px; border: 1px solid #e7eee9; border-radius: 12px; background: #fbfdfb; }
.create-student-section h4 { margin: 0 0 12px; color: #276749; font-size: 14px; font-weight: 700; }
.student-avatar-upload { display: flex; align-items: center; gap: 16px; }
.student-avatar-preview { display: grid; place-items: center; flex: 0 0 auto; width: 76px; height: 76px; overflow: hidden; border: 1px dashed #b8c9bd; border-radius: 50%; background: #e5e7eb; color: #707579; font-size: 42px; }
.student-avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
.student-avatar-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.student-avatar-controls label { color: #334155; font-size: 12px; font-weight: 600; }
.student-avatar-controls input { max-width: 100%; color: #64748b; font: inherit; font-size: 12px; }
.student-avatar-controls small { color: #64748b; font-size: 11px; }
.remove-avatar-btn { padding: 0; border: 0; background: none; color: #b4232d; cursor: pointer; font: inherit; font-size: 12px; }
.create-student-section .form-row + .form-row { margin-top: 12px; }
.create-student-form .form-group { gap: 6px; }
.create-student-form .form-group label { color: #334155; font-size: 12px; font-weight: 600; }
.create-student-form .form-group input,
.create-student-form .form-group select { box-sizing: border-box; width: 100%; min-width: 0; padding: 10px 12px; border: 1px solid #d5dfd8; border-radius: 8px; background: #fff; color: #26382e; font: inherit; font-size: 13px; transition: border-color 0.2s, box-shadow 0.2s; }
.create-student-form .form-group input:focus,
.create-student-form .form-group select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgb(22 163 74 / 12%); outline: none; }
.create-student-form .form-group input::placeholder { color: #9aa89f; }
.create-student-form .required { margin-left: 2px; }
.btn-secondary:disabled,
.btn-primary:disabled { cursor: not-allowed; opacity: 0.65; }

.state-msg { padding: 30px; text-align: center; color: #64748b; }
.state-msg.error { color: #dc2626; }
.text-center { text-align: center; }
.delete-body { display: flex; flex-direction: column; gap: 12px; }
.delete-info { background: #fef2f2; padding: 12px; border-radius: 8px; text-align: center; color: #991b1b; display: flex; gap: 6px; justify-content: center; }

.student-details-header { display: flex; align-items: center; gap: 16px; padding: 6px 0 20px; border-bottom: 1px solid #edf2f7; }
.student-details-avatar { display: grid; place-items: center; flex: 0 0 auto; width: 68px; height: 68px; border: 5px solid #fff; border-radius: 22px; box-shadow: 0 4px 14px rgb(31 75 49 / 10%); font-size: 32px; }
.student-details-avatar-placeholder { background: #e5e7eb; color: #707579; }
.student-details-avatar img { width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
.student-details-identity { min-width: 0; }
.student-details-eyebrow { display: block; margin-bottom: 4px; color: #75847a; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
.student-details-header h4 { margin: 0 0 9px; color: #26382e; font-size: 20px; font-weight: 700; overflow-wrap: anywhere; }
.student-details-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.student-details-code,
.student-details-class { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 5px 9px; border-radius: 7px; font-size: 11px; font-weight: 600; overflow-wrap: anywhere; }
.student-details-code { background: #f1f5f9; color: #475569; font-family: monospace; }
.student-details-class.has-class { background: #e0f2fe; color: #0369a1; }
.student-details-class.no-class { background: #f3f4f6; color: #64748b; }
.student-details-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 16px; }
.student-details-section { min-width: 0; padding: 14px; border: 1px solid #e8efe9; border-radius: 12px; background: #fbfdfb; }
.student-details-section h5 { display: flex; align-items: center; gap: 8px; margin: 0; color: #276749; font-size: 13px; font-weight: 700; }
.student-details-section h5 i { font-size: 15px; }
.student-details-list { display: grid; gap: 0; margin: 8px 0 0; }
.student-details-list > div { display: grid; grid-template-columns: minmax(95px, 0.8fr) minmax(0, 1.2fr); gap: 10px; padding: 10px 0; border-bottom: 1px solid #edf2ef; }
.student-details-list > div:last-child { border-bottom: 0; }
.student-details-list dt { color: #7b8981; font-size: 11px; }
.student-details-list dd { margin: 0; color: #35483d; font-size: 12px; font-weight: 600; text-align: right; overflow-wrap: anywhere; }

@media (max-width: 760px) {
  .page-container { padding: 20px 14px; }
  .page-header { align-items: flex-start; flex-direction: column; }
  .page-header > .btn-primary { width: 100%; }
  .toolbar { align-items: stretch; flex-direction: column; padding: 14px; }
  .filter-group { justify-content: space-between; flex-wrap: wrap; }
  .search-box { box-sizing: border-box; width: 100%; }
}

@media (max-width: 480px) {
  .page-container { padding: 16px 10px; }
  .icon-box { width: 46px; height: 46px; border-radius: 12px; font-size: 26px; }
  .page-header h2 { font-size: 19px; }
  .subtitle { font-size: 12px; }
  .data-table th, .data-table td { padding: 12px; }
  .student-details-header { align-items: flex-start; gap: 12px; }
  .student-details-avatar { width: 54px; height: 54px; border-radius: 17px; font-size: 26px; }
  .student-details-header h4 { font-size: 17px; }
  .student-details-grid { grid-template-columns: 1fr; gap: 10px; }
  .student-details-section { padding: 12px; }
  .student-details-list > div { grid-template-columns: 1fr; gap: 4px; }
  .student-details-list dd { text-align: left; }
  .create-student-section { padding: 12px; }
  .student-avatar-upload { align-items: flex-start; gap: 12px; }
  .student-avatar-preview { width: 60px; height: 60px; font-size: 34px; }
  .student-avatar-controls input { width: 100%; }
  .create-student-form .form-row { flex-direction: column; gap: 12px; }
  .create-student-form .form-row + .form-row { margin-top: 12px; }
}
</style>