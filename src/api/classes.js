import { api } from "./api";

const classApi = {
  // GET /classes
  getAll() {
    return api.get("/classes");
  },

  // GET /classes/:id
  getById(id) {
    return api.get(`/classes/${id}`);
  },

  // POST /classes
  create(data) {
    return api.post("/classes", data);
  },

  // PUT /classes/:id
  update(id, data) {
    return api.put(`/classes/${id}`, data);
  },

  // DELETE /classes/:id
  delete(id) {
    return api.delete(`/classes/${id}`);
  },
};

export default classApi;