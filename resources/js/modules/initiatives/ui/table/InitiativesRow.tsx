import type { Initiative } from '@/modules/initiatives/core/types';
import { useTranslation } from '@/common/i18n';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';

import {
  InteractiveTableRow,
  TableActionCell,
  TableBooleanBadge,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, ImageIcon } from 'lucide-react';
import React from 'react';
import { InitiativeActions } from './InitiativeActions';

interface InitiativesRowProps {
  initiative: Initiative;
  onRowClick(initiative: Initiative): void;
  onToggleDisplay(initiative: Initiative, event?: React.MouseEvent): void;
  onDelete(initiative: Initiative, event?: React.MouseEvent): void;
}

/**
 * InitiativesRow renders a single initiative row with date or period and actions.
 */
export function InitiativesRow({
  initiative,
  onRowClick,
  onToggleDisplay,
  onDelete,
}: InitiativesRowProps) {
  const { locale } = useTranslation();
  const { translate: tForm } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.form,
  );
  const imageCount = initiative.images?.length ?? 0;

  return (
    <InteractiveTableRow
      active={initiative.display}
      interactive
      variant={initiative.display ? 'emphasized' : 'muted'}
      onActivate={() => onRowClick(initiative)}
    >
      <TableTitleCell
        className="sm:w-64"
        title={initiative.name}
        subtitle={initiative.summary ?? ''}
      />

      <TableMetaCell className="sm:w-44">
        <TableDateText
          value={initiative.start_date}
          endValue={initiative.end_date}
          locale={locale}
          fallback={tForm('values.empty', '-')}
        />
      </TableMetaCell>

      <TableMetaCell
        className={cn(tablePresets.statusCell, 'content-center pr-2 sm:w-32')}
      >
        <TableBooleanBadge
          active={initiative.display}
          activeLabel={tForm('values.public')}
          inactiveLabel={tForm('values.private')}
          activeIcon={Eye}
          inactiveIcon={EyeOff}
        />
      </TableMetaCell>

      <TableMetaCell className="sm:w-24">
        <div className="flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="text-xs whitespace-nowrap">
            {imageCount}
          </span>
        </div>
      </TableMetaCell>

      <TableActionCell
        className={cn(tablePresets.actionCell, 'content-center sm:w-24')}
      >
        <InitiativeActions
          initiative={initiative}
          onOpenDetails={() => onRowClick(initiative)}
          onToggleDisplay={onToggleDisplay}
          onDelete={onDelete}
        />
      </TableActionCell>
    </InteractiveTableRow>
  );
}
