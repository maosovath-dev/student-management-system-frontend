import { createRouter, createWebHistory } from "vue-router";

// Layout
import DashboardLayout from "../layout/DashboardLayout.vue";

// Views
import LoginView from "@/views/auth/LoginView.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  // 1. Public Route
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },

  // 2. Admin Protected Routes
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "students",
        name: "students",
        component: () => import("@/views/students/StudentView.vue"),
      },
      {
        path: "teachers",
        name: "teachers",
        component: () => import("@/views/teachers/TeacherView.vue"),
        meta: { requiresRole: "admin" },
      },
      {
        path: "classes",
        name: "classes",
        component: () => import("@/views/classes/ClassList.vue"),
      },
      {
        path: "subjects",
        name: "subjects",
        component: () => import("@/views/subjects/SubjectView.vue"),
      },
      {
        path: "scores",
        name: "scores",
        component: () => import("@/views/scores/ScoreList.vue"),
      },
      {
        path: "attendance",
        name: "attendance",
        component: () => import("@/views/attendance/AttendanceView.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/views/profile/Profile.vue"),
      },
    ],
  },

  // 3. Catch-all / Redirect
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 Navigation Guard (ឆែកតែ Admin Login)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  // បើគ្មាន Token ហើយព្យាយាមចូលទំព័រ Protected -> បង្វែរទៅ /login
  if (to.meta.requiresAuth && !token) {
    return next({ name: "login" });
  }

  if (to.meta.requiresRole && user.role !== to.meta.requiresRole) {
    return next({ name: "dashboard" });
  }

  // បើមាន Token រួចហើយ ហើយព្យាយាមចូល /login -> បង្វែរទៅ /dashboard ស្វ័យប្រវត្តិ
  if (to.name === "login" && token) {
    return next({ name: "dashboard" });
  }

  next();
});

export default router;