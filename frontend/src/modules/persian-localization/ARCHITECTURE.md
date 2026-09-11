# Persian Localization Module

## Overview

This module adds comprehensive Persian language and Jalali calendar support to Atlas CMMS without modifying the core codebase.

## Architecture Decisions

### 1. Jalali Calendar Conversion (Not Storage)

**Decision**: Display dates as Jalali calendar, but keep all database storage and API communication in Gregorian.

**Rationale**:
- Backend APIs expect Gregorian dates
- Gregorian dates are ISO 8601 standard
- Conversion can happen at display time
- Reduces complexity and potential bugs
- Avoids breaking compatibility with backend

**Implementation**:
- Conversion utilities convert between Gregorian ↔ Jalali on display only
- Date inputs accept both Jalali and Gregorian
- API always sends Gregorian dates
- Display layers use Jalali conversion hooks

### 2. Persian Language Layering

**Decision**: Add Persian (fa) translations alongside existing i18n system, override specific keys for RTL/cultural context.

**Rationale**:
- Non-intrusive to existing i18n system
- Can be enabled/disabled via config
- Easier to maintain alongside updates
- Reuses i18next infrastructure

**Implementation**:
- Persian translation file: `./i18n/translations/fa.ts`
- Custom hooks for RTL-aware components
- Overrides for locale-specific terms

### 3. RTL Layout Support

**Decision**: Use MUI's built-in RTL support + custom CSS overrides for Persian.

**Rationale**:
- MUI Material-UI has native RTL support
- Minimal custom CSS needed
- Direction detection via language
- Can be toggled at runtime

**Implementation**:
- `useDirectionContext` hook for direction state
- `usePersianDirection` hook for language-specific direction
- CSS variables for RTL-safe styling
- Component wrappers for common patterns

## Module Structure

```
persian-localization/
├── ARCHITECTURE.md           # This file
├── index.ts                  # Module entry point & registration
├── types.ts                  # Type definitions
├── config.ts                 # Configuration
├── hooks/
│   ├── usePersianDate.ts     # Date conversion hook
│   ├── usePersianLocale.ts   # Locale/language hook
│   ├── useDirection.ts       # RTL direction hook
│   └── index.ts              # Exports
├── utils/
│   ├── jalali.ts             # Jalali conversion utilities
│   ├── dateFormatting.ts     # Date formatting utilities
│   ├── persian.ts            # Persian-specific utilities
│   └── index.ts              # Exports
├── i18n/
│   ├── translations/
│   │   └── fa.ts             # Persian translations
│   ├── dateLocales.ts        # Persian date-fns locale config
│   └── index.ts              # i18n configuration
├── context/
│   ├── PersianContext.tsx     # Persian module context
│   └── index.ts              # Exports
├── components/
│   ├── PersianDatePicker.tsx  # Persian date picker component
│   └── index.ts              # Exports
└── __tests__/
    ├── jalali.test.ts
    ├── dateFormatting.test.ts
    └── hooks.test.ts
```

## Usage Examples

### Basic Setup

```tsx
// In App.tsx or main component
import { PersianLocalizationModule } from 'src/modules/persian-localization';

// Module automatically initializes on import
// It registers itself with moduleRegistry
```

### Using Jalali Dates

```tsx
import { usePersianDate } from 'src/modules/persian-localization';

function MyComponent() {
  const { toJalali, toGregorian, formatJalali } = usePersianDate();
  
  // Convert Gregorian to Jalali for display
  const gregorianDate = new Date('2024-01-15');
  const jalaliDate = toJalali(gregorianDate); // 1402/10/25
  
  // Format for display
  const formatted = formatJalali(gregorianDate); // "۱۴۰۲/۱۰/۲۵"
  
  return <div>{formatted}</div>;
}
```

### Using Persian Language

```tsx
import { usePersianLocale } from 'src/modules/persian-localization';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  const { isPersian, currentLanguage } = usePersianLocale();
  
  return (
    <div dir={isPersian ? 'rtl' : 'ltr'}>
      {t('common.welcome')}
    </div>
  );
}
```

### Using Direction Hook

```tsx
import { useDirection } from 'src/modules/persian-localization';

function MyComponent() {
  const { direction, isRTL } = useDirection();
  
  return (
    <Box sx={{ ml: isRTL ? 0 : 2, mr: isRTL ? 2 : 0 }}>
      Content
    </Box>
  );
}
```

## Integration with Existing Code

### Example: Modifying a Date Display Component

**Before**:
```tsx
// Existing code
const dateString = new Date().toLocaleDateString();
return <span>{dateString}</span>;
```

**After** (using module override):
```tsx
import { usePersianDate } from 'src/modules/persian-localization';

const PersianDateDisplay = () => {
  const { formatJalali } = usePersianDate();
  const dateString = formatJalali(new Date());
  return <span>{dateString}</span>;
};

// Use this wrapper component where dates are displayed
```

## Known Limitations

1. **FullCalendar**: The calendar library uses its own date handling. Jalali calendar integration requires either:
   - Third-party library like `react-persian-calendar`
   - Custom calendar implementation
   - Currently mapped to show Gregorian with Persian labels

2. **Date Inputs**: Browser native date inputs use Gregorian. We provide custom Persian date picker.

3. **Database Timestamps**: Timestamps remain Gregorian as per architecture.

## Compatibility with Upstream Updates

### When Adding New Dates
If the main repo adds new date fields:
1. Find the new date display component
2. Check if it's using date formatting
3. Either:
   - Use the component wrapper directly, or
   - Create override in this module

### When Updating Localization
If translation keys change in main repo:
1. Update Persian translation file accordingly
2. Use i18next's fallback mechanism for missing keys
3. No need to update core i18n system

## Testing

Run tests with:
```bash
npm test -- src/modules/persian-localization
```

Test coverage should include:
- Jalali ↔ Gregorian conversions
- Date formatting in various locales
- RTL vs LTR detection
- Hook behavior
- Component rendering

## Future Enhancements

1. **Full Jalali Calendar Widget**: Replace FullCalendar with Persian calendar
2. **Persian Numbers**: Convert digits to Persian numerals (۰-۹)
3. **Relative Time**: Support Persian relative time (مثل "۲ هفته پیش")
4. **Timezone Support**: Handle Persian timezone considerations
5. **Locale Override**: Allow per-component locale override

## Performance Considerations

- Date conversion is memoized
- Locale loading is lazy
- Translation files are code-split
- No impact on components not using Persian features

## Troubleshooting

### Dates show wrong format
- Check if `usePersianDate` hook is being used
- Verify Persian language is selected in settings
- Check browser console for conversion errors

### RTL doesn't work
- Verify `dir="rtl"` is set on appropriate containers
- Check if MUI theme is configured for RTL
- Ensure `useDirection` hook is being used

### Persian text doesn't display
- Check font includes Persian characters (use Vazir, IRANSans, etc.)
- Verify translation file is loaded
- Check i18next configuration
