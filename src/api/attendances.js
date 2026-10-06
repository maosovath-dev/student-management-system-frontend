import { api } from "./api"; // ឬ path Axios Instance របស់អ្នក

export default {
  // GET ALL ATTENDANCES
  getAll() {
    return api.get("/attendance");
  },

  // GET ATTENDANCE BY ID
  getById(id) {
    return api.get(`/attendance/${id}`);
  },

  // CREATE ATTENDANCE RECORD
  create(data) {
    return api.post("/attendance", data);
  },

  // UPDATE ATTENDANCE RECORD
  update(id, data) {
    return api.put(`/attendance/${id}`, data);
  },

  // DELETE ATTENDANCE RECORD
  delete(id) {
    return api.delete(`/attendance/${id}`);
  },
};