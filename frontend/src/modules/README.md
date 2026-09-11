# Custom Modules System

This directory contains modular extensions to the Atlas CMMS frontend that are designed to be **upgrade-safe** and **maintainable** without modifying the core codebase.

## Architecture Philosophy

### Why Modules?

The Atlas CMMS team regularly updates the frontend. Without a modular system, custom changes would conflict with these updates, requiring manual reconciliation every time. This module system ensures:

1. **Separation of Concerns**: Custom features are isolated in dedicated modules
2. **Override Pattern**: Modules override/enhance default behavior without modifying originals
3. **Upgrade Safe**: When the main codebase is updated, these modules continue to work
4. **Maintainability**: Changes are tracked and documented in one place
5. **Extensibility**: Easy to add new modules or enhance existing ones

### Module Structure

Each module follows this pattern:

```
module-name/
  ├── ARCHITECTURE.md         # Design decisions and rationale
  ├── index.ts               # Main entry point
  ├── types.ts               # TypeScript types/interfaces
  ├── hooks/                 # React hooks
  ├── components/            # React components
  ├── utils/                 # Utility functions
  ├── services/              # Services (API calls, etc.)
  └── [domain]/              # Domain-specific code
```

### How Modules Work

1. **Registration**: Modules register themselves in the ModuleRegistry
2. **Initialization**: Modules initialize when app loads
3. **Hooks**: Components use module-specific hooks to access functionality
4. **Overrides**: Module hooks intercept and modify default behavior
5. **Composition**: Multiple modules can work together without conflicts

## Available Modules

### 1. Persian Localization Module
**Path**: `./persian-localization/`

Adds full Persian language support with:
- Jalali calendar conversion (dates shown as Persian, stored as Gregorian)
- Persian/Farsi language translations
- RTL (Right-to-Left) layout support
- Persian date formatting utilities

**Decision**: Uses format conversion layer rather than storing Persian dates in DB to ensure compatibility with backend APIs.

### 2. License Restrictions Removal Module
**Path**: `./license-restrictions-removal/`

Removes purchase/upgrade pressures by:
- Disabling license validity checks
- Removing upgrade modals and notifications
- Hiding restricted feature warnings
- Always returning "has entitlement" for all checks

**Decision**: Provides a hook that acts as pass-through for all license checks, allowing overrides without modifying `useLicenseEntitlement` directly.

### 3. Customization Module
**Path**: `./customization/`

Enables white-labeling and personalization:
- Custom app name and branding
- Custom logos and colors
- Custom links and contact information
- Custom feature sets

**Decision**: Loads config from environment variables or runtime config, composing with existing brand system rather than replacing it.

## Integration Points

### In App.tsx

Modules are initialized through the `ModuleRegistry`:

```tsx
import { initializeModules } from 'src/modules';

// In App component
useEffect(() => {
  initializeModules();
}, []);
```

### In index.tsx

Module providers are added to the React tree:

```tsx
import { ModuleProviders } from 'src/modules';

<ModuleProviders>
  <App />
</ModuleProviders>
```

### In Components

Components use module hooks instead of calling features directly:

```tsx
// Instead of:
const hasLicense = useLicenseEntitlement('FEATURE');

// Use:
const hasFeature = usePersianLicenseOverride('FEATURE');
// or access customization:
const { appName } = useCustomizationConfig();
```

## Module Dependencies

Modules can depend on each other:

```
customization
├── persian-localization (uses Persian date formatting for custom configs)
└── license-restrictions-removal (composes with it)

license-restrictions-removal
└── (standalone)

persian-localization
└── (standalone)
```

## Development Workflow

### Adding a New Module

1. Create `module-name/` directory
2. Create `ARCHITECTURE.md` explaining design decisions
3. Create `index.ts` with module initialization
4. Implement module functionality
5. Add to `ModuleRegistry` in `core/registry.ts`
6. Update this README with module documentation
7. Add integration tests in `__tests__/`

### Testing Modules

Each module should have:
- Unit tests for utilities
- Hook tests for React functionality
- Integration tests for module interactions

### Upgrading After Main Repo Update

1. Check if module dependencies changed
2. Run tests to identify breaking changes
3. Update module code to adapt to new APIs
4. Document changes in module's ARCHITECTURE.md

## Performance Considerations

- Modules load lazily when possible
- Hooks use React.memo to prevent unnecessary re-renders
- Module initialization is async to not block app startup
- Translation files are code-split per language

## Future Enhancements

- Module enable/disable flags
- Module versioning system
- Module configuration UI
- Plugin system for third-party modules

## Support & Maintenance

Each module's `ARCHITECTURE.md` contains:
- Implementation details
- Rationale for design choices
- Known limitations
- Upgrade checklist
