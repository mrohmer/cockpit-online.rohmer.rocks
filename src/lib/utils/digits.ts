
export const digits = (nbr: number, d = 2): string => nbr > 0 ? String(nbr.toFixed(0)).padStart(d, '0') : '00'
