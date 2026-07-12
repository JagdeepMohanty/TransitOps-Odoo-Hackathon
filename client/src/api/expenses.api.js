import api from './axiosInstance'

const BASE = '/expenses'

export const expensesApi = {
  list:   (params)  => api.get(BASE, { params }),
  create: (payload) => api.post(BASE, payload),
}
