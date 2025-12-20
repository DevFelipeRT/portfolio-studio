import { ExpandableCard } from '@/Components/ExpandableCard';
import { Badge } from '@/Components/Ui/badge';
import { DateDisplay } from '@/Components/Ui/date-display';
import { useTranslation } from '@/i18n';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
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
 * Courses are expected to be provided in section.data.courses
 * by the backend layer integrating with the courses.visible.v1 capability.
 */
export function CoursesHighlightGridSection({
    section,
    template,
}: SectionComponentProps): JSX.Element | null {
    const { translate, locale } = useTranslation('home');

    const data = (section.data ?? {}) as SectionData;

    const getString = (key: string): string | undefined => {
        const value = data[key];

        if (typeof value === 'string') {
            return value;
        }

        return undefined;
    };

    const getNumber = (key: string): number | undefined => {
        const value = data[key];

        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        return undefined;
    };

    const rawCourses = data['courses'] as unknown;

    const allCourses: CapabilityCourseCollection = Array.isArray(rawCourses)
        ? rawCourses.filter(
              (item): item is CapabilityCourse =>
                  item !== null && typeof item === 'object',
          )
        : [];

    const maxItems =
        getNumber('max_items') ?? getNumber('maxItems') ?? undefined;

    const visibleCourses: CapabilityCourseCollection =
        typeof maxItems === 'number' && maxItems > 0
            ? allCourses.slice(0, maxItems)
            : allCourses;

    const hasCourses = visibleCourses.length > 0;

    const sectionLabel = translate(
        'education.sectionLabel',
        'Academic degree and technical courses',
    );

    const eyebrowFromData = getString('eyebrow');
    const eyebrowFromTranslation = translate(
        'education.header.eyebrow',
        'Education',
    );
    const eyebrow = eyebrowFromData ?? eyebrowFromTranslation;

    const titleFromData = getString('title');
    const titleFromTemplate = template?.label;
    const titleFromTranslation = translate(
        'education.header.title',
        'Academic Degree & Technical Courses',
    );
    const title =
        titleFromData ?? titleFromTemplate ?? titleFromTranslation ?? '';

    const subtitleFromData = getString('subtitle') ?? getString('description');
    const subtitleFromTemplate = template?.description ?? undefined;
    const subtitleFromTranslation = translate(
        'education.header.description',
        'Academic background and complementary technical courses that strengthen my profile as a software developer.',
    );
    const subtitle =
        subtitleFromData ?? subtitleFromTemplate ?? subtitleFromTranslation;

    const emptyMessageFromData = getString('empty_message');
    const emptyMessageFromTranslation = translate(
        'education.emptyMessage',
        'No education records available to display yet.',
    );
    const emptyMessage = emptyMessageFromData ?? emptyMessageFromTranslation;

    const presentLabelFromData = getString('present_label');
    const presentLabelFromTranslation = translate(
        'education.presentLabel',
        'Present',
    );
    const presentLabel = presentLabelFromData ?? presentLabelFromTranslation;

    const notHighlightedLabelFromData = getString('not_highlighted_label');
    const notHighlightedLabelFromTranslation = translate(
        'education.badge.notHighlighted',
        'Not currently highlighted',
    );
    const notHighlightedLabel =
        notHighlightedLabelFromData ?? notHighlightedLabelFromTranslation;

    const sectionId = section.anchor || 'education';

    if (!hasCourses && !title && !subtitle && !eyebrow) {
        return null;
    }

    return (
        <section
            id={sectionId}
            className="flex flex-col gap-10 border-t pt-16 md:pt-24"
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
                        const categoryKey = course.category
                            ? `education.categories.${course.category}`
                            : undefined;

                        const categoryLabel =
                            categoryKey !== undefined
                                ? translate(categoryKey)
                                : undefined;

                        const hasLongDescription =
                            !!course.description &&
                            course.description.trim() !== '';

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
