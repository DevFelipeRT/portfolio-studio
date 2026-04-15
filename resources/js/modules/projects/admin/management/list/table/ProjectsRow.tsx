import { PageLink } from '@/common/page-runtime';
import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableMetaCell,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { VisibilityBadge } from '@/components/badges';
import { cn } from '@/lib/utils';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import { Eye, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { ProjectStatusBadge } from '../../../../components/ProjectStatusBadge';
import type { ProjectListItem } from '../types';

interface ProjectsRowProps {
  project: ProjectListItem;
  onRowClick(project: ProjectListItem): void;
  onDelete(project: ProjectListItem, event?: React.MouseEvent): void;
}

export function ProjectsRow({
  project,
  onRowClick,
  onDelete,
}: ProjectsRowProps) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  return (
    <InteractiveTableRow
      active={project.display}
      interactive
      variant={project.display ? 'emphasized' : 'muted'}
      onActivate={() => onRowClick(project)}
    >
      <TableTitleCell
        className="w-full max-w-0 min-w-0"
        title={project.name}
        subtitle={project.summary ?? ''}
      />

      <TableMetaCell className="xs:table-cell hidden w-px whitespace-nowrap">
        <ProjectStatusBadge status={project.status} />
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.statusCell,
          'w-px content-center whitespace-nowrap',
        )}
      >
        <VisibilityBadge
          visible={project.display}
          publicLabel={tForm('visibility.public')}
          privateLabel={tForm('visibility.private')}
        />
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.statusCell,
          'hidden w-px text-center whitespace-nowrap md:table-cell',
        )}
      >
        <div className="flex items-center justify-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="text-xs whitespace-nowrap">
            {project.image_count}
          </span>
        </div>
      </TableMetaCell>

      <TableActionCell
        className={cn(tablePresets.actionCell, 'w-px content-center')}
      >
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
          <TableActionsMenuItem onClick={() => onRowClick(project)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{tActions('showDetails')}</span>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink href={route('projects.edit', project.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{tActions('edit')}</span>
            </PageLink>
          </TableActionsMenuItem>

          <TableActionsMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(event) => onDelete(project, event)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{tActions('delete')}</span>
          </TableActionsMenuItem>
        </TableActionsMenu>
      </TableActionCell>
    </InteractiveTableRow>
  );
}
