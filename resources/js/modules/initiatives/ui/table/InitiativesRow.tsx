import type { InitiativeListItem } from '@/modules/initiatives/core/types';
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
  initiative: InitiativeListItem;
  onRowClick(initiative: InitiativeListItem): void;
  onToggleDisplay(initiative: InitiativeListItem, event?: React.MouseEvent): void;
  onDelete(initiative: InitiativeListItem, event?: React.MouseEvent): void;
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

  return (
    <InteractiveTableRow
      active={initiative.display}
      interactive
      variant={initiative.display ? 'emphasized' : 'muted'}
      onActivate={() => onRowClick(initiative)}
    >
      <TableTitleCell
        className="w-full max-w-0 min-w-0"
        title={initiative.name}
        subtitle={initiative.summary ?? ''}
      />

      <TableMetaCell className="hidden w-px whitespace-nowrap xs:table-cell">
        {initiative.end_date ? (
          <TableDateText
            value={initiative.start_date}
            endValue={initiative.end_date}
            locale={locale}
            rangeLayout="stacked"
            startLabel={tForm('values.from')}
            endLabel={tForm('values.to')}
            fallback={tForm('values.empty')}
          />
        ) : (
          <TableDateText
            value={initiative.start_date}
            locale={locale}
            fallback={tForm('values.empty')}
          />
        )}
      </TableMetaCell>

      <TableMetaCell
        className={cn(tablePresets.statusCell, 'w-px content-center whitespace-nowrap')}
      >
        <TableBooleanBadge
          active={initiative.display}
          activeLabel={tForm('values.public')}
          inactiveLabel={tForm('values.private')}
          activeIcon={Eye}
          inactiveIcon={EyeOff}
        />
      </TableMetaCell>

      <TableMetaCell className="hidden w-px whitespace-nowrap text-center md:table-cell">
        <div className="flex items-center justify-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="text-xs whitespace-nowrap">
            {initiative.image_count}
          </span>
        </div>
      </TableMetaCell>

      <TableActionCell
        className={cn(tablePresets.actionCell, 'w-px content-center')}
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
