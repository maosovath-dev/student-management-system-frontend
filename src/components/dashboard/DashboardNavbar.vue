<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const emit = defineEmits(["toggle-sidebar"]);
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
  authStore.logout();
  router.push("/login");
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
      <button
        class="menu-btn"
        @click="emit('toggle-sidebar')"
        title="បិទ/បើក Sidebar"
      >
        <i class="bi bi-list"></i>
      </button>

      <div class="page-heading">
        <h3>ផ្ទាំងគ្រប់គ្រង</h3>
        <span>ប្រព័ន្ធគ្រប់គ្រងសិស្ស</span>
      </div>
    </div>

    <div class="navbar-right">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="ស្វែងរក..." />
      </div>

      <button class="notification-btn" title="ការជូនដំណឹង">
        <i class="bi bi-bell"></i>
        <span class="notification-count">3</span>
      </button>

      <div class="profile-wrapper" ref="dropdownRef">
        <div class="profile" @click="toggleDropdown">
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
        </div>

        <transition name="dropdown-fade">
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <div class="dropdown-header">
              <p class="dropdown-user-name">{{ userName }}</p>
              <p class="dropdown-user-email">
                {{ user.email || "user@example.com" }}
              </p>
            </div>

            <div class="dropdown-divider"></div>

            <button class="dropdown-item" @click="goToProfile">
              <i class="bi bi-person"></i>
              <span>ព័ត៌មានផ្ទាល់ខ្លួន (Profile)</span>
            </button>

            <button class="dropdown-item logout-item" @click="handleLogout">
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
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #f3f7f5;
  color: #52625a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  cursor: pointer;
  transition: 0.2s;
}

.menu-btn:hover {
  background: #e3f3ea;
  color: #16834b;
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
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #53635b;
  font-size: 20px;
  cursor: pointer;
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
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.profile:hover {
  background: #f3f7f5;
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

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 210px;
  background: #ffffff;
  border: 1px solid #e6ede9;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 9999;
}

.dropdown-header {
  padding: 8px 16px;
}

.dropdown-user-name {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #1b2d25;
}

.dropdown-user-email {
  margin: 2px 0 0 0;
  font-size: 10px;
  color: #8a9690;
}

.dropdown-divider {
  height: 1px;
  background: #f0f4f2;
  margin: 6px 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  background: transparent;
  border: none;
  font-size: 12px;
  color: #384840;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.dropdown-item i {
  font-size: 15px;
  color: #6b7c73;
}

.dropdown-item:hover {
  background: #f3f7f5;
  color: #16834b;
}

.dropdown-item:hover i {
  color: #16834b;
}

.logout-item {
  color: #dc2626;
}

.logout-item i {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.logout-item:hover i {
  color: #b91c1c;
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