/**
 * Module Context
 *
 * ARCHITECTURE DECISION:
 * - Provides module state and initialization through React Context
 * - Allows components to check if modules are ready
 * - Enables module feature detection
 *
 * WHY THIS APPROACH:
 * - React developers expect context for state management
 * - Easier to integrate with existing context providers
 * - Allows SSR compatibility if needed
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initializeAllModules,
  moduleRegistry,
  ModuleRegistryStats
} from './registry';

interface ModuleContextType {
  isReady: boolean;
  stats: ModuleRegistryStats | null;
  error: Error | null;
  isModuleInitialized: (name: string) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: React.ReactNode;
}

/**
 * Module Provider Component
 * Initializes all modules on app startup
 */
export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<ModuleRegistryStats | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const initStats = await initializeAllModules();
        setStats(initStats);
        setIsReady(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('[ModuleProvider] Initialization failed:', error);
        // Still set ready to true to not block the app
        setIsReady(true);
      }
    };

    initialize();
  }, []);

  const value: ModuleContextType = {
    isReady,
    stats,
    error,
    isModuleInitialized: (name: string) => moduleRegistry.isInitialized(name)
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};

/**
 * Hook to access module context
 */
export const useModuleContext = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleContext must be used within ModuleProvider');
  }
  return context;
};

/**
 * Hook to check if modules are ready
 */
export const useModulesReady = (): boolean => {
  const { isReady } = useModuleContext();
  return isReady;
};

/**
 * Hook to check if a specific module is initialized
 */
export const useIsModuleInitialized = (moduleName: string): boolean => {
  const { isModuleInitialized } = useModuleContext();
  return isModuleInitialized(moduleName);
};
