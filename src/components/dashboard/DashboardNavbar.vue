<script setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const emit = defineEmits(["toggle-sidebar", "logout-request"]);
const router = useRouter();
const authStore = useAuthStore();

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = (event) => {
  event?.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const goToProfile = () => {
  closeDropdown();
  router.push("/profile");
};

const handleLogout = () => {
  closeDropdown();
  emit("logout-request");
};

const user = computed(() => {
  return authStore.user || {};
});

const userName = computed(() => {
  return user.value.name || "អ្នកប្រើប្រាស់";
});

const userRole = computed(() => {
  if (user.value.role === "admin") return "អ្នកគ្រប់គ្រង";
  if (user.value.role === "teacher") return "គ្រូបង្រៀន";
  return "អ្នកប្រើប្រាស់";
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <BaseButton
        class="menu-btn"
        variant="ghost"
        icon="bi bi-list"
        icon-only
        @click="emit('toggle-sidebar')"
        title="បិទ/បើក Sidebar"
      >
      </BaseButton>

      <div class="page-heading">
        <h3>ផ្ទាំងគ្រប់គ្រង</h3>
        <span>ប្រព័ន្ធគ្រប់គ្រងសិស្ស</span>
      </div>
    </div>

    <div class="navbar-right">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <BaseInput type="text" placeholder="ស្វែងរក..." />
      </div>

      <div class="notification-wrapper">
        <BaseButton
          class="notification-btn"
          variant="ghost"
          icon="bi bi-bell"
          icon-only
          title="ការជូនដំណឹង"
          aria-label="ការជូនដំណឹង"
        />
        <span class="notification-count">3</span>
      </div>

      <ThemeToggle />

      <div class="profile-wrapper" ref="dropdownRef">
        <button
          class="profile"
          type="button"
          aria-haspopup="true"
          aria-controls="profile-dropdown"
          :aria-expanded="isDropdownOpen"
          @click="toggleDropdown"
          @keydown.esc.stop.prevent="closeDropdown"
        >
          <div class="avatar">
            <img
              v-if="user.avatar_url || user.avatar"
              :src="user.avatar_url || user.avatar"
              alt="Avatar"
              class="avatar-img"
            />
            <span v-else>
              {{ userName.charAt(0).toUpperCase() }}
            </span>
          </div>

          <div class="profile-info">
            <strong>{{ userName }}</strong>
            <span>{{ userRole }}</span>
          </div>

          <i
            class="bi bi-chevron-down profile-arrow"
            :class="{ 'rotate-arrow': isDropdownOpen }"
          ></i>
        </button>

        <transition name="dropdown-fade">
          <div v-if="isDropdownOpen" id="profile-dropdown" class="profile-dropdown">
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <img
                  v-if="user.avatar_url || user.avatar"
                  :src="user.avatar_url || user.avatar"
                  alt=""
                />
                <span v-else>{{ userName.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="dropdown-user-details">
                <p class="dropdown-user-name">{{ userName }}</p>
                <p class="dropdown-user-email">
                  {{ user.email || "មិនមានអ៊ីមែល" }}
                </p>
                <span class="dropdown-user-role">{{ userRole }}</span>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <button type="button" class="dropdown-item" @click="goToProfile">
              <i class="bi bi-person"></i>
              <span>ព័ត៌មានផ្ទាល់ខ្លួន (Profile)</span>
            </button>

            <button type="button" class="dropdown-item" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              <span>ចាកចេញ (Logout)</span>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e6ede9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  z-index: 900;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.menu-btn {
  flex: 0 0 auto;
}

.page-heading h3 {
  margin: 0;
  color: #1b2d25;
  font-size: 16px;
  font-weight: 700;
}

.page-heading span {
  display: block;
  margin-top: 2px;
  color: #8a9690;
  font-size: 9px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.search-box {
  width: 275px;
  height: 42px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  background: #fafcfb;
}

.search-box i {
  color: #7d8b84;
  font-size: 17px;
}

.search-box input {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #27372f;
  font-size: 11px;
}

.search-box input::placeholder {
  color: #9ca7a2;
}

.notification-btn {
  position: relative;
}

.notification-wrapper {
  position: relative;
  display: flex;
}

.notification-count {
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #287dd3;
  color: white;
  border: 2px solid white;
  font-size: 7px;
  font-weight: 700;
}

.profile-wrapper {
  position: relative;
}

.profile {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  border-radius: 10px;
  transition: background 0.2s, box-shadow 0.2s;
  user-select: none;
}

.profile:hover {
  background: #f3f7f5;
}

.profile:focus-visible {
  outline: 3px solid rgba(22, 131, 75, 0.2);
  outline-offset: 2px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #e3f4ea;
  color: #16834b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info strong {
  display: block;
  color: #25352d;
  font-size: 11px;
}

.profile-info span {
  display: block;
  margin-top: 2px;
  color: #8d9893;
  font-size: 8px;
}

.profile-arrow {
  color: #78857e;
  font-size: 10px;
  transition: transform 0.2s ease;
}

.rotate-arrow {
  transform: rotate(180deg);
}

.profile-dropdown {
  display: block;
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: 264px;
  max-width: calc(100vw - 24px);
  background: #ffffff;
  border: 1px solid #e4ece7;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(22, 47, 33, 0.16), 0 3px 10px rgba(22, 47, 33, 0.06);
  padding: 8px;
  z-index: 9999;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #e3f2e8;
  border-radius: 50%;
  background: linear-gradient(135deg, #e4f5ea, #ccebd8);
  color: #16834b;
  font-size: 15px;
  font-weight: 800;
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-user-details {
  min-width: 0;
}

.dropdown-user-name {
  margin: 0;
  overflow: hidden;
  color: #1b2d25;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-user-email {
  margin: 3px 0 0;
  overflow: hidden;
  color: #8a9690;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-user-role {
  display: inline-flex;
  margin-top: 7px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #edf7f0;
  color: #16834b;
  font-size: 9px;
  font-weight: 700;
}

.dropdown-divider {
  height: 1px;
  background: #edf1ee;
  margin: 4px 2px 6px;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 11px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #384840;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  text-align: left;
}

.dropdown-item i {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f0f5f2;
  color: #607369;
  font-size: 12px;
  transition: background 0.18s ease, color 0.18s ease;
}

.dropdown-item:hover {
  background: #eff7f1;
  color: #16834b;
  transform: translateX(2px);
}

.dropdown-item:hover i {
  background: #dcefe2;
  color: #16834b;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

:global(:root[data-theme="dark"]) .navbar .page-heading h3,
:global(:root[data-theme="dark"]) .navbar .profile-info strong,
:global(:root[data-theme="dark"]) .navbar .dropdown-user-name {
  color: #f1f7f3;
}

:global(:root[data-theme="dark"]) .navbar .page-heading span,
:global(:root[data-theme="dark"]) .navbar .profile-info span,
:global(:root[data-theme="dark"]) .navbar .profile-arrow,
:global(:root[data-theme="dark"]) .navbar .dropdown-user-email {
  color: #b7c8bd;
}

:global(:root[data-theme="dark"]) .navbar .profile:hover {
  background: #26382b;
}

@media (max-width: 900px) {
  .navbar {
    padding: 0 15px;
  }

  .search-box {
    display: none;
  }

  .profile-info {
    display: none;
  }
}

@media (max-width: 500px) {
  .page-heading {
    display: none;
  }

  .navbar-right {
    gap: 7px;
  }
}
</style>