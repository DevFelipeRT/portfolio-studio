import type { Experience } from '@/modules/experiences/core/types';
import { useTranslation } from '@/common/i18n';
import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { InfoBadge, VisibilityBadge } from '@/components/badges';
import { cn } from '@/lib/utils';
import { PageLink } from '@/common/page-runtime';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface ExperiencesRowProps {
  experience: Experience;
  onRowClick(experience: Experience): void;
}

export function ExperiencesRow({ experience, onRowClick }: ExperiencesRowProps) {
  const { locale } = useTranslation();
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const { translate: tShared } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.shared,
  );

  const summary = truncate(experience.summary ?? '', 80);

  return (
    <InteractiveTableRow interactive onActivate={() => onRowClick(experience)}>
      <TableTitleCell
        className="w-full min-w-0"
        title={experience.position}
        aside={
          experience.company ? (
            <InfoBadge
              tone="muted"
              className="hidden px-2 sm:inline-flex md:hidden"
            >
              {experience.company}
            </InfoBadge>
          ) : null
        }
        subtitle={summary}
      />

      <TableMetaCell className="hidden w-px md:table-cell">
        {experience.company ?? tForm('values.empty')}
      </TableMetaCell>

      <TableMetaCell className="hidden w-px xs:table-cell">
        <TableDateText
          value={experience.start_date}
          endValue={experience.end_date}
          locale={locale}
          rangeLayout="stacked"
          startLabel={tShared('period.from')}
          endLabel={tShared('period.until')}
          presentLabel={tShared('period.present')}
          fallback={tForm('values.empty')}
        />
      </TableMetaCell>

      <TableMetaCell
        className={cn(tablePresets.statusCell, 'w-px content-center text-center sm:text-left')}
      >
        <VisibilityBadge
          visible={experience.display}
          publicLabel={tForm('visibility.public')}
          privateLabel={tForm('visibility.private')}
          className="mx-auto sm:mx-0"
          labelClassName="hidden sm:inline"
        />
      </TableMetaCell>

      <TableActionCell className="content-center">
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
          <TableActionsMenuItem onClick={() => onRowClick(experience)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{tActions('viewDetails', 'View details')}</span>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink href={route('experiences.edit', experience.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{tActions('edit')}</span>
            </PageLink>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink
              href={route('experiences.destroy', experience.id)}
              method="delete"
              as="button"
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{tActions('delete')}</span>
            </PageLink>
          </TableActionsMenuItem>
        </TableActionsMenu>
      </TableActionCell>
    </InteractiveTableRow>
  );
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}...`;
}
