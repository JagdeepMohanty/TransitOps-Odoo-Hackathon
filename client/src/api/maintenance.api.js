import api from './axiosInstance'

const BASE = '/maintenance'

export const maintenanceApi = {
  list:   (params)        => api.get(BASE, { params }),
  create: (payload)       => api.post(BASE, payload),
  update: (id, payload)   => api.put(`${BASE}/${id}`, payload),
  close:  (id, payload)   => api.post(`${BASE}/${id}/close`, payload),
}
