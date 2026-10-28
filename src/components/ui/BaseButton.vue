<script setup>
defineProps({
  // ប្រភេទ Button: 'primary', 'secondary', 'danger', 'outline', 'ghost'
  variant: {
    type: String,
    default: "primary",
  },
  // ទំហំ Button: 'sm', 'md', 'lg'
  size: {
    type: String,
    default: "md",
  },
  // ប្រភេទ HTML Button: 'button', 'submit', 'reset'
  type: {
    type: String,
    default: "button",
  },
  // បង្ហាញ Loading Spinner
  loading: {
    type: Boolean,
    default: false,
  },
  // បិទមិនឱ្យចុច
  disabled: {
    type: Boolean,
    default: false,
  },
  // បង្ហាញ Icon ខាងឆ្វេង (ឧទាហរណ៍៖ 'bi bi-plus-lg')
  icon: {
    type: String,
    default: "",
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
  iconTone: {
    type: String,
    default: "neutral",
    validator: (value) => ["neutral", "view", "edit", "delete"].includes(value),
  },
  // ពង្រីកទំហំពេញ Width (100%)
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>

<template>
  <button
    :type="type"
    :class="[
      'base-btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'is-loading': loading,
        'full-width': fullWidth,
        'is-icon-only': iconOnly,
        [`icon-tone-${iconTone}`]: iconOnly,
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click',$event)"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="spinner"></span>

    <!-- Icon ខាងឆ្វេង -->
    <i v-if="icon && !loading" :class="[icon, 'btn-icon']" aria-hidden="true"></i>

    <!-- អត្ថបទ/Content របស់ Button -->
    <span v-if="!iconOnly" class="btn-text">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  white-space: nowrap;
  user-select: none;
}

/* -------------------------------------------------------------
   SIZES
------------------------------------------------------------- */
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  height: 32px;
}

.btn-md {
  padding: 8px 16px;
  font-size: 13px;
  height: 40px;
}

.btn-lg {
  padding: 10px 20px;
  font-size: 15px;
  height: 48px;
}

.full-width {
  width: 100%;
}

/* -------------------------------------------------------------
   VARIANTS (THEME COLORS)
------------------------------------------------------------- */
/* Primary (Green Theme) */
.btn-primary {
  background-color: #16834b;
  color: #ffffff;
  border-color: #16834b;
}

.btn-primary:hover:not(:disabled) {
  background-color: #126b3d;
  border-color: #126b3d;
  box-shadow: 0 4px 12px rgba(22, 131, 75, 0.2);
}

/* Secondary */
.btn-secondary {
  background-color: #f0f4f2;
  color: #1b2d25;
  border-color: #dfe8e3;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e3f4ea;
  color: #16834b;
}

/* Danger (Delete/Cancel) */
.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

/* Outline */
.btn-outline {
  background-color: transparent;
  color: #16834b;
  border-color: #16834b;
}

.btn-outline:hover:not(:disabled) {
  background-color: #e3f4ea;
}

/* Ghost */
.btn-ghost {
  background-color: transparent;
  color: #52625a;
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background-color: #f0f4f2;
  color: #1b2d25;
}

/* -------------------------------------------------------------
   STATES (Disabled & Loading)
------------------------------------------------------------- */
.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-icon {
  font-size: 1.1em;
}

.is-icon-only {
  width: 36px;
  min-width: 36px;
  height: 36px;
  padding: 0;
  gap: 0;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 14px;
}

.is-icon-only .btn-icon {
  margin: 0;
  font-size: 14px;
}

.icon-tone-neutral {
  border-color: #e2e8e4;
  background: #f7f9f8;
  color: #52625a;
}

.icon-tone-neutral:hover:not(:disabled) {
  background: #edf2ef;
}

.icon-tone-view {
  border-color: #d8e7f4;
  background: #f1f7fc;
  color: #356b9a;
}

.icon-tone-view:hover:not(:disabled) {
  background: #e2eff9;
}

.icon-tone-edit {
  border-color: #d6eadc;
  background: #f0f8f2;
  color: #16834b;
}

.icon-tone-edit:hover:not(:disabled) {
  background: #e2f3e7;
}

.icon-tone-delete {
  border-color: #f1dada;
  background: #fff5f5;
  color: #b8333e;
}

.icon-tone-delete:hover:not(:disabled) {
  background: #fee8e8;
}

.is-icon-only:focus-visible {
  outline: 3px solid rgba(22, 131, 75, 0.24);
  outline-offset: 2px;
}

/* Loading Spinner Animation */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.8s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>