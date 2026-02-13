import type React from 'react';
import {
  SectionComponentProps,
  SectionComponentRegistry,
} from '../../../types';

export function resolveTemplateComponent(
  registry: SectionComponentRegistry,
  template_key: string,
): React.ComponentType<SectionComponentProps> | null {
  return registry[template_key] ?? null;
}
