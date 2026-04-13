import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { cn } from '@/lib/utils';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import { Pencil, Trash2 } from 'lucide-react';
import type { ProjectTranslationRecord } from '../types';

type ProjectTranslationsRowProps = {
  item: ProjectTranslationRecord;
  saving: boolean;
  onOpenEdit: (locale: string) => void;
  onDelete: (item: ProjectTranslationRecord) => void;
};

export function ProjectTranslationsRow({
  item,
  saving,
  onOpenEdit,
  onDelete,
}: ProjectTranslationsRowProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tTranslations } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const subtitle = item.name?.trim() || item.summary?.trim() || '';

  return (
    <InteractiveTableRow
      interactive
      onActivate={() => onOpenEdit(item.locale)}
    >
      <TableTitleCell
        className="w-full min-w-0"
        title={item.locale}
        subtitle={subtitle}
      />

      <TableActionCell className={cn(tablePresets.actionCell, 'w-px content-center')}>
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
          <TableActionsMenuItem onClick={() => onOpenEdit(item.locale)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>{tTranslations('actions.edit')}</span>
          </TableActionsMenuItem>

          <TableActionsMenuItem
            className="text-destructive focus:text-destructive"
            disabled={saving}
            onClick={() => onDelete(item)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{tActions('delete')}</span>
          </TableActionsMenuItem>
        </TableActionsMenu>
      </TableActionCell>
    </InteractiveTableRow>
  );
}
