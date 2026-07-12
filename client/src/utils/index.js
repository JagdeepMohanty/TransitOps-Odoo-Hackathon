export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n)

export const cn = (...classes) => classes.filter(Boolean).join(' ')
