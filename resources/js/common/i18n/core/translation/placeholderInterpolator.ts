import type { PlaceholderValues, Translation, TranslationTemplate } from '../types';

/**
 * Interpolates placeholders in a translation template using the provided values.
 */
export function interpolatePlaceholders(
  template: TranslationTemplate,
  params?: PlaceholderValues,
): Translation {
  const source = template.value;

  if (!params) {
    return source;
  }

  let result = source;

  const seenRaw = new Set<string>();
  for (const placeholder of template.placeholders) {
    if (seenRaw.has(placeholder.raw)) {
      continue;
    }
    seenRaw.add(placeholder.raw);

    const value = params[placeholder.identifier];
    if (value === undefined) {
      continue;
    }

    result = result.split(placeholder.raw).join(String(value));
  }

  return result;
}
