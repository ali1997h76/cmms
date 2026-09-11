/**
 * License Override Hook
 *
 * ARCHITECTURE DECISION:
 * - Always returns true for license checks when module is active
 * - Non-intrusive: components can use this hook instead of useLicenseEntitlement
 * - Can be configured via environment or context
 */

import { useMemo } from 'react';
import type { LicenseEntitlement } from '../types';

const isModuleActive = (): boolean => {
  const env = process.env.REACT_APP_REMOVE_LICENSE_RESTRICTIONS === 'true';
  const localStorage = globalThis.localStorage?.getItem(
    'removePermissionRestrictions'
  ) === 'true';
  return env || localStorage;
};

/**
 * Hook to check if a license entitlement is available
 * Always returns true when module is active
 */
export const useLicenseOverride = (
  entitlement: LicenseEntitlement
): boolean => {
  return useMemo(() => {
    if (!isModuleActive()) {
      // Module not active, return false (let original hook handle it)
      return false;
    }

    // Module active: return true for all entitlements
    console.debug(
      `[License Override] Granting entitlement: ${entitlement}`
    );
    return true;
  }, [entitlement]);
};

/**
 * Hook to check if license UI should be rendered
 * Returns false when module is active (hide all license UI)
 */
export const useShouldRenderLicenseUI = (): boolean => {
  return useMemo(() => {
    const shouldHide = isModuleActive();
    return !shouldHide;
  }, []);
};

/**
 * Hook to check if module is active
 */
export const useLicenseRestrictionRemovalActive = (): boolean => {
  return useMemo(() => isModuleActive(), []);
};

/**
 * Helper to enable/disable the module at runtime
 */
export const toggleLicenseRestrictionRemoval = (enabled: boolean): void => {
  if (enabled) {
    localStorage.setItem('removePermissionRestrictions', 'true');
  } else {
    localStorage.removeItem('removePermissionRestrictions');
  }

  // Trigger re-render of dependent components
  window.dispatchEvent(
    new CustomEvent('licenseRestrictionRemovalToggled', { detail: { enabled } })
  );
};
