/**
 * Date utility helpers supporting DD/MM/YYYY and YYYY-MM-DD
 */

export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day, 9, 0, 0);
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 9, 0, 0);
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatDateTime(date: Date): string {
  const datePart = formatDate(date);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  return `${datePart} ${strHours}:${minutes} ${ampm}`;
}

export function diffDays(d1: Date | string, d2: Date | string): number {
  const date1 = typeof d1 === 'string' ? parseDate(d1) : d1;
  const date2 = typeof d2 === 'string' ? parseDate(d2) : d2;
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function addMonths(dateStr: string, months: number): string {
  const date = parseDate(dateStr);
  date.setMonth(date.getMonth() + months);
  return formatDate(date);
}
