import { Briefcase } from 'lucide-react';
import { Experience } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';
import { TimelineItem } from '../Partials/TimelineItem';

type ExperienceSectionProps = {
    experiences: Experience[];
};

const formatPeriod = (startDate: string, endDate: string | null): string => {
    if (!endDate) {
        return `${startDate} – Present`;
    }

    return `${startDate} – ${endDate}`;
};

/**
 * ExperienceSection outlines relevant professional experience entries.
 */
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
    const hasExperiences = experiences.length > 0;

    return (
        <section
            id="experience"
            className="flex flex-col gap-10 border-t pt-16 md:pt-24"
        >
            <SectionHeader
                eyebrow="Career"
                title="Professional Experience"
                description="A timeline of roles and responsibilities that shaped my professional journey."
                align="left"
            />

            {!hasExperiences && (
                <p className="text-muted-foreground text-sm">
                    No professional experience available to display yet.
                </p>
            )}

            {hasExperiences && (
                <div className="relative ml-2 md:ml-0">
                    {experiences.map((experience, index) => (
                        <TimelineItem
                            key={experience.id}
                            period={formatPeriod(
                                experience.start_date,
                                experience.end_date,
                            )}
                            title={experience.position}
                            subtitle={experience.company}
                            short_description={experience.short_description}
                            long_description={experience.long_description}
                            tags={[]}
                            icon={<Briefcase className="h-4 w-4" />}
                            isLast={index === experiences.length - 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
