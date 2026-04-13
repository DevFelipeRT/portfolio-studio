import {
  SystemTable,
  TableCard,
  TableEmptyState,
  TableHeaderRow,
  tablePresets,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import { Plus } from 'lucide-react';
import type { ProjectTranslationRecord } from '../types';
import { ProjectTranslationsRow } from './ProjectTranslationsRow';

type ProjectTranslationsListProps = {
  translations: readonly ProjectTranslationRecord[];
  saving: boolean;
  canAddTranslation: boolean;
  onOpenAdd: () => void;
  onOpenEdit: (locale: string) => void;
  onDelete: (item: ProjectTranslationRecord) => void;
};

export function ProjectTranslationsList({
  translations,
  saving,
  canAddTranslation,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}: ProjectTranslationsListProps) {
  const { translate: tTranslations } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const columnCount = 2;

  return (
    <TableCard
      className="flex min-h-0 flex-1 flex-col"
      contentClassName="min-h-0 flex-1"
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-6 tracking-tight">
              {tTranslations('existing')}
            </h3>
          </div>
          <div className={cn(!canAddTranslation && 'pointer-events-none opacity-50')}>
            <Button
              size="sm"
              className="h-9 gap-2.5 rounded-md px-3.5 text-sm font-semibold tracking-[-0.01em] shadow-sm [&_svg]:size-4"
              disabled={saving || !canAddTranslation}
              onClick={onOpenAdd}
            >
              <Plus className="opacity-90" />
              <span className="leading-none whitespace-nowrap">
                {tTranslations('add')}
              </span>
            </Button>
          </div>
        </div>
      }
    >
      <ScrollArea className="min-h-0 flex-1">
        <SystemTable layout="auto" density="compact">
          <TableHeader>
            <TableHeaderRow>
              <TableHead className={cn(tablePresets.headerCell, 'w-full min-w-0')}>
                {tTranslations('fields.locale')}
              </TableHead>
              <TableHead
                className={cn(tablePresets.headerCell, 'w-px text-right whitespace-nowrap')}
              >
                <span className="sr-only">{tForm('fields.actions.label')}</span>
              </TableHead>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {translations.length === 0 ? (
              <TableEmptyState
                colSpan={columnCount}
                density="compact"
                message={tTranslations('empty')}
              />
            ) : null}

            {translations.map((item) => (
              <ProjectTranslationsRow
                key={item.locale}
                item={item}
                saving={saving}
                onOpenEdit={onOpenEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </SystemTable>
      </ScrollArea>
    </TableCard>
  );
}
