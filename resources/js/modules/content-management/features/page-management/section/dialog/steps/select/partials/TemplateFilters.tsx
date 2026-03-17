import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { TemplateFilterMode } from '../types';

interface TemplateFiltersProps {
  filterMode: TemplateFilterMode;
  originFilter: string;
  domainOrigins: string[];
  onFilterModeChange: (mode: TemplateFilterMode) => void;
  onOriginFilterChange: (value: string) => void;
}

export function TemplateFilters({
  filterMode,
  originFilter,
  domainOrigins,
  onFilterModeChange,
  onOriginFilterChange,
}: TemplateFiltersProps) {
  const { translate: tTemplates } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.templates,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Label className="text-muted-foreground text-xs tracking-wide uppercase">
        {tTemplates('filters.label', 'Filters')}
      </Label>
      <Button
        type="button"
        variant={filterMode === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('all')}
      >
        {tTemplates('filters.all', 'All')}
      </Button>
      <Button
        type="button"
        variant={filterMode === 'generic' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('generic')}
      >
        {tTemplates('filters.generic', 'Generic')}
      </Button>
      <Button
        type="button"
        variant={filterMode === 'domain' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('domain')}
      >
        {tTemplates('filters.domain', 'Domain')}
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Label
          htmlFor="template-origin-filter"
          className="text-muted-foreground text-xs tracking-wide uppercase"
        >
          {tTemplates('filters.domainLabel', 'Domain')}
        </Label>
        <select
          id="template-origin-filter"
          className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-sm"
          value={originFilter}
          onChange={(event) => onOriginFilterChange(event.target.value)}
          disabled={filterMode === 'generic'}
        >
          <option value="">{tTemplates('filters.all', 'All')}</option>
          {domainOrigins.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
