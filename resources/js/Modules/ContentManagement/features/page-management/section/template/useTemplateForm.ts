import type {
  SectionData,
  TemplateDefinitionDto,
  TemplateData,
} from '@/Modules/ContentManagement/types';
import * as React from 'react';
import { resolveEffectiveData } from './data/effectiveData';

type UseTemplateFormArgs = {
  template: TemplateDefinitionDto;
  value?: SectionData | null;
};

export function useTemplateForm({
  template,
  value,
}: UseTemplateFormArgs): TemplateData {
  // Keep a stable empty object so we don't trigger effects/memos on every render
  // when the caller passes null/undefined.
  const emptyValueRef = React.useRef<SectionData>({});
  const safeValue = value ?? emptyValueRef.current;

  const resolved = React.useMemo(() => {
    return resolveEffectiveData(template, safeValue);
  }, [safeValue, template]);

  return resolved;
}
