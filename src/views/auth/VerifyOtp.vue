<template>
  <div class="verify-page">
    <div class="verify-card shadow-lg">
      <!-- HEADER -->
      <div class="text-center mb-4">
        <div class="icon-circle mb-3">
          <i class="bi bi-shield-check"></i>
        </div>
        <h2 class="verify-title">ផ្ទៀងផ្ទាត់លេខកូដ OTP</h2>
        <p class="verify-subtitle">
          យើងបានផ្ញើលេខកូដ 6 ខ្ទង់ទៅកាន់អ៊ីមែលរបស់អ្នក
          <strong v-if="email" class="user-email d-block mt-1">{{ email }}</strong>
        </p>
      </div>

      <!-- ALERTS -->
      <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        <div>{{ errorMessage }}</div>
      </div>

      <div v-if="successMessage" class="alert alert-success d-flex align-items-center mb-4" role="alert">
        <i class="bi bi-check-circle-fill me-2 fs-5"></i>
        <div>{{ successMessage }}</div>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleVerify">
        <!-- 6-DIGIT OTP INPUTS -->
        <div class="otp-container mb-4">
          <div class="otp-group">
            <input
              v-for="(digit, index) in 3"
              :key="'first-' + index"
              :ref="el => inputRefs[index] = el"
              v-model="digits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-box"
              :class="{ 'filled': digits[index], 'is-invalid': hasError }"
              @input="onInput(index, $event)"
              @keydown="onKeyDown(index, $event)"
              @paste="onPaste"
            />
          </div>

          <div class="otp-divider">•</div>

          <div class="otp-group">
            <input
              v-for="(digit, index) in 3"
              :key="'second-' + (index + 3)"
              :ref="el => inputRefs[index + 3] = el"
              v-model="digits[index + 3]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-box"
              :class="{ 'filled': digits[index + 3], 'is-invalid': hasError }"
              @input="onInput(index + 3, $event)"
              @keydown="onKeyDown(index + 3, $event)"
              @paste="onPaste"
            />
          </div>
        </div>

        <!-- COUNTDOWN TIMER -->
        <div class="timer-section text-center mb-4">
          <div v-if="countdown > 0" class="timer-pill">
            <i class="bi bi-stopwatch me-1"></i>
            កូដផុតកំណត់ក្នុងរយៈពេល: <strong>{{ formattedCountdown }}</strong>
          </div>
          <div v-else class="timer-expired text-danger">
            <i class="bi bi-clock-history me-1"></i>
            លេខកូដបានផុតកំណត់ហើយ! សូមស្នើសុំកូដថ្មី។
          </div>
        </div>

        <!-- SUBMIT BUTTON -->
        <button
          type="submit"
          class="btn btn-primary verify-btn w-100 mb-3"
          :disabled="isSubmitting || fullOtp.length !== 6"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check2-circle me-2"></i>
          ផ្ទៀងផ្ទាត់ឥឡូវនេះ
        </button>

        <!-- RESEND OTP -->
        <div class="text-center">
          <button
            type="button"
            class="btn btn-link resend-link"
            :disabled="resendCooldown > 0 || isResending"
            @click="handleResend"
          >
            <span v-if="isResending" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-arrow-repeat me-1"></i>
            {{ resendCooldown > 0 ? `ផ្ញើកូដម្ដងទៀត (${resendCooldown}s)` : 'ផ្ញើកូដ OTP ម្ដងទៀត' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/api/api';

const route = useRoute();
const router = useRouter();

const email = ref(route.query.email || '');
const digits = ref(['', '', '', '', '', '']);
const inputRefs = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const hasError = ref(false);
const isSubmitting = ref(false);
const isResending = ref(false);

// 5-minute countdown for OTP validity
const countdown = ref(300);
let timerInterval = null;

// 60-second cooldown for resend button
const resendCooldown = ref(60);
let resendInterval = null;

const fullOtp = computed(() => digits.value.join(''));

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const onInput = (index, event) => {
  const val = event.target.value.replace(/[^0-9]/g, '');
  digits.value[index] = val ? val[0] : '';
  hasError.value = false;
  errorMessage.value = '';

  if (val && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }

  if (fullOtp.value.length === 6) {
    handleVerify();
  }
};

const onKeyDown = (index, event) => {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      inputRefs.value[index - 1]?.focus();
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const onPaste = (event) => {
  event.preventDefault();
  const pasteData = event.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
  if (!pasteData) return;

  for (let i = 0; i < 6; i++) {
    digits.value[i] = pasteData[i] || '';
  }

  const nextFocus = Math.min(pasteData.length, 5);
  inputRefs.value[nextFocus]?.focus();

  if (pasteData.length >= 6) {
    handleVerify();
  }
};

const startTimers = () => {
  countdown.value = 300;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);

  resendCooldown.value = 60;
  clearInterval(resendInterval);
  resendInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(resendInterval);
    }
  }, 1000);
};

const handleVerify = async () => {
  if (fullOtp.value.length !== 6 || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  hasError.value = false;

  try {
    const res = await api.post('/api/auth/verify-email', {
      email: email.value,
      otpCode: fullOtp.value
    });

    successMessage.value = res.data?.message || 'ផ្ទៀងផ្ទាត់បានជោគជ័យ!';
    if (res.data?.setupToken) {
      sessionStorage.setItem('setupToken', res.data.setupToken);
      setTimeout(() => {
        router.push({
          path: '/set-password',
          query: { token: res.data.setupToken }
        });
      }, 1200);
    }
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'លេខកូដមិនត្រឹមត្រូវ ឬផុតកំណត់ហើយ!';
  } finally {
    isSubmitting.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0 || isResending.value) return;

  if (!email.value) {
    errorMessage.value = 'សូមបញ្ជាក់អ៊ីមែលជាមុនសិន';
    return;
  }

  isResending.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const res = await api.post('/api/auth/resend-otp', {
      email: email.value
    });

    successMessage.value = res.data?.message || 'លេខកូដ OTP ថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នកហើយ!';
    digits.value = ['', '', '', '', '', ''];
    inputRefs.value[0]?.focus();
    startTimers();
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'មិនអាចផ្ញើលេខកូដម្ដងទៀតបានទេ។';
  } finally {
    isResending.value = false;
  }
};

onMounted(() => {
  inputRefs.value[0]?.focus();
  startTimers();
});

onUnmounted(() => {
  clearInterval(timerInterval);
  clearInterval(resendInterval);
});
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 50% 10%, #dcfce7 0%, #f0fdf4 40%, #f5f9f7 100%);
}

.verify-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border: 1px solid #d1fae5;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px -15px rgba(22, 163, 74, 0.12);
}

.icon-circle {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  background: #ecfdf5;
  border: 2px solid #a7f3d0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 32px;
  box-shadow: 0 8px 16px -4px rgba(22, 163, 74, 0.15);
}

.verify-title {
  color: #14532d;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.verify-subtitle {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 0;
}

.user-email {
  color: #16a34a;
  font-weight: 600;
}

.otp-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.otp-group {
  display: flex;
  gap: 8px;
}

.otp-divider {
  color: #86efac;
  font-size: 24px;
  font-weight: bold;
}

.otp-box {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #15803d;
  background: #f8fafc;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.otp-box:focus {
  background: #ffffff;
  border-color: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
  transform: translateY(-2px);
}

.otp-box.filled {
  background: #f0fdf4;
  border-color: #16a34a;
}

.otp-box.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.timer-pill {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
}

.verify-btn {
  background: #16a34a;
  border-color: #16a34a;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.verify-btn:hover:not(:disabled) {
  background: #15803d;
  border-color: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
}

.verify-btn:disabled {
  background: #94a3b8;
  border-color: #94a3b8;
  opacity: 0.7;
}

.resend-link {
  color: #16a34a;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.resend-link:hover:not(:disabled) {
  color: #15803d;
  text-decoration: underline;
}

.resend-link:disabled {
  color: #94a3b8;
}

@media (max-width: 480px) {
  .verify-card {
    padding: 28px 20px;
  }
  .otp-box {
    width: 40px;
    height: 52px;
    font-size: 22px;
  }
  .otp-container {
    gap: 8px;
  }
  .otp-group {
    gap: 6px;
  }
}
</style>
