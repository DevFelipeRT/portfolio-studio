import React from 'react';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import type { TemplateFilterMode } from './types';
import { filterTemplates } from './filterTemplates';

interface UseTemplateFilteringArgs {
  open: boolean;
  templates: TemplateDefinitionDto[];
}

export function useTemplateFiltering({ open, templates }: UseTemplateFilteringArgs) {
  const [filterMode, setFilterMode] = React.useState<TemplateFilterMode>('all');
  const [originFilter, setOriginFilter] = React.useState<string>('');

  const origins = React.useMemo(() => {
    const unique = new Set<string>();

    templates.forEach((template) => {
      if (template.origin) {
        unique.add(template.origin);
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const domainOrigins = React.useMemo(
    () => origins.filter((origin) => origin !== 'content-management'),
    [origins],
  );

  const visibleTemplates = React.useMemo(
    () =>
      filterTemplates({
        templates,
        filterMode,
        originFilter,
      }),
    [filterMode, originFilter, templates],
  );

  const handleFilterModeChange = React.useCallback((mode: TemplateFilterMode) => {
    setFilterMode(mode);

    if (mode === 'generic') {
      setOriginFilter('');
    }
  }, []);

  React.useEffect(() => {
    if (!open) {
      setFilterMode('all');
      setOriginFilter('');
    }
  }, [open]);

  return {
    filterMode,
    originFilter,
    domainOrigins,
    visibleTemplates,
    setOriginFilter,
    handleFilterModeChange,
  };
}

