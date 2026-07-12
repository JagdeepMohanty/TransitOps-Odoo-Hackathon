import { reportsApi } from '@/api/reports.api'

export async function downloadVehicleReportCsv(params = {}) {
  const res = await reportsApi.exportCsv(params)
  const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'transitops-vehicle-report.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
