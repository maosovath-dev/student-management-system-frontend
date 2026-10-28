<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    await authStore.login(form.email, form.password);
    showToast("បានចូលប្រព័ន្ធជោគជ័យ។", "success");
    router.push("/dashboard");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "អ៊ីមែល ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ!";
    showToast(errorMessage.value, "error");
  }
};
</script>

<template>
  <main class="login-page">
    <div class="background-shape shape-one"></div>
    <div class="background-shape shape-two"></div>

    <header class="page-header">
      <RouterLink class="brand" to="/landing" aria-label="ត្រឡប់ទៅទំព័រដើម EduManage">
        <span class="brand-mark"><i class="bi bi-mortarboard-fill"></i></span>
        <span class="brand-name">Edu<span>Manage</span></span>
      </RouterLink>
      <div class="header-actions">
        <ThemeToggle />
        <RouterLink class="back-link" to="/landing">
          <i class="bi bi-arrow-left"></i> ទំព័រដើម
        </RouterLink>
      </div>
    </header>

    <section class="login-content">
      <div class="welcome-note">
        <span class="welcome-mark"><i class="bi bi-stars"></i></span>
        <span>សូមស្វាគមន៍មកកាន់ EduManage</span>
      </div>

      <div class="login-card">
        <div class="card-top-accent"></div>
        <div class="form-heading">
          <div class="heading-icon"><i class="bi bi-person-lock"></i></div>
          <h1>ចូលប្រព័ន្ធ</h1>
          <p>សូមបញ្ចូលអ៊ីមែល និងលេខសម្ងាត់របស់អ្នក<br class="desktop-break" /> ដើម្បីបន្តទៅកាន់ផ្ទាំងគ្រប់គ្រង។</p>
        </div>

        <div v-if="errorMessage" class="alert-error" role="alert" aria-live="assertive" aria-atomic="true">
          <span class="alert-icon"><i class="bi bi-exclamation-lg"></i></span>
          <span class="alert-copy">
            <strong>ចូលប្រព័ន្ធមិនបានសម្រេច</strong>
            <span>{{ errorMessage }}</span>
          </span>
        </div>

        <form @submit.prevent="handleLogin" class="form-container">
          <BaseInput
            v-model="form.email"
            label="អ៊ីមែល"
            type="email"
            icon-left="bi bi-envelope"
            placeholder="name@example.com"
            autocomplete="username"
            required
          />

          <BaseInput
            v-model="form.password"
            label="លេខសម្ងាត់"
            type="password"
            icon-left="bi bi-lock"
            placeholder="បញ្ចូលលេខសម្ងាត់របស់អ្នក"
            autocomplete="current-password"
            required
          />

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="authStore.loading"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? "កំពុងចូលប្រព័ន្ធ..." : "ចូលប្រព័ន្ធ" }}
            <i v-if="!authStore.loading" class="bi bi-arrow-right"></i>
          </BaseButton>
        </form>

        <div class="secure-note">
          <i class="bi bi-shield-lock-fill"></i>
          <span>ការចូលប្រើរបស់អ្នកមានសុវត្ថិភាព</span>
        </div>
      </div>

      <div class="support-note">
        <span class="support-icon"><i class="bi bi-info-circle"></i></span>
        <p>មានបញ្ហាក្នុងការចូលប្រើ?<br /><strong>សូមទាក់ទងអ្នកគ្រប់គ្រងសាលា</strong></p>
      </div>
    </section>

    <footer class="page-footer">
      <span>© ២០២៦ EduManage</span>
      <span>ប្រព័ន្ធគ្រប់គ្រងសាលារៀន <i class="bi bi-dot"></i> សុវត្ថិភាព និងទំនុកចិត្ត</span>
    </footer>
  </main>
</template>

<style scoped>
.login-page {
  --green: #14845c;
  --green-deep: #0e704e;
  --ink: #20382c;
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, .9), transparent 50%),
    #f2f7f3;
  color: var(--ink);
}

.background-shape {
  position: absolute;
  pointer-events: none;
  border: 1px solid rgba(29, 133, 91, .08);
  border-radius: 50%;
}

.shape-one {
  top: 120px;
  left: -220px;
  width: 480px;
  height: 480px;
  box-shadow: 0 0 0 25px rgba(29, 133, 91, .025), 0 0 0 55px rgba(29, 133, 91, .02);
}

.shape-two {
  right: -210px;
  bottom: -240px;
  width: 570px;
  height: 570px;
  box-shadow: 0 0 0 32px rgba(29, 133, 91, .025), 0 0 0 68px rgba(29, 133, 91, .02);
}

.page-header {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(1200px, calc(100% - 72px));
  height: 82px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid #d6e9dc;
  border-radius: 11px;
  background: #e7f3eb;
  color: var(--green);
  font-size: 19px;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -.5px;
}

.brand-name > span {
  color: var(--green);
  font-weight: 500;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #65786d;
  font-size: 12px;
  font-weight: 600;
  transition: color .2s ease;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-link:hover {
  color: var(--green);
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(100% - 32px, 430px);
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -14px auto 0;
  padding: 25px 0 35px;
}

.welcome-note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: #668174;
  font-size: 11px;
  font-weight: 600;
}

.welcome-mark {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 7px;
  background: #e1f1e7;
  color: var(--green);
  font-size: 11px;
}

.login-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 37px 40px 28px;
  border: 1px solid #e4ece6;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 22px 60px rgba(37, 75, 52, .09), 0 2px 8px rgba(37, 75, 52, .035);
}

.card-top-accent {
  position: absolute;
  top: 0;
  left: 40px;
  width: 46px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: var(--green);
}

.form-heading {
  margin-bottom: 25px;
}

.heading-icon {
  display: grid;
  width: 47px;
  height: 47px;
  margin-bottom: 19px;
  place-items: center;
  border: 1px solid #dcefe3;
  border-radius: 14px;
  background: #eff8f2;
  color: var(--green);
  font-size: 20px;
}

.form-heading h1 {
  margin: 0 0 7px;
  color: #21392d;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -.4px;
}

.form-heading p {
  margin: 0;
  color: #849188;
  font-size: 12px;
  line-height: 1.8;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-container :deep(.input-group) {
  gap: 7px;
}

.form-container :deep(.input-label) {
  color: #35493d;
  font-size: 12px;
  font-weight: 700;
}

.form-container :deep(.base-input) {
  height: 46px;
  border-color: #dfe8e2;
  border-radius: 8px;
  background: #fcfdfc;
  font-size: 13px;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
}

.form-container :deep(.base-input:focus:not(:disabled)) {
  border-color: #51a982;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(20, 132, 92, .1);
}

.form-container :deep(.base-input::placeholder) {
  color: #a5b0a8;
}

.form-container :deep(.icon-left),
.form-container :deep(.icon-right) {
  color: #89988f;
  font-size: 14px;
}

.form-container :deep(.base-btn) {
  height: 47px;
  margin-top: 3px;
  border-radius: 8px;
  border-color: var(--green);
  background: var(--green);
  box-shadow: 0 5px 12px rgba(20, 132, 92, .15);
  font-size: 13px;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}

.form-container :deep(.base-btn:hover:not(:disabled)) {
  transform: translateY(-1px);
  border-color: var(--green-deep);
  background: var(--green-deep);
  box-shadow: 0 7px 16px rgba(20, 132, 92, .21);
}

.form-container :deep(.base-btn .btn-text) {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: -8px 0 18px;
  padding: 12px 14px;
  border: 1px solid #f2d7d4;
  border-left: 3px solid #d85a50;
  border-radius: 9px;
  background: linear-gradient(105deg, #fff5f3, #fffaf9);
  color: #a6423c;
  animation: alert-enter .22s ease-out both;
}

.alert-icon {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #f2d1cd;
  border-radius: 8px;
  background: #ffebe8;
  color: #c84e45;
  font-size: 17px;
}

.alert-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.alert-copy strong {
  color: #9f3934;
  font-size: 11px;
  font-weight: 700;
}

@keyframes alert-enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 19px;
  color: #88968e;
  font-size: 10px;
}

.secure-note i {
  color: #39996b;
  font-size: 12px;
}

.support-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 19px;
  color: #849289;
}

.support-icon {
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e0eae3;
  border-radius: 9px;
  background: rgba(255, 255, 255, .75);
  color: #648574;
  font-size: 13px;
}

.support-note p {
  margin: 0;
  font-size: 10px;
  line-height: 1.65;
}

.support-note strong {
  color: #526b5d;
  font-weight: 700;
}

.page-footer {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(1200px, calc(100% - 72px));
  min-height: 55px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 auto;
  border-top: 1px solid rgba(215, 228, 218, .75);
  color: #96a39a;
  font-size: 9px;
}

.page-footer span:last-child {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.page-footer i {
  color: #79a58b;
  font-size: 15px;
}

@media (max-width: 560px) {
  .login-page {
    min-height: 100svh;
  }

  .page-header {
    width: calc(100% - 36px);
    height: 68px;
  }

  .brand-mark {
    width: 35px;
    height: 35px;
    font-size: 17px;
  }

  .brand-name {
    font-size: 16px;
  }

  .back-link {
    font-size: 11px;
  }

  .header-actions {
    gap: 10px;
  }

  .login-content {
    width: min(100% - 30px, 430px);
    justify-content: center;
    margin: 0 auto;
    padding: 25px 0 30px;
  }

  .welcome-note {
    margin-bottom: 15px;
    font-size: 10px;
  }

  .login-card {
    padding: 30px 25px 24px;
    border-radius: 14px;
  }

  .card-top-accent {
    left: 25px;
  }

  .form-heading {
    margin-bottom: 21px;
  }

  .heading-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 15px;
    border-radius: 12px;
  }

  .form-heading h1 {
    font-size: 24px;
  }

  .form-heading p {
    font-size: 11px;
  }

  .desktop-break {
    display: none;
  }

  .form-container {
    gap: 16px;
  }

  .page-footer {
    width: calc(100% - 36px);
    min-height: 48px;
    font-size: 8px;
  }
}

@media (max-width: 360px) {
  .page-header,
  .page-footer {
    width: calc(100% - 28px);
  }

  .login-content {
    width: calc(100% - 24px);
  }

  .login-card {
    padding-right: 19px;
    padding-left: 19px;
  }

  .card-top-accent {
    left: 19px;
  }

  .page-footer span:last-child {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: .01ms !important;
  }
}
</style>
