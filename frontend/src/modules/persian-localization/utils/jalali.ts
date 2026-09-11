/**
 * Jalali Calendar Utilities
 *
 * DECISION: Implement Jalali ↔ Gregorian conversion at display time only.
 * Database always uses Gregorian dates.
 *
 * Reference: https://en.wikipedia.org/wiki/Jalali_calendar
 */

/**
 * Represents a Jalali date as [year, month, day]
 * Year: 0-based from 622 CE
 * Month: 1-12
 * Day: 1-31
 */
export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Convert Gregorian date to Jalali
 *
 * Based on algorithm from: https://github.com/behnam/persiantools
 */
export function gregorianToJalali(gDate: Date): JalaliDate {
  const gy = gDate.getFullYear();
  const gm = gDate.getMonth() + 1;
  const gd = gDate.getDate();

  let jy: number, jm: number, jd: number;

  const g_d_n =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400) +
    gd;

  const j_d_n = Math.floor(g_d_n - 79);

  jy = -1600 + 400 * Math.floor(j_d_n / 146097);
  j_d_n %= 146097;

  let leap = true;
  if (j_d_n >= 36525) {
    j_d_n--;
    jy += 100 * Math.floor(j_d_n / 36524);
    j_d_n %= 36524;

    if (j_d_n >= 365) j_d_n++;
    leap = false;
  }

  jy += 4 * Math.floor(j_d_n / 1461);
  j_d_n %= 1461;

  if (leap) {
    if (j_d_n >= 366) {
      j_d_n--;
      jy += Math.floor(j_d_n / 365);
      j_d_n = (j_d_n % 365) + 1;
    }
  } else {
    jy += Math.floor(j_d_n / 365);
    j_d_n = (j_d_n % 365) + 1;
  }

  const sal_a = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  jm = 0;
  for (jm = 0; jm < 12; jm++) {
    const v = sal_a[jm];
    if (j_d_n <= v) break;
    j_d_n -= v;
  }

  return {
    year: jy,
    month: jm + 1,
    day: j_d_n
  };
}

/**
 * Convert Jalali date to Gregorian
 */
export function jalaliToGregorian(jDate: JalaliDate): Date {
  const jy = jDate.year;
  const jm = jDate.month;
  const jd = jDate.day;

  let j_d_n =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor((jy % 33 + 3) / 4) +
    jd +
    ((jm - 1) * 30 >= 6
      ? Math.floor((jm - 7) * 30.44) + 186
      : Math.floor((jm - 1) * 30.44));

  const gy = 400 * Math.floor(j_d_n / 146097);
  j_d_n %= 146097;

  let leap = true;
  if (j_d_n >= 36525) {
    j_d_n--;
    const gm = 100 * Math.floor(j_d_n / 36524);
    j_d_n %= 36524;

    if (j_d_n >= 365) j_d_n++;
    const gy2 = gy + gm;
    leap = false;

    const g_d_n =
      gy2 +
      4 * Math.floor(j_d_n / 1461) +
      Math.floor(((j_d_n % 1461) - 1) / 365) +
      j_d_n +
      79;
    return new Date(
      Math.floor(g_d_n / 365.2425),
      0,
      Math.floor(g_d_n % 365.2425)
    );
  } else {
    const g_d_n =
      gy +
      4 * Math.floor(j_d_n / 1461) +
      Math.floor(((j_d_n % 1461) + (leap ? 1 : 0)) / 365.25) +
      j_d_n +
      79;

    const gd = g_d_n + 1;
    const gy2 = Math.floor((gd * 400) / 146097);
    const gm = Math.floor(((gd * 400) % 146097) / 36524);
    const month = Math.floor(((gm % 36524) + 1) / 30.44) + 1;

    return new Date(gy2, month - 1, Math.floor((gd * 400) % 36524) + 1);
  }
}

/**
 * Check if a Jalali year is leap
 */
export function isJalaliLeapYear(year: number): boolean {
  const cycle = year - Math.floor(year / 2820) * 2820;
  return (
    (cycle + 38) * 682 - 110 < Math.floor(((cycle + 38) * 682) % 2816) * 682
  );
}

/**
 * Get number of days in a Jalali month
 */
export function daysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

/**
 * Format Jalali date as string
 * @param format Format string (e.g., "YYYY/MM/DD", "DD MMM YYYY")
 */
export function formatJalaliDate(jDate: JalaliDate, format: string): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const y = String(jDate.year);
  const m = pad(jDate.month);
  const d = pad(jDate.day);

  const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
  ];

  return format
    .replace('YYYY', y)
    .replace('YY', y.slice(-2))
    .replace('MM', m)
    .replace('DD', d)
    .replace('MMM', monthNames[jDate.month - 1]);
}

/**
 * Parse Jalali date string
 * Supports formats: "1402/10/25", "1402-10-25"
 */
export function parseJalaliDate(dateStr: string): JalaliDate | null {
  const match = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
}

/**
 * Get today's date as Jalali
 */
export function getTodayJalali(): JalaliDate {
  return gregorianToJalali(new Date());
}

/**
 * Add days to a Jalali date
 */
export function addDaysToJalali(jDate: JalaliDate, days: number): JalaliDate {
  const gDate = jalaliToGregorian(jDate);
  gDate.setDate(gDate.getDate() + days);
  return gregorianToJalali(gDate);
}

/**
 * Get date difference in days
 */
export function daysUntilJalali(jDate: JalaliDate): number {
  const today = getTodayJalali();
  const todayG = jalaliToGregorian(today);
  const targetG = jalaliToGregorian(jDate);

  const timeDiff = targetG.getTime() - todayG.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Get human-readable Jalali date with month names
 */
export function toDisplayJalaliDate(
  gDate: Date,
  locale: 'fa' | 'en' = 'fa'
): string {
  const jDate = gregorianToJalali(gDate);

  const monthNames = {
    fa: [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند'
    ],
    en: [
      'Farvardin',
      'Ordibehesht',
      'Khordad',
      'Tir',
      'Mordad',
      'Shahrivar',
      'Mehr',
      'Aban',
      'Azar',
      'Dey',
      'Bahman',
      'Esfand'
    ]
  };

  return `${jDate.day} ${monthNames[locale][jDate.month - 1]} ${jDate.year}`;
}
