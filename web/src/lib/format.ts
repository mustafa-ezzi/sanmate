export function formatPKR(value: string | number) {
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return `Rs ${value}`
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(n)
}
