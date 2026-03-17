import { PageLink } from '@/common/page-runtime';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
import { PlusCircle } from 'lucide-react';

/**
 * CoursesHeader renders the in-page header area for the courses index.
 */
export function CoursesHeader() {
  const { translate: tActions } = useCoursesTranslation(
    COURSES_NAMESPACES.actions,
  );
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const { translate: tSections } = useCoursesTranslation(
    COURSES_NAMESPACES.sections,
  );

  return (
    <div className="mb-6 space-y-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tSections('managementTitle')}
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground mt-1 text-sm">
            {tForm('help.managementSubtitle')}
          </p>
        </div>

        <PageLink
          href={route('courses.create')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {tActions('newCourse')}
        </PageLink>
      </div>
    </div>
  );
}
