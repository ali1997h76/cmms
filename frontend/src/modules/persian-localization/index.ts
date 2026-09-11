/**
 * Persian Localization Module
 *
 * ARCHITECTURE DECISION:
 * - Module provides Jalali calendar and Persian language support
 * - All date conversions happen at display time, not in database
 * - Registers itself with ModuleRegistry on import
 *
 * WHY THIS APPROACH:
 * - Non-intrusive to existing codebase
 * - Can be enabled/disabled independently
 * - Easy to upgrade when main repo updates
 * - Performance optimized with memoized hooks
 *
 * USAGE:
 * Simply import this module, then use hooks in components:
 * import { usePersianDate, useDirection } from 'src/modules/persian-localization';
 */

import { registerModule, type Module } from '../core';
import { usePersianDate, usePersianLanguage, useDirection } from './hooks';

export * from './types';
export * from './hooks';
export * from './utils';

/**
 * Persian Localization Module Definition
 */
const PersianLocalizationModule: Module = {
  name: 'persian-localization',
  version: '1.0.0',
  description: 'Adds Persian language and Jalali calendar support',

  async initialize() {
    console.log(
      '[Persian Localization] Module initialized - Jalali calendar ready'
    );
  },

  async cleanup() {
    console.log('[Persian Localization] Module cleaned up');
  }
};

// Auto-register module on import
registerModule(PersianLocalizationModule);

// Export for explicit use
export { PersianLocalizationModule };
