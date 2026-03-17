import { COURSES_NAMESPACES, useCoursesTranslation } from '@/modules/courses/i18n';

/**
 * CoursesEmptyState renders a friendly message when there are no courses.
 */
export function CoursesEmptyState() {
    const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);

    return (
        <div className="animate-in fade-in-50 flex h-32 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground text-sm">
                {tForm('emptyState.index')}
            </p>
        </div>
    );
}
