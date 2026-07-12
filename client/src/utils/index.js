export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount ?? 0)

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n)

export const cn = (...classes) => classes.filter(Boolean).join(' ')
