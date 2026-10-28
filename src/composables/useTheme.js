import { ref } from "vue";

const THEME_STORAGE_KEY = "student-management-theme";
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const isDark = ref(storedTheme === "dark");

const applyTheme = () => {
  document.documentElement.dataset.theme = isDark.value ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark.value ? "dark" : "light";
};

applyTheme();

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? "dark" : "light");
    applyTheme();
  };

  return { isDark, toggleTheme };
}
