import api from './axiosInstance';

const BASE = '/drivers';

export const driversApi = {
  getAll:       (params) => api.get(BASE, { params }),
  getById:      (id)     => api.get(`${BASE}/${id}`),
  getAvailable: ()       => api.get(`${BASE}/available`),
  create:       (data)   => api.post(BASE, data),
  update:       (id, data) => api.put(`${BASE}/${id}`, data),
  remove:       (id)     => api.delete(`${BASE}/${id}`),
};
