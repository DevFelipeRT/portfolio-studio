import { PageLink } from '@/common/page-runtime';
import {
  TableActionsMenu,
  TableActionsMenuItem,
} from '@/common/table';
import type { Course } from '@/modules/courses/core/types';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface CourseRowActionsProps {
  course: Course;
  onOpenDetails: () => void;
}

export function CoursesRowActions({
  course,
  onOpenDetails,
}: CourseRowActionsProps) {
  const { translate: tActions } = useCoursesTranslation(COURSES_NAMESPACES.actions);

  return (
    <TableActionsMenu triggerLabel={tActions('openMenu')}>
      <TableActionsMenuItem onClick={onOpenDetails}>
        <Eye className="mr-2 h-4 w-4" />
        <span>{tActions('viewCourse')}</span>
      </TableActionsMenuItem>

      <TableActionsMenuItem asChild>
        <PageLink
          href={route('courses.edit', course.id)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>{tActions('editCourse')}</span>
        </PageLink>
      </TableActionsMenuItem>

      <TableActionsMenuItem asChild>
        <PageLink
          href={route('courses.destroy', course.id)}
          method="delete"
          as="button"
          className="text-destructive focus:text-destructive w-full cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{tActions('deleteCourse')}</span>
        </PageLink>
      </TableActionsMenuItem>
    </TableActionsMenu>
  );
}
