/**
 * License Restrictions Removal - Type Definitions
 */

export type LicenseEntitlement =
  | 'BRANDING'
  | 'CUSTOM_FIELDS'
  | 'CALENDAR'
  | 'ANALYTICS'
  | 'PREVENTIVE_MAINTENANCE'
  | 'CHECKLIST'
  | 'PURCHASE_ORDER'
  | 'METER'
  | 'ROLE'
  | 'FILE_UPLOAD'
  | string;

export interface LicenseOverrideConfig {
  enabled: boolean;
  hideAllLicenseUI: boolean;
  allowAllFeatures: boolean;
}
