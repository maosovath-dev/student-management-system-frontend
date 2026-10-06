<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

// Form States (Admin មានតែ Name និង Email ប៉ុណ្ណោះ គ្មាន Phone)
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
});

const fileInput = ref(null);
const selectedFile = ref(null);
const avatarPreview = ref(null);
const message = ref({ type: "", text: "" });

// បំបែក Name ទៅជា First Name & Last Name
const splitName = (fullName) => {
  if (!fullName) return { first: "", last: "" };
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  const first = parts.join(" ");
  return { first, last };
};

onMounted(async () => {
  try {
    await authStore.fetchProfile();
  } catch (err) {
    console.error(err);
  }

  if (authStore.user) {
    const { first, last } = splitName(authStore.user.name);
    form.firstName = first;
    form.lastName = last;
    form.email = authStore.user.email || "";
  }
});

const triggerAvatarClick = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showMessage("error", "សូមជ្រើសរើសឯកសារជារូបភាពប៉ុណ្ណោះ!");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showMessage("error", "ទំហំរូបភាពត្រូវតែតូចជាង 2MB!");
    return;
  }

  selectedFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const handleRemoveAvatar = async () => {
  try {
    await authStore.deleteAvatar();
    avatarPreview.value = null;
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    showMessage("success", "បានលុបរូបភាព Profile ចោលជោគជ័យ!");
  } catch (err) {
    showMessage("error", err || "មិនអាចលុបរូបភាពបានទេ!");
  }
};

const handleSave = async () => {
  try {
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    if (!fullName) {
      showMessage("error", "សូមបញ្ចូលឈ្មោះមុនពេលរក្សាទុក!");
      return;
    }

    await authStore.updateProfile({ name: fullName });

    if (selectedFile.value) {
      await authStore.changeAvatar(selectedFile.value);
      selectedFile.value = null;
      if (fileInput.value) fileInput.value.value = "";
    }

    showMessage("success", "រក្សាទុកការផ្លាស់ប្តូរជោគជ័យ!");
  } catch (err) {
    showMessage("error", err || "រក្សាទុកបរាជ័យ!");
  }
};

const handleCancel = () => {
  if (authStore.user) {
    const { first, last } = splitName(authStore.user.name);
    form.firstName = first;
    form.lastName = last;
  }
  avatarPreview.value = null;
};

const showMessage = (type, text) => {
  message.value = { type, text };
  setTimeout(() => {
    message.value = { type: "", text: "" };
  }, 3500);
};
</script>

<template>
  <div class="profile-page-wrapper">
    <div class="account-card">
      <h1 class="page-title">គណនីផ្ទាល់ខ្លួន</h1>

      <!-- Alert Notification -->
      <transition name="fade">
        <div v-if="message.text" :class="['alert-toast', message.type]">
          <i :class="message.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'"></i>
          <span>{{ message.text }}</span>
        </div>
      </transition>

      <!-- Profile Picture Section -->
      <section class="section-block">
        <div class="avatar-edit-container">
          <div class="avatar-display">
            <img
              v-if="avatarPreview || authStore.user?.avatar_url || authStore.user?.avatar"
              :src="avatarPreview || authStore.user?.avatar_url || authStore.user?.avatar"
              alt="Profile Picture"
              class="large-avatar"
            />
            <div v-else class="large-avatar-placeholder">
              {{ (form.firstName || 'A').charAt(0).toUpperCase() }}
            </div>
          </div>

          <div class="avatar-actions">
            <h3 class="block-title">រូបថតផ្ទាល់ខ្លួន (Profile Picture)</h3>
            <div class="button-group">
              <button
                type="button"
                class="btn-main-upload"
                @click="triggerAvatarClick"
                :disabled="authStore.loading"
              >
                <i class="bi bi-upload"></i>
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                class="btn-outline-remove"
                @click="handleRemoveAvatar"
                :disabled="authStore.loading"
              >
                Remove
              </button>

              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
            </div>
            <p class="hint-text">គាំទ្រប្រភេទរូបភាព PNG, JPEG និង WEBP ទំហំតូចជាង 2MB</p>
          </div>
        </div>
      </section>

      <!-- Name Form Fields -->
      <section class="section-block grid-2-col">
        <div class="form-field">
          <label>នាមត្រកូល (First Name)</label>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="បញ្ចូលនាមត្រកូល"
          />
        </div>

        <div class="form-field">
          <label>នាមខ្លួន (Last Name)</label>
          <input
            v-model="form.lastName"
            type="text"
            placeholder="បញ្ចូលនាមខ្លួន"
          />
        </div>
      </section>

      <!-- Email Field (Readonly) -->
      <section class="section-block">
        <div class="form-field">
          <label>អ៊ីមែល (Email)</label>
          <div class="input-with-button">
            <input
              v-model="form.email"
              type="email"
              disabled
              placeholder="admin@example.com"
            />
            <button type="button" class="btn-secondary-edit" disabled>Edit Email</button>
          </div>
          <p class="hint-text">ប្រព័ន្ធប្រើប្រាស់អ៊ីមែលនេះសម្រាប់ចូលប្រព័ន្ធ ( Readonly )</p>
        </div>
      </section>

      <hr class="divider" />

      <!-- Password Section -->
      <section class="section-block password-row">
        <div>
          <h3 class="block-title-sub">ពាក្យសម្ងាត់ (Password)</h3>
          <p class="hint-text">ចូលប្រព័ន្ធដោយប្រើពាក្យសម្ងាត់របស់អ្នក</p>
        </div>
        <button type="button" class="btn-outline-change">Change Password</button>
      </section>

      <hr class="divider" />

      <!-- Bottom Action Buttons -->
      <div class="bottom-actions">
        <button type="button" class="btn-cancel" @click="handleCancel">បោះបង់ (Cancel)</button>
        <button
          type="button"
          class="btn-main-save"
          @click="handleSave"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading">កំពុងរក្សាទុក...</span>
          <span v-else>រក្សាទុក (Save)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 70px);
  padding: clamp(16px, 3vw, 36px);
  display: flex;
  align-items: stretch;
}

.account-card {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: calc(100vh - 142px);
  background: #ffffff;
  border-radius: 18px;
  padding: clamp(24px, 4vw, 48px);
  border: 1px solid #e6ede9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1b2d25;
  margin-bottom: 28px;
}

.section-block {
  margin-bottom: 24px;
}

/* Avatar Section */
.avatar-edit-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.large-avatar,
.large-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.large-avatar-placeholder {
  background: #e3f4ea;
  color: #16834b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-title {
  font-size: 15px;
  font-weight: 600;
  color: #1b2d25;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 12px;
}

/* Main Theme Color Buttons (#16834b) */
.btn-main-upload {
  background: #16834b;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-main-upload:hover {
  background: #11683b;
}

.btn-outline-remove {
  background: white;
  border: 1px solid #dfe8e3;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  color: #52625a;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-remove:hover {
  background: #f8faf9;
  border-color: #cbd8d1;
  color: #dc2626;
}

.hint-text {
  font-size: 12px;
  color: #8a9690;
  margin: 4px 0 0 0;
}

/* Form Layout */
.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-size: 13px;
  font-weight: 600;
  color: #27372f;
}

.form-field input {
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  background: #fafcfb;
  transition: border-color 0.2s;
}

.form-field input:focus {
  border-color: #16834b;
  background: #ffffff;
}

.input-with-button {
  display: flex;
  gap: 12px;
}

.input-with-button input {
  flex: 1;
  background: #f3f7f5;
  color: #7d8b84;
  cursor: not-allowed;
}

.btn-secondary-edit {
  background: white;
  border: 1px solid #dfe8e3;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;
  color: #8a9690;
  cursor: not-allowed;
}

.divider {
  border: none;
  border-top: 1px solid #e6ede9;
  margin: 28px 0;
}

/* Password Row */
.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.block-title-sub {
  font-size: 15px;
  font-weight: 600;
  color: #1b2d25;
  margin: 0;
}

.btn-outline-change {
  background: white;
  border: 1px solid #dfe8e3;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #27372f;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-outline-change:hover {
  background: #f3f7f5;
  color: #16834b;
}

/* Bottom Actions */
.bottom-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.btn-cancel {
  background: white;
  border: 1px solid #dfe8e3;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #52625a;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #f8faf9;
}

.btn-main-save {
  background: #16834b;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-main-save:hover {
  background: #11683b;
}

.hidden {
  display: none;
}

/* Alert Toast Style */
.alert-toast {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-toast.success {
  background: #e3f4ea;
  color: #16834b;
}

.alert-toast.error {
  background: #fef2f2;
  color: #dc2626;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .profile-page-wrapper {
    min-height: calc(100vh - 56px);
    padding: 12px;
  }
  .account-card {
    min-height: calc(100vh - 80px);
    padding: 22px 18px;
    border-radius: 14px;
  }
  .grid-2-col {
    grid-template-columns: 1fr;
  }
  .avatar-edit-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .password-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>