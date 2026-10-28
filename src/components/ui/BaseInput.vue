<script setup>
import { ref, computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  // v-model Binding
  modelValue: {
    type: [String, Number],
    default: "",
  },
  // Label លើ Input
  label: {
    type: String,
    default: "",
  },
  // Type: 'text', 'password', 'email', 'number', 'date', 'select'
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  // Icon ខាងឆ្វេង (ឧ. 'bi bi-search', 'bi bi-person')
  iconLeft: {
    type: String,
    default: "",
  },
  // Error Message សម្រាប់ Validation
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  // បង្ហាញ Star (*) ពណ៌ក្រហមលើ Label
  showRequiredStar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

// Toggle លាក់/បង្ហាញ Password
const showPassword = ref(false);
const inputRef = ref(null);

const computedType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

defineExpose({ inputRef });
</script>

<template>
  <div :class="['input-group', { 'has-error': error, disabled }]">
    <!-- Label -->
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required || showRequiredStar" class="required-star">*</span>
    </label>

    <div class="input-wrapper">
      <!-- Icon ខាងឆ្វេង -->
      <i v-if="iconLeft" :class="[iconLeft, 'icon-left']"></i>

      <!-- Input Field -->
      <input
        ref="inputRef"
        v-bind="$attrs"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'base-input',
          { 'has-icon-left': iconLeft, 'has-icon-right': type === 'password' }
        ]"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <!-- Toggle Eye Icon សម្រាប់ Password -->
      <i
        v-if="type === 'password'"
        :class="[
          showPassword ? 'bi bi-eye-slash' : 'bi bi-eye',
          'icon-right',
          'password-toggle'
        ]"
        @click="showPassword = !showPassword"
      ></i>
    </div>

    <!-- Error Message -->
    <span v-if="error" class="error-message">
      <i class="bi bi-exclamation-circle me-1"></i> {{ error }}
    </span>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  user-select: none;
}

.required-star {
  color: #dc2626;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.base-input {
  width: 100%;
  height: 40px;
  padding: 8px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.base-input::placeholder {
  color: #9ca3af;
}

/* Hover & Focus States (Green Theme) */
.base-input:hover:not(:disabled) {
  border-color: #9ca3af;
}

.base-input:focus:not(:disabled) {
  border-color: #16834b;
  box-shadow: 0 0 0 3px rgba(22, 131, 75, 0.15);
}

/* Padding នៅពេលមាន Icons */
.has-icon-left {
  padding-left: 38px;
}

.has-icon-right {
  padding-right: 38px;
}

/* Icon Styles */
.icon-left {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #6b7280;
  pointer-events: none;
}

.icon-right {
  position: absolute;
  right: 12px;
  font-size: 16px;
  color: #6b7280;
}

.password-toggle {
  cursor: pointer;
  transition: color 0.15s ease;
}

.password-toggle:hover {
  color: #16834b;
}

/* Error State */
.has-error .base-input {
  border-color: #dc2626;
}

.has-error .base-input:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.error-message {
  font-size: 12px;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Disabled State */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled .base-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>