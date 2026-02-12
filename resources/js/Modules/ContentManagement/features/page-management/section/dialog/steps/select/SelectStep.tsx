import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { TemplateFilters } from './partials/TemplateFilters';
import { TemplateGrid } from './partials/TemplateGrid';
import type { TemplateFilterMode } from './types';

interface SelectStepProps {
  filterMode: TemplateFilterMode;
  originFilter: string;
  domainOrigins: string[];
  visibleTemplates: TemplateDefinitionDto[];
  selectedTemplateKey: string;
  onFilterModeChange: (mode: TemplateFilterMode) => void;
  onOriginFilterChange: (value: string) => void;
  onSelectTemplate: (templateKey: string) => void;
}

/**
 * Shared step for selecting a template with filters and preview grid.
 */
export function SelectStep({
  filterMode,
  originFilter,
  domainOrigins,
  visibleTemplates,
  selectedTemplateKey,
  onFilterModeChange,
  onOriginFilterChange,
  onSelectTemplate,
}: SelectStepProps) {
  return (
    <div className="mx-1 my-4 space-y-6">
      <TemplateFilters
        filterMode={filterMode}
        originFilter={originFilter}
        domainOrigins={domainOrigins}
        onFilterModeChange={onFilterModeChange}
        onOriginFilterChange={onOriginFilterChange}
      />

      {visibleTemplates.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No templates match the selected filter.
        </p>
      ) : (
        <TemplateGrid
          templates={visibleTemplates}
          selectedTemplateKey={selectedTemplateKey}
          onSelectTemplate={onSelectTemplate}
        />
      )}
    </div>
  );
}
