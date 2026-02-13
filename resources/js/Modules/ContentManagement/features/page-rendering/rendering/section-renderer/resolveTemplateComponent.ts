import type { SectionComponentProps, SectionComponentRegistry } from '../../types';
import type React from 'react';

export function resolveTemplateComponent(
  registry: SectionComponentRegistry,
  template_key: string,
): React.ComponentType<SectionComponentProps> | null {
  return registry[template_key] ?? null;
}
