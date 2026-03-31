import { format } from 'date-fns';

export const formatDate = (date: Date | string | number, fmt = 'yyyy-MM-dd'): string => {
  return format(new Date(date), fmt);
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthStart = (month: string): Date => {
  return new Date(`${month}-01`);
};

export const getMonthEnd = (month: string): Date => {
  const [year, mon] = month.split('-').map(Number);
  return new Date(year, mon, 0);
};

export const parseDate = (str: string): Date | null => {
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
};

