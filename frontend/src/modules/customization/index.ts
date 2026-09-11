/**
 * Customization Module
 *
 * ARCHITECTURE DECISION:
 * - Provides white-labeling and personalization capabilities
 * - Loads config from environment variables
 * - Non-invasive: decorates existing branding system
 * - Can be toggled per deployment without code changes
 *
 * WHY THIS APPROACH:
 * - Easy to customize for different customers
 * - No code changes needed for rebranding
 * - Environment-based configuration for CI/CD
 * - Graceful degradation if not configured
 *
 * USAGE:
 * Set environment variables or use useCustomization hook:
 * 
 * import { useCustomization } from 'src/modules/customization';
 * const { appName, logoUrl, primaryColor } = useCustomization();
 */

import { registerModule, type Module } from '../core';
import { useCustomization, useCustomizationValue, useCustomizationFeature } from './hooks';

export * from './types';
export * from './hooks';

/**
 * Customization Module Definition
 */
const CustomizationModule: Module = {
  name: 'customization',
  version: '1.0.0',
  description: 'Enables white-labeling and personalization',

  async initialize() {
    const appName =
      process.env.REACT_APP_CUSTOM_APP_NAME || 'Atlas CMMS (Default)';

    console.log(`[Customization] Module initialized - App: ${appName}`);

    if (process.env.REACT_APP_CUSTOM_LOGO_URL) {
      console.log(
        `[Customization] Custom logo URL: ${process.env.REACT_APP_CUSTOM_LOGO_URL}`
      );
    }

    if (process.env.REACT_APP_CUSTOM_PRIMARY_COLOR) {
      console.log(
        `[Customization] Primary color: ${process.env.REACT_APP_CUSTOM_PRIMARY_COLOR}`
      );
    }
  },

  async cleanup() {
    console.log('[Customization] Module cleaned up');
  }
};

// Auto-register module on import
registerModule(CustomizationModule);

// Export for explicit use
export { CustomizationModule };
