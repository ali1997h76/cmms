/**
 * Persian Date Locale for date-fns
 *
 * Provides Persian language support for date-fns library
 * Used in DatePickers and date formatting
 *
 * ARCHITECTURE DECISION:
 * Display dates in Jalali calendar format but keep internal representation as Gregorian
 */

export const persianLocale = {
  code: 'fa',
  formatDistance: (
    token: string,
    count: number,
    options?: { addSuffix?: boolean; comparison?: 'before' | 'after' }
  ) => {
    const suffixes: Record<string, [string, string]> = {
      lessThanXSeconds: ['کمتر از یک ثانیه', 'کمتر از یک ثانیه'],
      xSeconds: [
        `${count} ثانیه`,
        `${count} ثانیه`
      ],
      halfAMinute: ['نیم دقیقه', 'نیم دقیقه'],
      lessThanXMinutes: [`کمتر از ${count} دقیقه`, `کمتر از ${count} دقیقه`],
      xMinutes: [`${count} دقیقه`, `${count} دقیقه`],
      aboutXHours: [`حدود ${count} ساعت`, `حدود ${count} ساعت`],
      xHours: [`${count} ساعت`, `${count} ساعت`],
      xDays: [`${count} روز`, `${count} روز`],
      aboutXWeeks: [`حدود ${count} هفته`, `حدود ${count} هفته`],
      xWeeks: [`${count} هفته`, `${count} هفته`],
      aboutXMonths: [`حدود ${count} ماه`, `حدود ${count} ماه`],
      xMonths: [`${count} ماه`, `${count} ماه`],
      aboutXYears: [`حدود ${count} سال`, `حدود ${count} سال`],
      xYears: [`${count} سال`, `${count} سال`],
      overXYears: [`بیش از ${count} سال`, `بیش از ${count} سال`],
      almostXYears: [`تقریباً ${count} سال`, `تقریباً ${count} سال`]
    };

    const suffixesObj = suffixes[token as keyof typeof suffixes];
    if (!suffixesObj) return token;

    const index = options?.comparison === 'before' ? 0 : 1;
    const suffix = suffixesObj[index];

    if (options?.addSuffix) {
      if (options.comparison === 'before') {
        return `${suffix} پیش`;
      } else {
        return `در ${suffix}`;
      }
    }

    return suffix;
  },

  formatLong: {
    date: () => 'yyyy/MM/dd',
    time: () => 'HH:mm:ss',
    dateTime: () => 'yyyy/MM/dd HH:mm:ss'
  },

  formatRelative: (token: string) => {
    const formats: Record<string, string> = {
      lastWeek: "'هفتهٔ قبل' eeee 'ساعت' p",
      yesterday: "'دیروز ساعت' p",
      today: "'امروز ساعت' p",
      tomorrow: "'فردا ساعت' p",
      nextWeek: "eeee 'ساعت' p",
      other: 'yyyy/MM/dd'
    };

    return formats[token] || formats.other;
  },

  localize: {
    ordinalNumber: (dirtyNumber: number | string) => {
      const number = typeof dirtyNumber === 'string' ? parseInt(dirtyNumber, 10) : dirtyNumber;
      return number.toString();
    },

    era: (options?: { width?: 'abbreviated' | 'narrow' | 'wide' }) => {
      const eras: Record<string, Record<string, string>> = {
        abbreviated: { 0: 'ق.م', 1: 'م' },
        narrow: { 0: 'ق', 1: 'م' },
        wide: { 0: 'قبل از میلاد', 1: 'میلادی' }
      };
      const width = options?.width || 'wide';
      return (dirtyIndex: number) => eras[width][dirtyIndex];
    },

    quarter: (options?: { width?: 'abbreviated' | 'narrow' | 'wide' }) => {
      const quarters: Record<string, Record<string, string>> = {
        abbreviated: {
          0: 'س۱',
          1: 'س۲',
          2: 'س۳',
          3: 'س۴'
        },
        narrow: { 0: '۱', 1: '۲', 2: '۳', 3: '۴' },
        wide: {
          0: 'سه‌ماههٔ اول',
          1: 'سه‌ماههٔ دوم',
          2: 'سه‌ماههٔ سوم',
          3: 'سه‌ماههٔ چهارم'
        }
      };
      const width = options?.width || 'wide';
      return (dirtyIndex: number) => quarters[width][dirtyIndex];
    },

    month: (options?: { width?: 'abbreviated' | 'narrow' | 'wide' }) => {
      const months: Record<string, Record<string, string>> = {
        abbreviated: {
          0: 'فروردین',
          1: 'اردیبهشت',
          2: 'خرداد',
          3: 'تیر',
          4: 'مرداد',
          5: 'شهریور',
          6: 'مهر',
          7: 'آبان',
          8: 'آذر',
          9: 'دی',
          10: 'بهمن',
          11: 'اسفند'
        },
        narrow: {
          0: 'ف',
          1: 'ا',
          2: 'خ',
          3: 'ت',
          4: 'م',
          5: 'ش',
          6: 'م',
          7: 'آ',
          8: 'آ',
          9: 'د',
          10: 'ب',
          11: 'ا'
        },
        wide: {
          0: 'فروردین',
          1: 'اردیبهشت',
          2: 'خرداد',
          3: 'تیر',
          4: 'مرداد',
          5: 'شهریور',
          6: 'مهر',
          7: 'آبان',
          8: 'آذر',
          9: 'دی',
          10: 'بهمن',
          11: 'اسفند'
        }
      };
      const width = options?.width || 'wide';
      return (dirtyIndex: number) => months[width][dirtyIndex];
    },

    day: (options?: { width?: 'abbreviated' | 'narrow' | 'wide' }) => {
      const days: Record<string, Record<string, string>> = {
        abbreviated: {
          0: 'شنبه',
          1: 'یکشنبه',
          2: 'دوشنبه',
          3: 'سه‌شنبه',
          4: 'چهارشنبه',
          5: 'پنج‌شنبه',
          6: 'جمعه'
        },
        narrow: { 0: 'ش', 1: 'ی', 2: 'د', 3: 'س', 4: 'چ', 5: 'پ', 6: 'ج' },
        wide: {
          0: 'شنبه',
          1: 'یکشنبه',
          2: 'دوشنبه',
          3: 'سه‌شنبه',
          4: 'چهارشنبه',
          5: 'پنج‌شنبه',
          6: 'جمعه'
        }
      };
      const width = options?.width || 'wide';
      return (dirtyIndex: number) => days[width][dirtyIndex];
    },

    dayPeriod: (
      options?: { width?: 'abbreviated' | 'narrow' | 'wide' }
    ) => {
      const dayPeriods: Record<string, Record<string, string>> = {
        abbreviated: { am: 'ق.ظ', pm: 'ب.ظ' },
        narrow: { am: 'ق', pm: 'ب' },
        wide: { am: 'قبل‌ازظهر', pm: 'بعدازظهر' }
      };
      const width = options?.width || 'wide';
      return (dirtyIndex: string) => dayPeriods[width][dirtyIndex];
    }
  },

  match: {
    ordinalNumber: () => null,
    era: () => null,
    quarter: () => null,
    month: () => null,
    day: () => null,
    dayPeriod: () => null
  },

  options: {
    weekStartsOn: 6 // Saturday
  }
};
