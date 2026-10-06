import { api } from "./api";

// 1. ទាញយកព័ត៌មាន Profile
export const getProfileApi = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// 2. កែប្រែព័ត៌មាន Profile (Name, Phone, etc.)
export const updateProfileApi = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

// 3. ប្តូរ Avatar (Upload File)
export const updateAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file); // Key "avatar" ត្រូវឲ្យត្រូវតាម Backend Target

  const response = await api.post("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};