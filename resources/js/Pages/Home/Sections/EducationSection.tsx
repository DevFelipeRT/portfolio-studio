import { ExpandableCard } from '@/Components/ExpandableCard';
import { Badge } from '@/Components/Ui/badge';
import { DateDisplay } from '@/Components/Ui/date-display';
import { useTranslation } from '@/i18n';
import { GraduationCap } from 'lucide-react';
import { Course } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';
import { JSX } from 'react';

type EducationSectionProps = {
    courses: Course[];
};

/**
 * Renders the period of a course (start date to end date/present) using DateDisplay components.
 *
 * @param {Course} course The course data containing start and completion dates.
 * @param {string} locale The current locale for date formatting.
 * @param {string} presentLabel Translated string for "Present".
 * @returns {JSX.Element} The rendered period string.
 */
function CoursePeriodDisplay({
    course,
    locale,
    presentLabel,
}: {
    course: Course;
    locale: string;
    presentLabel: string;
}): JSX.Element {
    // Assumption: Course type includes 'started_at' as a required date string
    const startDateDisplay = (
        <DateDisplay
            value={course.started_at}
            locale={locale}
            format="PP"
            key="start-date"
        />
    );

    // If completed_at is available, display the full period: 'Start – End'
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

    // Otherwise, the course is ongoing: 'Start – Present'
    return (
        <>
            {startDateDisplay}
            {' – '}
            <span key="present-label">{presentLabel}</span>
        </>
    );
}

/**
 * EducationSection highlights formal and complementary education.
 * Displays each course with period, category, and optional long description.
 */
export function EducationSection({ courses }: EducationSectionProps) {
    const { translate, locale } = useTranslation('home');

    // --- Translations for readability and separation of concerns
    const sectionLabel = translate(
        'education.sectionLabel',
        'Academic degree and technical courses',
    );

    const eyebrow = translate('education.header.eyebrow', 'Education');
    const title = translate(
        'education.header.title',
        'Academic Degree & Technical Courses',
    );
    const description = translate(
        'education.header.description',
        'Academic background and complementary technical courses that strengthen my profile as a software developer.',
    );

    const emptyMessage = translate(
        'education.emptyMessage',
        'No education records available to display yet.',
    );

    const presentLabel = translate('education.presentLabel', 'Present');

    const notHighlightedLabel = translate(
        'education.badge.notHighlighted',
        'Not currently highlighted',
    );

    // --- Component Logic
    const hasCourses = courses.length > 0;

    return (
        <section
            id="education"
            className="flex flex-col gap-10 border-t pt-16 md:pt-24"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            {!hasCourses && (
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            )}

            {hasCourses && (
                <div className="grid gap-6 md:grid-cols-2">
                    {courses.map((course) => {
                        const categoryLabel = translate(
                            `education.categories.${course.category}`,
                        );

                        const hasLongDescription =
                            !!course.description &&
                            course.description.trim() !== '';

                        return (
                            <ExpandableCard
                                key={course.id}
                                title={course.name}
                                subtitle={course.institution}
                                description={course.summary}
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

                                {!course.display && (
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
