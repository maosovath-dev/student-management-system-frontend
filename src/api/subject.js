import { api } from "./api";

export default {
  // GET ALL SUBJECTS
  getAll() {
    return api.get("/subjects");
  },

  // GET SUBJECT BY ID
  getById(id) {
    return api.get(`/subjects/${id}`);
  },

  // CREATE SUBJECT
  create(data) {
    return api.post("/subjects", data);
  },

  // UPDATE SUBJECT
  update(id, data) {
    return api.put(`/subjects/${id}`, data);
  },

  // DELETE SUBJECT
  delete(id) {
    return api.delete(`/subjects/${id}`);
  },
};