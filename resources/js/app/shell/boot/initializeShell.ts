import type { AppPageProps } from '../types';
import { initializeAppRuntimeState } from '../runtime';
import { preloadShellBundles } from './preloadShellBundles';

/**
 * The shell initialization flow that prepares runtime state and shared shell
 * translations before the first mount.
 */
export async function initializeShell(initialProps: AppPageProps): Promise<void> {
  initializeAppRuntimeState(initialProps);
  await preloadShellBundles(initialProps);
}
