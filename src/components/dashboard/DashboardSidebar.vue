<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
    sidebarOpen: {
        type: Boolean,
        default: true,
    },
});

const route = useRoute();
const router = useRouter();

/* =========================
   USER
========================= */

const user = computed(() => {
    try {
        return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        return {};
    }
});

/* =========================
   MENU
========================= */

const dashboardItem = {
    title: "ផ្ទាំងគ្រប់គ្រង",
    icon: "bi-grid-fill",
    path: "/dashboard",
};

const menuGroups = computed(() => [
    {
        title: "ការគ្រប់គ្រង",
        icon: "bi-people-fill",
        items: [
            ...(user.value.role === "admin"
                ? [{
                    title: "គ្រូបង្រៀន",
                    icon: "bi-person-workspace",
                    path: "/teachers",
                }]
                : []),
            {
                title: "សិស្ស",
                icon: "bi-person-fill",
                path: "/students",
            },
            {
                title: "ថ្នាក់រៀន",
                icon: "bi-building",
                path: "/classes",
            },
            {
                title: "មុខវិជ្ជា",
                icon: "bi-book-fill",
                path: "/subjects",
            },
        ],
    },
    {
        title: "វត្តមាន",
        icon: "bi-calendar-check-fill",
        items: [
            {
                title: "កត់ត្រាវត្តមាន",
                icon: "bi-pencil-square",
                path: "/attendance",
                view: "take",
            },
            {
                title: "ប្រវត្តិវត្តមាន",
                icon: "bi-clock-history",
                path: "/attendance",
                view: "history",
            },
        ],
    },
    {
        title: "ពិន្ទុ",
        icon: "bi-bar-chart-fill",
        items: [
            {
                title: "គ្រប់ថ្នាក់រៀន",
                icon: "bi-building",
                path: "/scores",
                view: "classes",
            },
            {
                title: "ប្រវត្តិពិន្ទុ",
                icon: "bi-clock-history",
                path: "/scores",
                view: "history",
            },
            {
                title: "របាយការណ៍",
                icon: "bi-file-earmark-bar-graph",
                path: "/scores",
                view: "reports",
            },
        ],
    },
]);

/* =========================
   ACTIVE MENU
========================= */

const isActive = (item) => {
    return route.path === item.path && (item.view ? route.query.view === item.view : !route.query.view);
};

const getRoute = (item) => item.view
    ? { path: item.path, query: { view: item.view } }
    : item.path;

const isGroupActive = (group) => group.items.some(isActive);

const getTooltip = (item, groupTitle = "") => {
    return groupTitle ? `${groupTitle} · ${item.title}` : item.title;
};

/* =========================
   LOGOUT
========================= */

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
};
</script>


<template>

    <aside
        class="sidebar"
        :class="{ collapsed: !props.sidebarOpen }"
    >

        <!-- =====================================
             HEADER
        ====================================== -->

        <div class="sidebar-header">

            <div class="logo-area">

                <div class="logo-icon">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <h1 v-if="props.sidebarOpen">
                    SRMS
                </h1>

                <p v-if="props.sidebarOpen">
                    ប្រព័ន្ធគ្រប់គ្រងសិស្ស
                </p>

            </div>

        </div>


        <!-- =====================================
             MENU
        ====================================== -->

        <nav class="sidebar-menu" aria-label="ម៉ឺនុយមេ">
            <router-link
                :to="dashboardItem.path"
                class="menu-item dashboard-item"
                :class="{ active: isActive(dashboardItem) }"
            >
                <div class="menu-icon">
                    <i :class="['bi', dashboardItem.icon]"></i>
                </div>
                <span v-if="props.sidebarOpen">{{ dashboardItem.title }}</span>
                <div v-if="!props.sidebarOpen" class="tooltip">{{ dashboardItem.title }}</div>
            </router-link>

            <section
                v-for="group in menuGroups"
                :key="group.title"
                class="menu-group"
                :class="{ 'group-active': isGroupActive(group) }"
                :aria-label="group.title"
            >
                <h2 v-if="props.sidebarOpen" class="menu-group-title">
                    <i :class="['bi', group.icon]" aria-hidden="true"></i>
                    <span>{{ group.title }}</span>
                </h2>
                <div class="menu-group-items">
                    <router-link
                        v-for="item in group.items"
                        :key="`${item.path}-${item.view || item.title}`"
                        :to="getRoute(item)"
                        class="menu-item submenu-item"
                        :class="{ active: isActive(item) }"
                    >
                        <div class="menu-icon">
                            <i :class="['bi', item.icon]" aria-hidden="true"></i>
                        </div>
                        <span v-if="props.sidebarOpen">{{ item.title }}</span>
                        <div v-if="!props.sidebarOpen" class="tooltip">
                            {{ getTooltip(item, group.title) }}
                        </div>
                    </router-link>
                </div>
            </section>

            <router-link
                to="/profile"
                class="menu-item profile-item"
                :class="{ active: isActive({ path: '/profile' }) }"
            >
                <div class="menu-icon">
                    <i class="bi bi-person-circle" aria-hidden="true"></i>
                </div>
                <span v-if="props.sidebarOpen">ប្រវត្តិរូប</span>
                <div v-if="!props.sidebarOpen" class="tooltip">ប្រវត្តិរូប</div>
            </router-link>

        </nav>


        <!-- =====================================
             USER
        ====================================== -->

        <div class="sidebar-user">

            <div class="user-avatar">

                <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    alt="Avatar"
                />

                <span v-else>
                    {{
                        user.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"
                    }}
                </span>

            </div>


            <div
                v-if="props.sidebarOpen"
                class="user-info"
            >

                <strong>
                    {{ user.name || "អ្នកប្រើប្រាស់" }}
                </strong>

                <small>
                    {{ user.role || "user" }}
                </small>

            </div>


            <!-- Tooltip -->
            <div
                v-if="!props.sidebarOpen"
                class="tooltip user-tooltip"
            >
                {{ user.name || "អ្នកប្រើប្រាស់" }}
            </div>

        </div>


        <!-- =====================================
             LOGOUT
        ====================================== -->

        <button
            v-if="props.sidebarOpen"
            class="logout-btn"
            @click="logout"
        >

            <i class="bi bi-box-arrow-right"></i>

            <span>
                ចាកចេញ
            </span>

        </button>

    </aside>

</template>


<style scoped>

/* =====================================================
   SIDEBAR
===================================================== */

.sidebar {

    position: fixed;

    top: 0;
    left: 0;

    width: 285px;

    height: 100vh;

    background: #ffffff;

    border-right: 1px solid #e8efeb;

    display: flex;

    flex-direction: column;

    z-index: 1000;

    overflow: hidden;

    transition:
        width 0.3s ease;

}


/* =====================================================
   COLLAPSED
===================================================== */

.sidebar.collapsed {

    width: 78px;

}


/* =====================================================
   HEADER
===================================================== */

.sidebar-header {

    height: 158px;

    flex-shrink: 0;

    background:
        linear-gradient(
            135deg,
            #159447,
            #1fa65b
        );

    display: flex;

    justify-content: center;

    align-items: center;

    text-align: center;

}


/* =====================================================
   LOGO
===================================================== */

.logo-area {

    color: white;

}


.logo-icon {

    font-size: 35px;

    margin-bottom: 4px;

}


.logo-area h1 {

    margin: 0;

    font-size: 25px;

    font-weight: 800;

    letter-spacing: 1px;

}


.logo-area p {

    margin: 2px 0 0;

    font-size: 12px;

    font-weight: 400;

    opacity: 0.95;

}


/* =====================================================
   MENU
===================================================== */

.sidebar-menu {

    flex: 1;

    padding: 20px 16px;

    display: flex;

    flex-direction: column;

    gap: 5px;

    overflow-y: auto;

}


.dashboard-item {

    margin-bottom: 16px;

}


.menu-group {

    margin-bottom: 13px;

}


.menu-group-title {

    display: flex;

    align-items: center;

    gap: 9px;

    margin: 0 0 5px;

    padding: 0 12px;

    color: #89968f;

    font-size: 11px;

    font-weight: 700;

    letter-spacing: 0.07em;

    text-transform: uppercase;

}


.menu-group-title i {

    font-size: 12px;

}


.menu-group.group-active .menu-group-title {

    color: #218455;

}


.menu-group-items {

    display: flex;

    flex-direction: column;

    gap: 2px;

    margin-left: 8px;

    padding-left: 8px;

    border-left: 1px solid #e8efeb;

}


/* =====================================================
   MENU ITEM
===================================================== */

.menu-item {

    position: relative;

    min-height: 44px;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 0 12px;

    border-radius: 13px;

    color: #66736d;

    text-decoration: none;

    font-size: 14px;

    font-weight: 600;

    transition:
        all 0.25s ease;

}


.dashboard-item {

    min-height: 48px;

    font-size: 15px;

}


.profile-item {

    margin-top: 4px;

}


/* =====================================================
   MENU HOVER
===================================================== */

.menu-item:hover {

    background: #eef9f3;

    color: #159447;

}


/* =====================================================
   ACTIVE
===================================================== */

.menu-item.active {

    background:
        linear-gradient(
            135deg,
            #169b4c,
            #20a95b
        );

    color: white;

    box-shadow:
        0 7px 16px
        rgba(22, 155, 76, 0.20);

}


/* =====================================================
   ICON
===================================================== */

.menu-icon {

    width: 25px;

    min-width: 25px;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 19px;

}


.menu-item.active .menu-icon {

    color: white;

}


.menu-item:not(.active) .menu-icon {

    color: #728079;

}


/* =====================================================
   COLLAPSED MENU
===================================================== */

.sidebar.collapsed .sidebar-menu {

    padding: 20px 10px;

}


.sidebar.collapsed .dashboard-item {

    margin-bottom: 12px;

}


.sidebar.collapsed .menu-group {

    margin-bottom: 10px;

}


.sidebar.collapsed .menu-group-items {

    margin-left: 0;

    padding-left: 0;

    border-left: 0;

}


.sidebar.collapsed .menu-item {

    justify-content: center;

    padding: 0;

}


.sidebar.collapsed .submenu-item {

    min-height: 44px;

}


.sidebar.collapsed .menu-icon {

    width: 100%;

    font-size: 21px;

}


/* =====================================================
   TOOLTIP
===================================================== */

.tooltip {

    position: absolute;

    left: calc(100% + 10px);

    top: 50%;

    transform:
        translateY(-50%)
        translateX(-5px);

    background: #163c2c;

    color: white;

    padding: 8px 12px;

    border-radius: 7px;

    font-size: 13px;

    white-space: nowrap;

    opacity: 0;

    pointer-events: none;

    transition: 0.2s ease;

    z-index: 2000;

}


.menu-item:hover .tooltip,
.sidebar-user:hover .tooltip {

    opacity: 1;

    transform:
        translateY(-50%)
        translateX(0);

}


/* =====================================================
   USER
===================================================== */

.sidebar-user {

    position: relative;

    height: 94px;

    flex-shrink: 0;

    border-top: 1px solid #edf1ef;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 15px 25px;

}


/* =====================================================
   AVATAR
===================================================== */

.user-avatar {

    width: 44px;

    height: 44px;

    min-width: 44px;

    border-radius: 50%;

    background: #e4f6ec;

    color: #159447;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 18px;

    font-weight: 800;

    overflow: hidden;

}


.user-avatar img {

    width: 100%;

    height: 100%;

    object-fit: cover;

}


/* =====================================================
   USER INFO
===================================================== */

.user-info {

    display: flex;

    flex-direction: column;

    min-width: 0;

}


.user-info strong {

    color: #34423b;

    font-size: 14px;

    font-weight: 700;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

}


.user-info small {

    color: #89958f;

    font-size: 11px;

    margin-top: 3px;

}


/* =====================================================
   COLLAPSED USER
===================================================== */

.sidebar.collapsed .sidebar-user {

    justify-content: center;

    padding: 15px 10px;

}


.sidebar.collapsed .user-avatar {

    width: 42px;

    height: 42px;

}


/* =====================================================
   LOGOUT
===================================================== */

.logout-btn {

    margin: 0 16px 15px;

    height: 45px;

    border: none;

    border-radius: 10px;

    background: transparent;

    color: #68756f;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 0 18px;

    font-size: 14px;

    font-weight: 600;

    cursor: pointer;

    transition: 0.2s ease;

}


.logout-btn:hover {

    background: #fff0f0;

    color: #d64545;

}


.logout-btn i {

    font-size: 18px;

}


/* =====================================================
   SCROLLBAR
===================================================== */

.sidebar-menu::-webkit-scrollbar {

    width: 4px;

}


.sidebar-menu::-webkit-scrollbar-thumb {

    background: #d7e7df;

    border-radius: 10px;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 768px) {

    .sidebar {

        width: 285px;

    }

    .sidebar.collapsed {

        width: 285px;

        transform: translateX(-100%);

    }

}

</style>