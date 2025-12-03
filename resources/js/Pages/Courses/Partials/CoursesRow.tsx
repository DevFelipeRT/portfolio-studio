import { DateDisplay } from '@/Components/Ui/date-display';
import { TableCell, TableRow } from '@/Components/Ui/table';
import { useTranslation } from '@/i18n';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { Course } from '../../types';
import { CourseStatus, CourseStatusBadge } from './CourseStatusBadge';
import { CourseVisibilityBadge } from './CourseVisibilityBadge';
import { CoursesRowActions } from './CoursesRowActions';

interface CoursesRowProps {
    course: Course;
    onRowClick: (course: Course) => void;
}

/**
 * CoursesRow renders a single course row with status logic and action menu.
 */
export function CoursesRow({ course, onRowClick }: CoursesRowProps) {
    const { locale } = useTranslation();
    const status = course.status as CourseStatus;
    const visibility = course.display ? 'public' : 'private';

    return (
        <TableRow
            className="group hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onRowClick(course)}
        >
            <TableCell className="min-w-0 content-center pr-2 align-top sm:w-64">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-foreground line-clamp-1 min-w-0 truncate font-medium text-pretty hyphens-auto">
                        {course.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 min-w-0 truncate text-xs text-pretty hyphens-auto">
                        {course.institution}
                    </p>
                </div>
            </TableCell>

            <TableCell className="text-muted-foreground hidden content-center align-top text-xs whitespace-nowrap sm:table-cell">
                <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                    <DateDisplay
                        value={course.started_at}
                        locale={locale}
                        format="PP"
                    />
                </div>
            </TableCell>

            <TableCell className="text-muted-foreground hidden content-center align-top text-xs whitespace-nowrap sm:table-cell">
                {course.completed_at ? (
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                        <DateDisplay
                            value={course.completed_at}
                            locale={locale}
                            format="PP"
                        />
                    </div>
                ) : (
                    <span className="opacity-50">—</span>
                )}
            </TableCell>

            <TableCell className="content-center align-top">
                <div className="w-full md:w-fit">
                    <CourseStatusBadge status={status} className="mx-auto" />
                </div>
            </TableCell>

            <TableCell className="content-center align-top">
                <div className="w-full md:w-fit">
                    <CourseVisibilityBadge
                        visibility={visibility}
                        className="mx-auto"
                    />
                </div>
            </TableCell>

            <TableCell className="content-center align-top sm:w-12">
                <div className="flex items-center justify-end gap-1">
                    <CoursesRowActions courseId={course.id} />

                    <div className="flex h-8 w-8 items-center justify-center">
                        <ChevronRight className="text-muted-foreground hover:shadow-primary group-hover:text-primary group-hover:drop-shadow-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:drop-shadow-sm" />
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}
