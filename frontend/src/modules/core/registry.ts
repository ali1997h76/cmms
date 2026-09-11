/**
 * Module Registry System
 *
 * ARCHITECTURE DECISION:
 * - Centralized registry for all custom modules
 * - Modules register themselves on import
 * - Allows async initialization of modules
 * - Enables enable/disable functionality for future enhancements
 *
 * WHY THIS APPROACH:
 * - Single source of truth for active modules
 * - Decoupled module initialization
 * - Easy to add logging/monitoring
 * - Supports A/B testing and feature flags in future
 */

export interface Module {
  name: string;
  version: string;
  description: string;
  initialize(): Promise<void> | void;
  cleanup?(): Promise<void> | void;
}

export interface ModuleRegistryStats {
  totalModules: number;
  initializedModules: number;
  failedModules: string[];
}

class ModuleRegistry {
  private modules: Map<string, Module> = new Map();
  private initialized: Set<string> = new Set();
  private failed: Set<string> = new Set();

  /**
   * Register a module
   */
  register(module: Module): void {
    if (this.modules.has(module.name)) {
      console.warn(
        `[Modules] Module "${module.name}" already registered, skipping`
      );
      return;
    }

    this.modules.set(module.name, module);
    console.log(
      `[Modules] Registered module: ${module.name} v${module.version}`
    );
  }

  /**
   * Initialize all registered modules
   */
  async initializeAll(): Promise<ModuleRegistryStats> {
    const stats: ModuleRegistryStats = {
      totalModules: this.modules.size,
      initializedModules: 0,
      failedModules: []
    };

    for (const [name, module] of this.modules) {
      try {
        await Promise.resolve(module.initialize());
        this.initialized.add(name);
        stats.initializedModules++;
        console.log(`[Modules] Initialized: ${name}`);
      } catch (error) {
        this.failed.add(name);
        stats.failedModules.push(name);
        console.error(
          `[Modules] Failed to initialize "${name}":`,
          error
        );
      }
    }

    console.log('[Modules] Initialization complete', stats);
    return stats;
  }

  /**
   * Cleanup all modules
   */
  async cleanupAll(): Promise<void> {
    for (const [name, module] of this.modules) {
      if (module.cleanup && this.initialized.has(name)) {
        try {
          await module.cleanup();
          console.log(`[Modules] Cleaned up: ${name}`);
        } catch (error) {
          console.error(`[Modules] Failed to cleanup "${name}":`, error);
        }
      }
    }
  }

  /**
   * Get a module by name
   */
  get(name: string): Module | undefined {
    return this.modules.get(name);
  }

  /**
   * Check if a module is initialized
   */
  isInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  /**
   * Get all modules
   */
  getAll(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get stats
   */
  getStats(): ModuleRegistryStats {
    return {
      totalModules: this.modules.size,
      initializedModules: this.initialized.size,
      failedModules: Array.from(this.failed)
    };
  }
}

// Global registry instance
export const moduleRegistry = new ModuleRegistry();

/**
 * Helper to register a module (for convenience)
 */
export const registerModule = (module: Module): void => {
  moduleRegistry.register(module);
};

/**
 * Helper to initialize all modules
 */
export const initializeAllModules = async (): Promise<ModuleRegistryStats> => {
  return moduleRegistry.initializeAll();
};
