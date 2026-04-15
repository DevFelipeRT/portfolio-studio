import { useTranslation } from '@/common/i18n';
import {
  InteractiveTableRow,
  TableActionCell,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { VisibilityBadge } from '@/components/badges';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Course } from '@/modules/courses/core/types';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
import { CalendarDays } from 'lucide-react';
import { CourseStatus, CourseStatusBadge } from './CourseStatusBadge';
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
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const status = course.status as CourseStatus;
  const visibility = course.display ? 'public' : 'private';
  const summary = truncate(course.summary ?? '', 80);

  return (
    <InteractiveTableRow
      interactive
      variant="emphasized"
      onActivate={() => onRowClick(course)}
    >
      <TableTitleCell
        className="min-w-0"
        title={course.name}
        subtitle={summary}
      />

      <TableMetaCell
        className={cn(
          tablePresets.metaCell,
          'hidden content-center sm:table-cell',
        )}
      >
        <span className="block truncate">{course.institution}</span>
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.metaCell,
          'hidden content-center lg:table-cell',
        )}
      >
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 opacity-70" />
          <TableDateText
            value={course.started_at}
            locale={locale}
            fallback={tForm('values.empty')}
          />
        </div>
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.metaCell,
          'hidden content-center lg:table-cell',
        )}
      >
        {course.completed_at ? (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 opacity-70" />
            <TableDateText
              value={course.completed_at}
              locale={locale}
              fallback={tForm('values.empty')}
            />
          </div>
        ) : (
          <span className="opacity-50">{tForm('values.empty')}</span>
        )}
      </TableMetaCell>

      <TableCell
        className={cn(
          tablePresets.statusCell,
          'hidden content-center md:table-cell',
        )}
      >
        <div className="w-fit">
          <CourseStatusBadge status={status} />
        </div>
      </TableCell>

      <TableMetaCell
        className={cn(tablePresets.statusCell, 'content-center xs:text-left')}
      >
        <VisibilityBadge
          visible={visibility === 'public'}
          publicLabel={tForm('visibility.public')}
          privateLabel={tForm('visibility.private')}
          className="mx-auto xs:mx-0"
          labelClassName="hidden xs:inline"
        />
      </TableMetaCell>

      <TableActionCell
        className={cn(tablePresets.actionCell, 'content-center')}
      >
        <CoursesRowActions course={course} onOpenDetails={() => onRowClick(course)} />
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
