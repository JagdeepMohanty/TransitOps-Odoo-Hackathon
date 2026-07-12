import api from './axiosInstance'

const BASE = '/trips'

export const tripsApi = {
  list:     (params)         => api.get(BASE, { params }),
  getById:  (id)             => api.get(`${BASE}/${id}`),
  create:   (payload)        => api.post(BASE, payload),
  update:   (id, payload)    => api.put(`${BASE}/${id}`, payload),
  remove:   (id)             => api.delete(`${BASE}/${id}`),
  dispatch: (id)             => api.post(`${BASE}/${id}/dispatch`),
  complete: (id, payload)    => api.post(`${BASE}/${id}/complete`, payload),
  cancel:   (id)             => api.post(`${BASE}/${id}/cancel`),
}
