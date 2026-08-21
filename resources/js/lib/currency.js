export const formatCurrency = (value) =>
    `${new Intl.NumberFormat('en-ET', { maximumFractionDigits: 2 }).format(Number(value || 0))} ETB`;
