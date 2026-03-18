import { useGetLocale } from '@/common/locale';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { Badge } from '@/components/ui/badge';
import { DateDisplay } from '@/components/ui/date-display';
import { ExpandableCard } from '@/components/ui/expandable-card';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
import {
  SectionHeader,
  useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import type { SectionDataValue } from '@/modules/content-management/types';
import { GraduationCap } from 'lucide-react';
import { JSX } from 'react';

type CapabilityCourse = {
  id: number;
  name: string;
  institution?: string | null;
  summary?: string | null;
  description?: string | null;
  category?: string | null;
  display?: boolean;
  started_at?: string | null;
  completed_at?: string | null;
};

type CapabilityCourseCollection = CapabilityCourse[];

/**
 * Renders the period of a course (start date to end date or present) using DateDisplay components.
 */
function CoursePeriodDisplay({
  course,
  locale,
  presentLabel,
}: {
  course: CapabilityCourse;
  locale: string;
  presentLabel: string;
}): JSX.Element {
  const startDateDisplay = (
    <DateDisplay
      value={course.started_at}
      locale={locale}
      format="PP"
      key="start-date"
    />
  );

  if (course.completed_at) {
    return (
      <>
        {startDateDisplay}
        {' – '}
        <DateDisplay
          value={course.completed_at}
          locale={locale}
          format="PP"
          key="end-date"
        />
      </>
    );
  }

  return (
    <>
      {startDateDisplay}
      {' – '}
      <span key="present-label">{presentLabel}</span>
    </>
  );
}

/**
 * Renders a courses highlight grid section driven by ContentManagement capabilities data.
 *
 * Courses are expected to be provided in section data by the backend layer
 * integrating with the courses.visible.v1 capability.
 */
export function CoursesHighlightGridSection(): JSX.Element | null {
  const fieldResolver = useFieldValueResolver();
  const locale = useGetLocale();
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const { translate: tSections } = useCoursesTranslation(
    COURSES_NAMESPACES.sections,
  );

  const rawCourses = fieldResolver.getFieldValue<SectionDataValue>('courses');

  const allCourses: CapabilityCourseCollection = Array.isArray(rawCourses)
    ? rawCourses.filter(
        (item): item is CapabilityCourse =>
          item !== null && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

  const maxItems =
    fieldResolver.getFieldValue<number>('max_items') ??
    fieldResolver.getFieldValue<number>('maxItems') ??
    undefined;

  const visibleCourses: CapabilityCourseCollection =
    typeof maxItems === 'number' && maxItems > 0
      ? allCourses.slice(0, maxItems)
      : allCourses;

  const hasCourses = visibleCourses.length > 0;

  const sectionLabel =
    fieldResolver.getFieldValue<string>('section_label') ??
    tSections('public.sectionLabel');

  const eyebrow =
    fieldResolver.getFieldValue<string>('eyebrow') ??
    tSections('public.eyebrow');

  const title =
    fieldResolver.getFieldValue<string>('title') ??
    tSections('public.title');

  const subtitle =
    fieldResolver.getFieldValue<string>('subtitle') ??
    fieldResolver.getFieldValue<string>('description') ??
    tSections('public.description');

  const emptyMessage =
    fieldResolver.getFieldValue<string>('empty_message') ??
    tSections('public.emptyMessage');

  const presentLabel =
    fieldResolver.getFieldValue<string>('present_label') ??
    tForm('values.present');

  const notHighlightedLabel =
    fieldResolver.getFieldValue<string>('not_highlighted_label') ??
    tForm('visibility.notHighlighted');

  if (!hasCourses && !title && !subtitle && !eyebrow) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10" aria-label={sectionLabel}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={subtitle}
        align="left"
      />

      {!hasCourses && (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      )}

      {hasCourses && (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleCourses.map((course) => {
            const rawCategory = course.category ?? undefined;
            const categoryLabel =
              rawCategory && rawCategory.trim().length > 0
                ? rawCategory
                : undefined;

            const hasLongDescription =
              !!course.description && course.description.trim() !== '';

            return (
              <ExpandableCard
                key={course.id}
                title={course.name}
                subtitle={course.institution ?? undefined}
                description={course.summary ?? undefined}
                icon={
                  <GraduationCap
                    className="text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                }
                meta={
                  <CoursePeriodDisplay
                    course={course}
                    locale={locale}
                    presentLabel={presentLabel}
                  />
                }
                tags={categoryLabel ? [categoryLabel] : []}
              >
                {hasLongDescription && (
                  <RichTextRenderer
                    value={course.description!}
                    className="text-xs leading-relaxed sm:text-sm"
                  />
                )}

                {course.display === false && (
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className="text-[0.7rem] font-normal"
                    >
                      {notHighlightedLabel}
                    </Badge>
                  </div>
                )}
              </ExpandableCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
