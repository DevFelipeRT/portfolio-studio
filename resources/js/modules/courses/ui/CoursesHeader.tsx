import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';

/**
 * CoursesHeader renders the in-page header area for the courses index.
 */
export function CoursesHeader() {
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const { translate: tSections } = useCoursesTranslation(
    COURSES_NAMESPACES.sections,
  );

  return (
    <div className="mb-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tSections('managementTitle')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {tForm('help.managementSubtitle')}
        </p>
      </div>
    </div>
  );
}
