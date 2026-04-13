import {
  SearchField,
  SelectField,
  type SelectFieldOption,
} from '@/common/filtering';
import { NewButton, TableToolbar } from '@/common/table';
import { Button } from '@/components/ui/button';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import { X } from 'lucide-react';
import type { FormEvent } from 'react';

export type ProjectsListToolbarProps = {
  draftSearch: string;
  draftStatus: string;
  draftVisibility: string;
  statusOptions: SelectFieldOption[];
  hasAppliedFilters: boolean;
  onDraftSearchChange: (value: string) => void;
  onDraftStatusChange: (value: string) => void;
  onDraftVisibilityChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetFilters: () => void;
};

export function ProjectsListToolbar({
  draftSearch,
  draftStatus,
  draftVisibility,
  statusOptions,
  hasAppliedFilters,
  onDraftSearchChange,
  onDraftStatusChange,
  onDraftVisibilityChange,
  onSubmit,
  onResetFilters,
}: ProjectsListToolbarProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);

  return (
    <TableToolbar className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form
        className="flex w-full flex-col gap-3 md:flex-row md:items-center"
        onSubmit={onSubmit}
      >
        <SearchField
          className="w-full md:min-w-0 md:flex-1"
          aria-label={tForm('filters.searchLabel')}
          value={draftSearch}
          onChange={(event) => onDraftSearchChange(event.currentTarget.value)}
          placeholder={tForm('filters.searchPlaceholder')}
          buttonLabel={tForm('filters.searchSubmit')}
        />

        <SelectField
          ariaLabel={tForm('filters.statusLabel')}
          className="w-full md:w-40 md:flex-none"
          value={draftStatus}
          placeholder={tForm('filters.statusPlaceholder')}
          options={statusOptions}
          onChange={onDraftStatusChange}
        />

        <SelectField
          ariaLabel={tForm('filters.visibilityLabel')}
          className="w-full md:w-44 md:flex-none"
          value={draftVisibility}
          placeholder={tForm('filters.visibilityPlaceholder')}
          options={[
            {
              value: 'public',
              label: tForm('filters.publicOnly'),
            },
            {
              value: 'private',
              label: tForm('filters.privateOnly'),
            },
          ]}
          onChange={onDraftVisibilityChange}
        />
      </form>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {hasAppliedFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onResetFilters}
          >
            <X className="h-4 w-4" />
            {tForm('filters.reset')}
          </Button>
        ) : null}

        <NewButton
          href={route('projects.create')}
          label={tActions('newProject')}
        />
      </div>
    </TableToolbar>
  );
}
