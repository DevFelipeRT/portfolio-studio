import type { Course } from '@/modules/courses/core/types';
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
    const baseClass = 'text-muted-foreground text-xs font-medium text-nowrap';

    return (
        <Card className="overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">All Courses</CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                        A list of all courses and certificates registered.
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
                                <span>Course</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'hidden sm:table-cell',
                                )}
                            >
                                <span>Start Date</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'hidden sm:table-cell',
                                )}
                            >
                                <span>End Date</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'text-center md:text-left',
                                )}
                            >
                                <span>Status</span>
                            </TableHead>

                            <TableHead
                                className={cn(
                                    baseClass,
                                    'text-center md:text-left',
                                )}
                            >
                                <span>Visibility</span>
                            </TableHead>

                            <TableHead
                                className={cn(baseClass, 'w-21 text-right')}
                            >
                                <span className="sr-only">Actions</span>
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
