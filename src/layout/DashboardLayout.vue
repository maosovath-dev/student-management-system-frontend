<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import DashboardSidebar from "../components/dashboard/DashboardSidebar.vue";
import DashboardNavbar from "../components/dashboard/DashboardNavbar.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";

const sidebarOpen = ref(true);
const isLogoutModalOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const confirmLogout = () => {
    authStore.logout();
    isLogoutModalOpen.value = false;
    showToast("បានចាកចេញពីប្រព័ន្ធជោគជ័យ។", "success");
    router.push("/login");
};
</script>

<template>

    <div
        class="dashboard-layout"
        :class="{ 'sidebar-collapsed': !sidebarOpen }"
    >

        <DashboardSidebar
            :sidebar-open="sidebarOpen"
            @logout-request="isLogoutModalOpen = true"
        />

        <div class="main-area">

            <DashboardNavbar
                :sidebar-open="sidebarOpen"
                @toggle-sidebar="toggleSidebar"
                @logout-request="isLogoutModalOpen = true"
            />

            <main class="content">
                <router-view />
            </main>

        </div>

        <BaseModal
            :is-open="isLogoutModalOpen"
            title="បញ្ជាក់ការចាកចេញ"
            @close="isLogoutModalOpen = false"
        >
            <p class="logout-confirmation-message">
                តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?
            </p>
            <template #footer>
                <BaseButton
                    variant="secondary"
                    type="button"
                    @click="isLogoutModalOpen = false"
                >
                    បោះបង់
                </BaseButton>
                <BaseButton
                    variant="danger"
                    icon="bi bi-box-arrow-right"
                    type="button"
                    @click="confirmLogout"
                >
                    ចាកចេញ
                </BaseButton>
            </template>
        </BaseModal>

    </div>

</template>


<style scoped>

.dashboard-layout {
    min-height: 100vh;
    background: #f5f8f6;
}


/* Sidebar Open */

.main-area {

    width: calc(100% - 285px);

    margin-left: 285px;

    min-height: 100vh;

    transition:
        width 0.3s ease,
        margin-left 0.3s ease;

}


/* Sidebar Collapsed */

.sidebar-collapsed .main-area {

    width: calc(100% - 78px);

    margin-left: 78px;

}


.content {

    min-height: calc(100vh - 70px);

}

.logout-confirmation-message {
    margin: 0;
    color: #52625a;
    line-height: 1.7;
}

:global(:root[data-theme="dark"]) .logout-confirmation-message {
    color: #dce7df;
}


/* Mobile */

@media (max-width: 768px) {

    .main-area {

        width: 100%;

        margin-left: 0;

    }

    .sidebar-collapsed .main-area {

        width: 100%;

        margin-left: 0;

    }

}

</style>