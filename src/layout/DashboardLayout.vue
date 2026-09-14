<script setup>
import { ref } from "vue";

import DashboardSidebar from "../components/dashboard/DashboardSidebar.vue";
import DashboardNavbar from "../components/dashboard/DashboardNavbar.vue";

const sidebarOpen = ref(true);

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>

    <div
        class="dashboard-layout"
        :class="{ 'sidebar-collapsed': !sidebarOpen }"
    >

        <DashboardSidebar
            :sidebar-open="sidebarOpen"
        />

        <div class="main-area">

            <DashboardNavbar
                :sidebar-open="sidebarOpen"
                @toggle-sidebar="toggleSidebar"
            />

            <main class="content">
                <router-view />
            </main>

        </div>

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