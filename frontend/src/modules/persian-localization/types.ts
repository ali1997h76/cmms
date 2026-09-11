/**
 * Persian Localization Module - Type Definitions
 *
 * ARCHITECTURE DECISION:
 * Centralized types for Persian localization module
 */

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export type PersianLanguageCode = 'fa' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export interface PersianDateConfig {
  displayFormat: string;
  parseFormat: string;
  useMonthNames: boolean;
}

export interface PersianLocalizationConfig {
  enablePersian: boolean;
  enableJalaliCalendar: boolean;
  defaultLanguage: PersianLanguageCode;
  dateConfig: PersianDateConfig;
}
