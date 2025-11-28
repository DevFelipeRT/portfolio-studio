// resources/js/Pages/Home/Sections/EducationSection.tsx

import { Badge } from '@/Components/Ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/Ui/card';
import { useTranslation } from '@/i18n';
import { GraduationCap } from 'lucide-react';
import { Course } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';

type EducationSectionProps = {
    courses: Course[];
};

const formatCoursePeriod = (
    startDate: string,
    endDate: string | null,
    presentLabel: string,
): string => {
    if (!endDate) {
        return `${startDate} – ${presentLabel}`;
    }

    return `${startDate} – ${endDate}`;
};

/**
 * EducationSection highlights formal and complementary education.
 */
export function EducationSection({ courses }: EducationSectionProps) {
    const { translate } = useTranslation('home');

    const hasCourses = courses.length > 0;

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
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="border-border/60 bg-card/50 hover:border-border/80 hover:bg-card/80 backdrop-blur transition-colors"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1.5">
                                        <CardTitle className="text-base leading-none font-semibold tracking-tight">
                                            {course.name}
                                        </CardTitle>

                                        <p className="text-muted-foreground text-sm font-medium">
                                            {course.institution}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                        <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap">
                                            {formatCoursePeriod(
                                                course.start_date,
                                                course.end_date,
                                                presentLabel,
                                            )}
                                        </span>

                                        <GraduationCap
                                            className="text-muted-foreground h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                {course.short_description && (
                                    <CardDescription className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                                        {course.short_description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            {course.long_description && (
                                <CardContent className="pt-0">
                                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                                        {course.long_description}
                                    </p>

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
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
