import api from './axiosInstance'

const BASE = '/fuel-logs'

export const fuelLogsApi = {
  list:   (params)  => api.get(BASE, { params }),
  create: (payload) => api.post(BASE, payload),
}
