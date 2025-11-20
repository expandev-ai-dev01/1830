/**
 * @utility formatCurrency
 * @summary Formats a number as Brazilian Real currency.
 * @domain core
 * @type utility-function
 * @category formatting
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
