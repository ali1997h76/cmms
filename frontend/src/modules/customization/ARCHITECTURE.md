# Customization Module

## Overview

This module enables white-labeling and personalization of the Atlas CMMS frontend. It allows customization of app name, logo, colors, links, and other branding elements without modifying core code.

## Architecture Decisions

### 1. Configuration-Driven Customization

**Decision**: Load customization config from environment variables or a runtime config file.

**Rationale**:
- Non-invasive: doesn't modify existing branding system
- Can be changed without code changes
- Composable with existing useBrand hook
- Easy to toggle features

**Implementation**:
- Config file loaded at startup
- Environment variables override config file
- Provides hook to access customization settings
- Components wrapped with customization hook

### 2. Layered Approach

**Decision**: Use "decorator" pattern - wrap existing branding with customization layer.

**Rationale**:
- Original branding system still works
- Customization adds features on top
- No conflicts with main repo updates
- Easy to disable customization

**Implementation**:
- `useCustomization` hook composes with existing brand system
- Customization values override defaults if provided
- Fallback to original values if not customized

### 3. Environment-Based Configuration

**Decision**: Support both .env variables and runtime config.

**Rationale**:
- .env for static environments (Docker, CI/CD)
- Runtime config for dynamic scenarios
- Easy to change between deployments
- No rebuild needed

**Implementation**:
- Check .env variables first
- Fall back to config file
- Runtime API to update settings

## Module Structure

```
customization/
├── ARCHITECTURE.md                  # This file
├── index.ts                         # Module entry point
├── types.ts                         # Type definitions
├── config.ts                        # Config loading logic
├── hooks/
│   ├── useCustomization.ts         # Main customization hook
│   ├── useBrandOverride.ts         # Brand-specific overrides
│   └── index.ts                     # Exports
├── utils/
│   ├── configLoader.ts             # Load config from env/file
│   └── index.ts                     # Exports
└── __tests__/
    └── hooks.test.ts
```

## Usage Examples

### Using Customization Hook

```tsx
import { useCustomization } from 'src/modules/customization';

function Header() {
  const { appName, logoUrl, contactEmail, primaryColor } = useCustomization();
  
  return (
    <header>
      <img src={logoUrl} alt={appName} />
      <h1>{appName}</h1>
      <a href={`mailto:${contactEmail}`}>Contact</a>
    </header>
  );
}
```

### Environment Configuration

```bash
# .env
REACT_APP_CUSTOM_APP_NAME=My CMMS
REACT_APP_CUSTOM_LOGO_URL=/public/logo.png
REACT_APP_CUSTOM_PRIMARY_COLOR=#2196F3
REACT_APP_CUSTOM_CONTACT_EMAIL=support@example.com
REACT_APP_CUSTOM_CONTACT_PHONE=+1-800-EXAMPLE
REACT_APP_CUSTOM_WEBSITE_URL=https://example.com
```

## Configuration Schema

```typescript
interface CustomizationConfig {
  // Branding
  appName: string;                    // App display name
  logoUrl: string;                    // Logo image URL
  faviconUrl: string;                 // Favicon URL
  
  // Colors
  primaryColor: string;               // Primary brand color
  secondaryColor: string;             // Secondary color
  
  // Contact Info
  contactEmail: string;               // Support email
  contactPhone: string;               // Support phone
  contactWebsite: string;             // Support/company website
  
  // Features
  features: {
    hidePricing: boolean;             // Hide pricing page
    hideAbout: boolean;               // Hide about/help pages
    customMenuItems: MenuItemConfig[]; // Additional menu items
  };
}
```

## Known Limitations

- Doesn't affect backend branding validation
- Logo URL must be publicly accessible
- Color changes affect MUI theme only
- Some hardcoded strings in components may not be customizable

## Upgrade Checklist

- [ ] Check if branding system changed in main repo
- [ ] Update customization config schema if needed
- [ ] Test all custom values in new version
- [ ] Verify logo and favicon URLs are still accessible
