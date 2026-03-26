import type { InitiativeListItem } from '@/modules/initiatives/core/types';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';

import {
    TableActionsMenu,
    TableActionsMenuItem,
} from '@/common/table';
import {
    PageLink,
} from '@/common/page-runtime';
import {
    Eye,
    EyeOff,
    Pencil,
    Trash2,
} from 'lucide-react';
import React from 'react';

interface InitiativeActionsProps {
    initiative: InitiativeListItem;
    onOpenDetails(): void;
    onToggleDisplay(initiative: InitiativeListItem, event?: React.MouseEvent): void;
    onDelete(initiative: InitiativeListItem, event?: React.MouseEvent): void;
}

/**
 * InitiativeActions renders the actions menu for a single initiative row.
 */
export function InitiativeActions({
    initiative,
    onOpenDetails,
    onToggleDisplay,
    onDelete,
}: InitiativeActionsProps) {
    const { translate: tActions } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.actions,
    );
    return (
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
            <TableActionsMenuItem onClick={onOpenDetails}>
                <Eye className="mr-2 h-4 w-4" />
                <span>{tActions('showDetails')}</span>
            </TableActionsMenuItem>

            <TableActionsMenuItem asChild>
                <PageLink href={route('initiatives.edit', initiative.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>{tActions('edit')}</span>
                </PageLink>
            </TableActionsMenuItem>

            <TableActionsMenuItem
                onClick={(event) => onToggleDisplay(initiative, event)}
            >
                {initiative.display ? (
                    <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                    <Eye className="mr-2 h-4 w-4" />
                )}
                <span>
                    {initiative.display
                        ? tActions('hideFromLanding')
                        : tActions('showOnLanding')}
                </span>
            </TableActionsMenuItem>

            <TableActionsMenuItem
                onClick={(event) => onDelete(initiative, event)}
                className="text-destructive focus:text-destructive"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{tActions('delete')}</span>
            </TableActionsMenuItem>
        </TableActionsMenu>
    );
}
