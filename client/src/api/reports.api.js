import api from './axiosInstance'

const BASE = '/reports'

export const reportsApi = {
  // GET /reports?vehicleId=...
  getReports: (params) => api.get(BASE, { params }),

  // GET /reports/export/csv — returns blob
  exportCsv: (params) =>
    api.get(`${BASE}/export/csv`, { params, responseType: 'blob' }),
}
