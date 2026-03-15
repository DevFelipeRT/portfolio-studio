import type { I18nPreloader } from '../types';

/**
 * Registers definition modules once so their side effects become visible to the
 * registry.
 */
export interface DefinitionRegistrar {
  registerDefinitionsOnce(): Promise<void>;
}

/**
 * Mutable state contract backing the i18n registry implementation.
 */
export interface RegistryState {
  register(id: string, preloader: I18nPreloader): void;
  define(id: string, load: () => Promise<unknown>): void;
  hasPreloader(id: string): boolean;
  getPreloader(id: string): I18nPreloader | undefined;
  getAllPreloaders(): readonly I18nPreloader[];
  getLoader(id: string): (() => Promise<unknown>) | undefined;
  getLoadPromise(id: string): Promise<void> | undefined;
  setLoadPromise(id: string, promise: Promise<void>): void;
  clearLoadPromise(id: string): void;
  getVersion(): number;
}
