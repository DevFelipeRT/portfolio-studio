import { createLocaleResolver } from '@/common/locale';
import type {
  NormalizedRuntimeLocalizationConfig,
  RuntimeLocalizationConfig,
} from '@/common/locale';
import type { I18nPreloader } from '../registry';
import { translatorProvider as sharedTranslatorProvider } from '../preloading/preloading';
import { initializeI18nRuntime } from '../runtime';

export const translatorProvider = sharedTranslatorProvider;

/**
 * Compatibility layer for callers that still expect the environment helper.
 *
 * Runtime initialization now lives in `runtime.ts`, while shared catalog
 * preloading lives in `preloading/preloading.ts`.
 */
export async function createI18nEnvironment(
  runtimeConfig: RuntimeLocalizationConfig,
): Promise<{
  localeResolver: ReturnType<typeof createLocaleResolver>;
  runtimeConfig: NormalizedRuntimeLocalizationConfig;
  translatorProvider: I18nPreloader;
}> {
  const { localeResolver, runtimeConfig: normalized } =
    await initializeI18nRuntime(runtimeConfig);

  return {
    localeResolver,
    runtimeConfig: normalized,
    translatorProvider,
  };
}
