export function formatCurrency(amount: number, locale: 'vi' | 'en' = 'vi'): string {
  if (locale === 'vi') {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  } else {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' });
  }
}

export function formatDate(date: Date, locale: 'vi' | 'en' = 'vi'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (locale === 'vi') {
    return date.toLocaleDateString('vi-VN', options);
  } else {
    return date.toLocaleDateString('en-US', options);
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function parseNumberInput(value: string): number {
  // Remove all non-digit characters except dots
  const cleanValue = value.replace(/[^\d]/g, '');
  return parseInt(cleanValue) || 0;
}