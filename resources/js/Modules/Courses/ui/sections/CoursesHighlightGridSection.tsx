import { useGetLocale } from '@/Common/i18n';
import { Badge } from '@/Components/Ui/badge';
import { DateDisplay } from '@/Components/Ui/date-display';
import { ExpandableCard } from '@/Components/Ui/expandable-card';
import {
  SectionHeader,
  type SectionComponentProps,
  useSectionFieldResolver,
} from '@/Modules/ContentManagement/features/page-rendering';
import type { SectionDataValue } from '@/Modules/ContentManagement/types';
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
export function CoursesHighlightGridSection({
  section: renderModel,
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useSectionFieldResolver();
  const locale = useGetLocale();

  const targetId = renderModel.anchor || `education-${renderModel.id}`;

  const rawCourses = fieldResolver.getValue<SectionDataValue>('courses');

  const allCourses: CapabilityCourseCollection = Array.isArray(rawCourses)
    ? rawCourses.filter(
        (item): item is CapabilityCourse =>
          item !== null && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

  const maxItems =
    fieldResolver.getValue<number>('max_items') ??
    fieldResolver.getValue<number>('maxItems') ??
    undefined;

  const visibleCourses: CapabilityCourseCollection =
    typeof maxItems === 'number' && maxItems > 0
      ? allCourses.slice(0, maxItems)
      : allCourses;

  const hasCourses = visibleCourses.length > 0;

  const sectionLabel =
    fieldResolver.getValue<string>('section_label') ??
    'Academic degree and technical courses';

  const eyebrow = fieldResolver.getValue<string>('eyebrow') ?? 'Education';

  const title =
    fieldResolver.getValue<string>('title') ??
    'Academic Degree & Technical Courses';

  const subtitle =
    fieldResolver.getValue<string>('subtitle') ??
    fieldResolver.getValue<string>('description') ??
    'Academic background and complementary technical courses that strengthen my profile as a software developer.';

  const emptyMessage =
    fieldResolver.getValue<string>('empty_message') ??
    'No education records available to display yet.';

  const presentLabel =
    fieldResolver.getValue<string>('present_label') ?? 'Present';

  const notHighlightedLabel =
    fieldResolver.getValue<string>('not_highlighted_label') ??
    'Not currently highlighted';

  if (!hasCourses && !title && !subtitle && !eyebrow) {
    return null;
  }

  const baseSectionClassName = 'flex flex-col gap-10';

  const resolvedSectionClassName = [baseSectionClassName, className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <section
      id={targetId}
      className={resolvedSectionClassName}
      aria-label={sectionLabel}
    >
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
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {course.description}
                  </p>
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
    </section>
  );
}
