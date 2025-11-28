// resources/js/Pages/Home/Sections/ExperienceSection.tsx

import { useTranslation } from '@/i18n';
import { Briefcase } from 'lucide-react';
import { Experience } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';
import { TimelineItem } from '../Partials/TimelineItem';

type ExperienceSectionProps = {
    experiences: Experience[];
};

const formatPeriod = (
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
 * ExperienceSection outlines relevant professional experience entries.
 */
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
    const { translate } = useTranslation('home');

    const hasExperiences = experiences.length > 0;

    const sectionLabel = translate(
        'experience.sectionLabel',
        'Professional experience timeline',
    );

    const eyebrow = translate('experience.header.eyebrow', 'Career');
    const title = translate(
        'experience.header.title',
        'Professional Experience',
    );
    const description = translate(
        'experience.header.description',
        'A timeline of roles and responsibilities that shaped my professional journey.',
    );

    const emptyMessage = translate(
        'experience.emptyMessage',
        'No professional experience available to display yet.',
    );

    const presentLabel = translate('experience.presentLabel', 'Present');

    return (
        <section
            id="experience"
            className="flex flex-col gap-10 border-t pt-16 md:pt-24"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            {!hasExperiences && (
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            )}

            {hasExperiences && (
                <div className="relative ml-2 md:ml-0">
                    {experiences.map((experience, index) => (
                        <TimelineItem
                            key={experience.id}
                            period={formatPeriod(
                                experience.start_date,
                                experience.end_date,
                                presentLabel,
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
