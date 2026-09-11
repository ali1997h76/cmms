/**
 * Modules System - Main Entry Point
 *
 * This file re-exports all modules and core utilities for easy access.
 *
 * ARCHITECTURE:
 * - Core registry system for module management
 * - Persian localization module
 * - License restrictions removal module
 * - Customization module
 *
 * All modules are auto-registered on import.
 */

// Core module system
export * from './core';

// Custom modules - each registers itself on import
export * from './persian-localization';
export * from './license-restrictions-removal';
export * from './customization';

/**
 * Helper to initialize all modules in App.tsx
 *
 * Usage:
 * import { initializeModules } from 'src/modules';
 *
 * useEffect(() => {
 *   initializeModules();
 * }, []);
 */
export { initializeAllModules as initializeModules } from './core';
