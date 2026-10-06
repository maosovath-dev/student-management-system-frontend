import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/api/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const loading = ref(false);
  const error = ref(null);

  const normalizeUserData = (userData) => {
    if (!userData) return null;
    const avatar = userData.avatar_url || userData.avatar || null;
    return {
      ...userData,
      avatar_url: avatar,
      avatar: avatar,
    };
  };

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/login", { email, password });
      const loginData = response.data?.data || response.data?.user ? response.data?.data || response.data : response.data;
      const authUser = normalizeUserData(loginData?.user || loginData);
      const authToken = loginData?.token || loginData?.accessToken || loginData?.jwt || null;

      if (authToken) {
        token.value = authToken;
        localStorage.setItem("token", authToken);
      }

      if (authUser) {
        user.value = authUser;
        localStorage.setItem("user", JSON.stringify(authUser));
      }

      return loginData;
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/profile");
      let userData = response.data?.data || response.data?.user || response.data;
      userData = normalizeUserData(userData);
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      error.value = err.response?.data?.message || "មិនអាចទាញយក Profile បានទេ!";
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put("/profile", payload);
      let updatedUser = response.data?.data || response.data?.user || response.data;
      updatedUser = normalizeUserData(updatedUser);
      user.value = { ...user.value, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(user.value));
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "កែប្រែព័ត៌មានបរាជ័យ!";
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const changeAvatar = async (file) => {
    loading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const avatarUrl =
        response.data?.avatar_url ||
        response.data?.data?.avatar_url ||
        response.data?.avatarUrl ||
        response.data?.avatar;

      if (user.value && avatarUrl) {
        user.value = {
          ...user.value,
          avatar_url: avatarUrl,
          avatar: avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Upload រូបភាពបរាជ័យ!";
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 🗑️ DELETE AVATAR
  const deleteAvatar = async () => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete("/profile/avatar");
      if (user.value) {
        user.value = {
          ...user.value,
          avatar_url: null,
          avatar: null,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    } catch (err) {
      // បើ Backend គ្មាន DELETE endpoint អាច Fallback អាប់ដេត Profile null avatar
      try {
        await updateProfile({ avatar: null, avatar_url: null });
      } catch {
        error.value = err.response?.data?.message || "លុបរូបភាពបរាជ័យ!";
        throw error.value;
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    token,
    user,
    loading,
    error,
    login,
    fetchProfile,
    updateProfile,
    changeAvatar,
    deleteAvatar,
    logout,
  };
});