// resources/js/Pages/Technologies/Partials/TechnologiesTable.tsx

import { Technology } from '../../types';
import { TechnologiesRow } from './TechnologiesRow';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { Separator } from '@/Components/Ui/separator';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Ui/table';
import { cn } from '@/lib/utils';

interface TechnologiesTableProps {
    items: Technology[];
    categories: Record<string, string>;
    onEdit(technology: Technology, event?: React.MouseEvent): void;
    onDelete(technology: Technology, event?: React.MouseEvent): void;
}

/**
 * TechnologiesTable renders the catalog table with headers and rows.
 */
export function TechnologiesTable({
    items,
    categories,
    onEdit,
    onDelete,
}: TechnologiesTableProps) {
    const baseClass = 'text-xs font-medium text-muted-foreground';

    return (
        <Card className="overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">Technologies</CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Review and manage the technologies used across your
                        projects.
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
                                <span>Name</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-24 text-left whitespace-nowrap sm:w-40',
                                )}
                            >
                                <span>Category</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-20 text-center whitespace-nowrap sm:w-32',
                                )}
                            >
                                <span>Updated</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'w-16 text-right whitespace-nowrap',
                                )}
                            >
                                <span className="sr-only">Menu</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {items.map((technology) => (
                            <TechnologiesRow
                                key={technology.id}
                                technology={technology}
                                categories={categories}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
