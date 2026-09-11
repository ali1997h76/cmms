/**
 * Core Module System Exports
 */

export {
  moduleRegistry,
  registerModule,
  initializeAllModules,
  type Module,
  type ModuleRegistryStats
} from './registry';

export {
  ModuleProvider,
  useModuleContext,
  useModulesReady,
  useIsModuleInitialized
} from './ModuleContext';
