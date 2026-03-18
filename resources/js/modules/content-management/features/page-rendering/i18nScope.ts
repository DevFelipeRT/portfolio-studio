import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import type { PageSectionDto } from '@/modules/content-management/types';

type SectionRegistryProviderWithI18n = {
  getSectionRegistry(): Record<string, unknown>;
  i18n?: readonly string[];
};

/**
 * Derives i18n registry ids required to safely render the provided CMS sections.
 *
 * This works by matching section template keys against the global section
 * registry providers, and collecting any `provider.i18n` ids from providers
 * that own at least one of the template keys.
 */
export function deriveI18nScopeFromSections(
  sections: readonly PageSectionDto[],
): string[] {
  const templateKeys = sections
    .map((section) => section.template_key)
    .filter((key): key is string => typeof key === 'string' && key.trim() !== '');

  return deriveI18nScopeFromTemplateKeys(templateKeys);
}

/**
 * Derives i18n registry ids required to safely render a single CMS section
 * template.
 */
export function deriveI18nScopeForTemplateKey(templateKey: string): string[] {
  if (typeof templateKey !== 'string' || templateKey.trim() === '') {
    return [];
  }

  return deriveI18nScopeFromTemplateKeys([templateKey]);
}

function deriveI18nScopeFromTemplateKeys(
  templateKeys: readonly string[],
): string[] {
  const normalizedTemplateKeys = new Set(
    templateKeys
      .filter((key): key is string => typeof key === 'string')
      .map((key) => key.trim())
      .filter((key) => key !== ''),
  );

  const ids = new Set<string>();

  sectionRegistryProviders.forEach((provider) => {
    const typed = provider as unknown as SectionRegistryProviderWithI18n;
    const registry = typed.getSectionRegistry();

    const ownsAnyKey = Object.keys(registry).some((key) =>
      normalizedTemplateKeys.has(key),
    );
    if (!ownsAnyKey) {
      return;
    }

    typed.i18n?.forEach((id) => {
      if (typeof id === 'string' && id.trim() !== '') {
        ids.add(id.trim());
      }
    });
  });

  return Array.from(ids);
}
