import {
    createRouter,
    createWebHistory
} from "vue-router";

import DashboardLayout
    from "../layout/DashboardLayout.vue";

import Dashboard
    from "../views/Dashboard.vue";

const routes = [
    {
        path: "/",
        component: DashboardLayout,

        children: [

            {
                path: "",
                redirect: "/dashboard"
            },

            {
                path: "dashboard",
                name: "dashboard",
                component: Dashboard
            },

            {
                path: "students",
                name: "students",
                component: () =>
                    import(
                        "@/views/students/StudentList.vue"
                    )
            },

            {
                path: "classes",
                name: "classes",
                component: () =>
                    import(
                        "@/views/classes/ClassList.vue"
                    )
            },

            {
                path: "subjects",
                name: "subjects",
                component: () =>
                    import(
                        "@/views/subjects/SubjectList.vue"
                    )
            },

            {
                path: "scores",
                name: "scores",
                component: () =>
                    import(
                        "@/views/scores/ScoreList.vue"
                    )
            },

            {
                path: "attendance",
                name: "attendance",
                component: () =>
                    import(
                        "@/views/attendance/AttendanceList.vue"
                    )
            },

            {
                path: "profile",
                name: "profile",
                component: () =>
                    import(
                        "@/views/profile/Profile.vue"
                    )
            }

        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;