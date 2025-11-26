import { Badge } from '@/Components/Ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/Ui/card';
import { GraduationCap } from 'lucide-react';
import { Course } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';

type EducationSectionProps = {
    courses: Course[];
};

const formatCoursePeriod = (
    startDate: string,
    endDate: string | null,
): string => {
    if (!endDate) {
        return `${startDate} – Present`;
    }

    return `${startDate} – ${endDate}`;
};

/**
 * EducationSection highlights formal and complementary education.
 */
export function EducationSection({ courses }: EducationSectionProps) {
    const hasCourses = courses.length > 0;

    return (
        <section
            id="education"
            className="flex flex-col gap-10 border-t pt-16 md:pt-24"
        >
            <SectionHeader
                eyebrow="Education"
                title="Academic Degree & Technical Courses"
                description="Academic background and complementary technical courses that strengthen my profile as a software developer."
                align="left"
            />

            {!hasCourses && (
                <p className="text-muted-foreground text-sm">
                    No education records available to display yet.
                </p>
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
                                                Not currently highlighted
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
