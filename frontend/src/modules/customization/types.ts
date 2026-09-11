/**
 * Customization Module - Type Definitions
 */

export interface CustomizationConfig {
  // Branding
  appName: string;
  logoUrl: string;
  faviconUrl: string;
  subtitle: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Contact Information
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
  supportDocumentationUrl: string;

  // Features
  features: {
    hidePricingPage: boolean;
    hideSubscriptionSection: boolean;
    hideUpgradePrompts: boolean;
    customFooterText: string;
    customHelpLinks: MenuItemConfig[];
  };

  // Social Links
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface MenuItemConfig {
  label: string;
  url: string;
  external: boolean;
  icon?: string;
}

export interface CustomizationContextType {
  config: CustomizationConfig;
  isLoading: boolean;
  error: string | null;
}

// Default configuration
export const DEFAULT_CUSTOMIZATION: CustomizationConfig = {
  appName: 'Atlas CMMS',
  logoUrl: '/static/images/logo.png',
  faviconUrl: '/favicon.ico',
  subtitle: 'Free Open Source CMMS',

  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  accentColor: '#ff6f00',

  contactEmail: 'support@atlas-cmms.com',
  contactPhone: '+1-800-ATLAS-CMMS',
  contactWebsite: 'https://atlas-cmms.com',
  supportDocumentationUrl: 'https://docs.atlas-cmms.com',

  features: {
    hidePricingPage: false,
    hideSubscriptionSection: false,
    hideUpgradePrompts: false,
    customFooterText: '',
    customHelpLinks: []
  },

  socialLinks: {}
};
