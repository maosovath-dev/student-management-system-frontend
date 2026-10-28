import { ref } from "vue";

const toasts = ref([]);
let nextToastId = 0;

export function useToast() {
  const showToast = (message, type = "success", duration = 3500) => {
    const id = ++nextToastId;
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
}