/**
 * Customization Hook
 *
 * ARCHITECTURE DECISION:
 * - Provides memoized customization settings
 * - Loads from environment variables, falls back to defaults
 * - Composes with existing branding system
 */

import { useMemo } from 'react';
import type { CustomizationConfig } from '../types';
import { DEFAULT_CUSTOMIZATION } from '../types';

/**
 * Load customization from environment variables
 */
function loadCustomizationFromEnv(): Partial<CustomizationConfig> {
  return {
    appName: process.env.REACT_APP_CUSTOM_APP_NAME,
    logoUrl: process.env.REACT_APP_CUSTOM_LOGO_URL,
    faviconUrl: process.env.REACT_APP_CUSTOM_FAVICON_URL,
    subtitle: process.env.REACT_APP_CUSTOM_SUBTITLE,

    primaryColor: process.env.REACT_APP_CUSTOM_PRIMARY_COLOR,
    secondaryColor: process.env.REACT_APP_CUSTOM_SECONDARY_COLOR,
    accentColor: process.env.REACT_APP_CUSTOM_ACCENT_COLOR,

    contactEmail: process.env.REACT_APP_CUSTOM_CONTACT_EMAIL,
    contactPhone: process.env.REACT_APP_CUSTOM_CONTACT_PHONE,
    contactWebsite: process.env.REACT_APP_CUSTOM_CONTACT_WEBSITE,
    supportDocumentationUrl: process.env.REACT_APP_CUSTOM_DOCS_URL
  };
}

/**
 * Main customization hook
 */
export const useCustomization = (): CustomizationConfig => {
  return useMemo(() => {
    const envConfig = loadCustomizationFromEnv();

    // Filter out undefined values
    const cleanEnvConfig = Object.fromEntries(
      Object.entries(envConfig).filter(([, value]) => value !== undefined)
    );

    // Merge with defaults
    return {
      ...DEFAULT_CUSTOMIZATION,
      ...cleanEnvConfig
    } as CustomizationConfig;
  }, []);
};

/**
 * Hook to get specific customization value
 */
export const useCustomizationValue = <
  K extends keyof CustomizationConfig
>(
  key: K
): CustomizationConfig[K] => {
  const config = useCustomization();
  return useMemo(() => config[key], [config, key]);
};

/**
 * Hook to check if a feature is enabled
 */
export const useCustomizationFeature = (
  feature: keyof CustomizationConfig['features']
): boolean => {
  const config = useCustomization();
  return useMemo(() => config.features[feature] as unknown as boolean, [
    config.features,
    feature
  ]);
};
