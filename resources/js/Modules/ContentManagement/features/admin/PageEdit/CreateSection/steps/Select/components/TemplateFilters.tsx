import { Button } from '@/Components/Ui/button';
import { Label } from '@/Components/Ui/label';
import type { TemplateFilterMode } from '../../../CreateSectionDialog';

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Label className="text-muted-foreground text-xs tracking-wide uppercase">
        Filters
      </Label>
      <Button
        type="button"
        variant={filterMode === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('all')}
      >
        All
      </Button>
      <Button
        type="button"
        variant={filterMode === 'generic' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('generic')}
      >
        Generic
      </Button>
      <Button
        type="button"
        variant={filterMode === 'domain' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterModeChange('domain')}
      >
        Domain
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Label
          htmlFor="template-origin-filter"
          className="text-muted-foreground text-xs tracking-wide uppercase"
        >
          Domain
        </Label>
        <select
          id="template-origin-filter"
          className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-sm"
          value={originFilter}
          onChange={(event) => onOriginFilterChange(event.target.value)}
          disabled={filterMode === 'generic'}
        >
          <option value="">All</option>
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
