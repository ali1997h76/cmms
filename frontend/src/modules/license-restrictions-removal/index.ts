/**
 * License Restrictions Removal Module
 *
 * ARCHITECTURE DECISION:
 * - Provides pass-through license checks that always return "has entitlement"
 * - Hides all license-related UI (upgrade buttons, pricing, etc.)
 * - Non-invasive: doesn't modify original hooks
 * - Can be toggled via environment variable or localStorage
 *
 * WHY THIS APPROACH:
 * - Self-hosted users don't see purchase pressure
 * - Can be toggled at runtime without restart
 * - Components use module hook instead of original
 * - Graceful degradation if module not needed
 *
 * USAGE:
 * Set environment variable:
 * REACT_APP_REMOVE_LICENSE_RESTRICTIONS=true
 *
 * Or toggle at runtime:
 * import { toggleLicenseRestrictionRemoval } from 'src/modules/license-restrictions-removal';
 * toggleLicenseRestrictionRemoval(true);
 */

import { registerModule, type Module } from '../core';
import { useLicenseOverride, useShouldRenderLicenseUI } from './hooks';

export * from './types';
export * from './hooks';

/**
 * License Restrictions Removal Module Definition
 */
const LicenseRestrictionsRemovalModule: Module = {
  name: 'license-restrictions-removal',
  version: '1.0.0',
  description: 'Removes license restrictions and purchase pressure',

  async initialize() {
    const active =
      process.env.REACT_APP_REMOVE_LICENSE_RESTRICTIONS === 'true' ||
      localStorage.getItem('removePermissionRestrictions') === 'true';

    console.log(
      `[License Restrictions Removal] Module initialized - ${
        active ? 'ACTIVE' : 'INACTIVE'
      }`
    );

    if (active) {
      console.log('[License Restrictions Removal] All license checks bypassed');
      console.log('[License Restrictions Removal] License UI will be hidden');
    }
  },

  async cleanup() {
    console.log('[License Restrictions Removal] Module cleaned up');
  }
};

// Auto-register module on import
registerModule(LicenseRestrictionsRemovalModule);

// Export for explicit use
export { LicenseRestrictionsRemovalModule };
