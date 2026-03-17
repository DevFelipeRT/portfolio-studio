// resources/js/Pages/Initiatives/Partials/InitiativesTable.tsx

import type { Initiative } from '@/modules/initiatives/core/types';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { InitiativesRow } from './InitiativesRow';

interface InitiativesTableProps {
    items: Initiative[];
    onRowClick(initiative: Initiative): void;
    onToggleDisplay(initiative: Initiative, event?: React.MouseEvent): void;
    onDelete(initiative: Initiative, event?: React.MouseEvent): void;
}

/**
 * InitiativesTable renders the initiatives table with headers and rows.
 */
export function InitiativesTable({
    items,
    onRowClick,
    onToggleDisplay,
    onDelete,
}: InitiativesTableProps) {
    const { translate: tForm } = useInitiativesTranslation(INITIATIVES_NAMESPACES.form);
    const baseClass = 'text-muted-foreground text-xs font-medium';

    return (
        <Card className="overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">
                        {tForm('table.title')}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {tForm('table.description')}
                    </p>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="min-w-0 p-0">
                <Table className="xs:table-auto min-w-0 table-fixed">
                    <TableHeader>
                        <TableRow className="bg-muted/60 min-w-0">
                            <TableHead
                                className={cn(baseClass, 'min-w-0 sm:w-64')}
                            >
                                <span>{tForm('fields.name.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-40 text-left sm:w-44',
                                )}
                            >
                                <span>{tForm('fields.period.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-24 text-left sm:w-32',
                                )}
                            >
                                <span>{tForm('fields.display_count.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-20 text-left sm:w-24',
                                )}
                            >
                                <span>{tForm('fields.image_count.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(baseClass, 'w-16 text-right')}
                            >
                                <span className="sr-only">{tForm('table.menu')}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {items.map((initiative) => (
                            <InitiativesRow
                                key={initiative.id}
                                initiative={initiative}
                                onRowClick={onRowClick}
                                onToggleDisplay={onToggleDisplay}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
