/**
 * Persian Date Localization Hook
 * 
 * ARCHITECTURE DECISION:
 * - Provides memoized utilities for Jalali date operations
 * - All conversions happen at display time, not in database
 * - Database always stores Gregorian dates
 */

import { useMemo } from 'react';
import {
  gregorianToJalali,
  jalaliToGregorian,
  formatJalaliDate,
  parseJalaliDate,
  getTodayJalali,
  addDaysToJalali,
  daysUntilJalali,
  toDisplayJalaliDate,
  type JalaliDate
} from '../utils/jalali';

export interface PersianDateUtils {
  /**
   * Convert Gregorian date to Jalali
   */
  toJalali: (date: Date) => JalaliDate;

  /**
   * Convert Jalali date to Gregorian
   */
  toGregorian: (jDate: JalaliDate) => Date;

  /**
   * Format Jalali date with custom format string
   */
  format: (date: Date, format?: string) => string;

  /**
   * Get human-readable Jalali date with month names
   */
  toDisplay: (date: Date, locale?: 'fa' | 'en') => string;

  /**
   * Parse Jalali date string (e.g., "1402/10/25")
   */
  parse: (dateStr: string) => JalaliDate | null;

  /**
   * Get today as Jalali date
   */
  getToday: () => JalaliDate;

  /**
   * Add days to a Jalali date
   */
  addDays: (jDate: JalaliDate, days: number) => JalaliDate;

  /**
   * Get days until a specific Jalali date
   */
  daysUntil: (jDate: JalaliDate) => number;
}

/**
 * Hook for Persian date utilities
 * Returns memoized object to prevent unnecessary re-renders
 */
export const usePersianDate = (): PersianDateUtils => {
  return useMemo<PersianDateUtils>(
    () => ({
      toJalali: gregorianToJalali,
      toGregorian: jalaliToGregorian,
      format: (date: Date, format = 'YYYY/MM/DD') =>
        formatJalaliDate(gregorianToJalali(date), format),
      toDisplay: (date: Date, locale = 'fa') =>
        toDisplayJalaliDate(date, locale),
      parse: parseJalaliDate,
      getToday: getTodayJalali,
      addDays: addDaysToJalali,
      daysUntil: daysUntilJalali
    }),
    []
  );
};

/**
 * Hook to check if Persian language is active
 */
export const usePersianLanguage = () => {
  const { i18n } = require('react-i18next');
  return useMemo(
    () => ({
      isPersian: i18n.language === 'fa',
      currentLanguage: i18n.language
    }),
    [i18n.language]
  );
};

/**
 * Hook for text direction based on language
 */
export const useDirection = () => {
  const { isPersian } = usePersianLanguage();
  return useMemo(
    () => ({
      direction: isPersian ? 'rtl' : 'ltr',
      isRTL: isPersian
    }),
    [isPersian]
  );
};
