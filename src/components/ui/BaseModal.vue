<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen" 
        class="base-modal__backdrop"
        role="presentation"
        @click.self="handleBackdropClick"
      >
        <div
          class="base-modal__panel"
          :class="{ 'base-modal__panel--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <!-- Header -->
          <div class="base-modal__header">
            <h3 class="base-modal__title">
              <slot name="title">{{ title }}</slot>
            </h3>
            <button
              type="button"
              class="base-modal__close"
              @click="close" 
              aria-label="Close dialog"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="base-modal__body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  wide: {
    type: Boolean,
    default: false
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.base-modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(3px);
}

.base-modal__panel {
  width: 100%;
  max-width: 28rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 20px 50px rgb(0 0 0 / 25%);
}

.base-modal__panel--wide {
  box-sizing: border-box;
  max-width: 42rem;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.base-modal__title {
  margin: 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 700;
}

.base-modal__close {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  padding: 0.35rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
}

.base-modal__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.base-modal__body {
  margin-top: 0.75rem;
}

.base-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 480px) {
  .base-modal__panel {
    padding: 1.125rem;
  }

  .base-modal__panel--wide {
    max-height: calc(100dvh - 1rem);
    padding: 1rem;
  }
}
</style>