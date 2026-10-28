<script setup>
import { useToast } from "@/composables/useToast";

const { toasts, removeToast } = useToast();

const getIcon = (type) => {
  switch (type) {
    case "success": return "bi bi-check-circle-fill";
    case "error": return "bi bi-x-circle-fill";
    case "warning": return "bi bi-exclamation-triangle-fill";
    default: return "bi bi-info-circle-fill";
  }
};
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-fade">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-${toast.type}`]"
          :role="toast.type === 'error' ? 'alert' : 'status'"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <i :class="getIcon(toast.type)" class="toast-icon"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            type="button"
            aria-label="បិទសារជូនដំណឹង"
            @click="removeToast(toast.id)"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: 100%;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-left: 5px solid transparent;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

:global(:root[data-theme="dark"]) .toast-item {
  border-top: 1px solid #34463a;
  border-right: 1px solid #34463a;
  border-bottom: 1px solid #34463a;
  background-color: #1b2920;
  color: #e0eae3;
}

/* Toast Variants */
.toast-success {
  border-left-color: #16834b;
}
.toast-success .toast-icon {
  color: #16834b;
}

.toast-error {
  border-left-color: #dc2626;
}
.toast-error .toast-icon {
  color: #dc2626;
}

.toast-warning {
  border-left-color: #d97706;
}
.toast-warning .toast-icon {
  color: #d97706;
}

.toast-info {
  border-left-color: #2563eb;
}
.toast-info .toast-icon {
  color: #2563eb;
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-message {
  flex-grow: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.toast-close:hover {
  color: #374151;
}

:global(:root[data-theme="dark"]) .toast-close {
  color: #91a397;
}

:global(:root[data-theme="dark"]) .toast-close:hover {
  color: #e1ebe4;
}

/* Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>