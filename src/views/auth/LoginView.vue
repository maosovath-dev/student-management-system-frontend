<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    await authStore.login(form.email, form.password);
    // Login ជោគជ័យ -> ចូលទៅ Dashboard ភ្លាមៗ
    router.push("/dashboard");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "អ៊ីមែល ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ!";
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>🔐 Admin Login</h2>
      <p>បញ្ចូលអ៊ីមែល និងលេខសម្ងាត់ដើម្បីចូលប្រព័ន្ធ</p>

      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="form-container">
        <div class="form-group">
          <label>អ៊ីមែល (Email)</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label>លេខសម្ងាត់ (Password)</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="authStore.loading">
          {{ authStore.loading ? "កំពុងចូល..." : "ចូលប្រព័ន្ធ" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f8fafc;
  font-family: "Kantumruy Pro", sans-serif;
}
.auth-card {
  width: 100%;
  max-width: 380px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}
h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #0f172a;
  text-align: center;
}
p {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 13px;
  text-align: center;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.form-group input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.form-group input:focus {
  border-color: #2563eb;
}
.btn-submit {
  background: #2563eb;
  color: white;
  border: 0;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}
.btn-submit:disabled {
  background: #94a3b8;
}
.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}
</style>