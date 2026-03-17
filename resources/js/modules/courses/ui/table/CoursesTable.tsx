import type { Course } from '@/modules/courses/core/types';
import {
    COURSES_NAMESPACES,
    useCoursesTranslation,
} from '@/modules/courses/i18n';
import { CoursesRow } from './CoursesRow';

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

interface CoursesTableProps {
    items: Course[];
    onRowClick: (course: Course) => void;
}

/**
 * CoursesTable renders the list of courses within a card container.
 */
export function CoursesTable({ items, onRowClick }: CoursesTableProps) {
    const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
    const baseClass = 'text-muted-foreground text-xs font-medium text-nowrap';

    return (
        <Card className="overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">{tForm('table.title')}</CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {tForm('table.description')}
                    </p>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="min-w-0 p-0">
                <Table className="table-auto min-w-0">
                    <TableHeader>
                        <TableRow className="bg-muted/60 hover:bg-muted/60 min-w-0">
                            <TableHead
                                className={cn(baseClass, 'min-w-0 sm:w-1/3')}
                            >
                                <span>{tForm('table.columns.course')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'hidden sm:table-cell',
                                )}
                            >
                                <span>{tForm('table.columns.started_at')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'hidden sm:table-cell',
                                )}
                            >
                                <span>{tForm('table.columns.completed_at')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'text-center md:text-left',
                                )}
                            >
                                <span>{tForm('fields.status.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'text-center md:text-left',
                                )}
                            >
                                <span>{tForm('fields.visibility.label')}</span>
                            </TableHead>

                            <TableHead
                                className={cn(baseClass, 'w-21 text-right')}
                            >
                                <span className="sr-only">{tForm('fields.actions.label')}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {items.map((course) => (
                            <CoursesRow
                                key={course.id}
                                course={course}
                                onRowClick={onRowClick}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
