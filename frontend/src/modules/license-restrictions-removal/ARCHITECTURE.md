# License Restrictions Removal Module

## Overview

This module removes all purchase pressure, upgrade modals, license checks, and feature restrictions from the application. It provides a pass-through implementation for license entitlement checks that always returns `true`.

## Architecture Decisions

### 1. Hook Replacement Pattern

**Decision**: Replace `useLicenseEntitlement` hook with a module hook that always returns true.

**Rationale**:
- Non-invasive: doesn't modify original hook
- Can be toggled via environment variable
- Reusable in components
- Easy to customize behavior

**Implementation**:
- Module intercepts license checks
- Returns "always has entitlement" when active
- Components use module hook instead of original

### 2. Component Removal

**Decision**: Hide/remove components that show upgrade prompts, pricing pages, and license modals.

**Rationale**:
- Users don't see purchase pressure
- Reduces UI clutter
- Improves user experience for self-hosted versions
- Can be toggled per component

**Implementation**:
- Components wrapped with `useShouldRenderLicenseUI()` hook
- Returns false when restrictions removal is active
- Graceful degradation

## Module Structure

```
license-restrictions-removal/
├── ARCHITECTURE.md                  # This file
├── index.ts                         # Module entry point
├── types.ts                         # Type definitions
├── hooks/
│   ├── useLicenseOverride.ts       # Override for license checks
│   ├── useShouldRenderLicenseUI.ts # Control which UI to render
│   └── index.ts                     # Exports
├── config.ts                        # Configuration
└── __tests__/
    └── hooks.test.ts
```

## Usage Examples

### Override License Checks

```tsx
import { useLicenseOverride } from 'src/modules/license-restrictions-removal';

function FeatureComponent() {
  const hasLicense = useLicenseOverride('FEATURE_NAME');
  
  // Always returns true when module is active
  return hasLicense ? <Feature /> : <UpgradePrompt />;
}
```

### Hide License UI

```tsx
import { useShouldRenderLicenseUI } from 'src/modules/license-restrictions-removal';

function Header() {
  const shouldRenderUI = useShouldRenderLicenseUI();
  
  return (
    shouldRenderUI && <UpgradeButton />
  );
}
```

## Configuration

Set environment variable to enable:
```
REACT_APP_REMOVE_LICENSE_RESTRICTIONS=true
```

## Known Limitations

- Doesn't affect backend license validation
- Only affects frontend UI
- License data is still fetched but not used
- Some API features may still be restricted by backend

## Upgrade Checklist

- [ ] Check if new license-gated features are added in main repo
- [ ] Update component wrapper list if new restriction-related components exist
- [ ] Test that all upgrade prompts are properly hidden
- [ ] Verify feature access works correctly
