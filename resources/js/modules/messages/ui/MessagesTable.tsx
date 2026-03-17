// resources/js/Pages/Messages/Partials/MessagesTable.tsx

import type { Message } from '@/modules/messages/core/types';

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
import {
    MESSAGES_NAMESPACES,
    useMessagesTranslation,
} from '@/modules/messages/i18n';
import { MessagesRow } from './MessagesRow';

interface MessagesTableProps {
    items: Message[];
    onRowClick(message: Message): void;
    onToggleImportant(message: Message, event?: React.MouseEvent): void;
    onToggleSeen(message: Message, event?: React.MouseEvent): void;
    onDelete(message: Message, event?: React.MouseEvent): void;
}

/**
 * MessagesTable renders the inbox table with headers and rows.
 */
export function MessagesTable({
    items,
    onRowClick,
    onToggleImportant,
    onToggleSeen,
    onDelete,
}: MessagesTableProps) {
    const { translate: tMessages } = useMessagesTranslation(
        MESSAGES_NAMESPACES.messages,
    );
    const baseClass = 'text-muted-foreground text-xs font-medium';
    return (
        <Card className="overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">
                        {tMessages('table.title')}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {tMessages('table.description')}
                    </p>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="min-w-0 p-0">
                <Table className="xs:table-auto min-w-0 table-fixed">
                    <TableHeader>
                        <TableRow className="bg-muted/60 min-w-0">
                            <TableHead
                                className={cn(baseClass, 'min-w-0 sm:w-48')}
                            >
                                <span>{tMessages('table.columns.from')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'hidden w-full max-w-xl sm:table-cell',
                                )}
                            >
                                <span>{tMessages('table.columns.message')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-13 text-left sm:w-32',
                                )}
                            >
                                <span>{tMessages('table.columns.status')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-12 text-center md:w-18',
                                )}
                            >
                                <span>{tMessages('table.columns.when')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(baseClass, 'w-21 text-right')}
                            >
                                <span className="sr-only">
                                    {tMessages('table.columns.menu')}
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {items.map((message) => (
                            <MessagesRow
                                key={message.id}
                                message={message}
                                onRowClick={onRowClick}
                                onToggleImportant={onToggleImportant}
                                onToggleSeen={onToggleSeen}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
