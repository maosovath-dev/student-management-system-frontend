import { api } from "./api";

export default {
  getAll() {
    return api.get("/scores");
  },

  create(data) {
    return api.post("/scores", data);
  },

  update(id, data) {
    return api.put(`/scores/${id}`, data);
  },

  delete(id) {
    return api.delete(`/scores/${id}`);
  },
};
