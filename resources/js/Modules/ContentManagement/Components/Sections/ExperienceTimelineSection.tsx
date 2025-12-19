import { TimelineItem } from '@/Components/TimelineItem';
import { DateDisplay } from '@/Components/Ui/date-display';
import { useTranslation } from '@/i18n';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { Briefcase } from 'lucide-react';
import { JSX } from 'react';

type CapabilityExperience = {
    id: number;
    position: string;
    company?: string | null;
    short_description?: string | null;
    long_description?: string | null;
    start_date: string;
    end_date?: string | null;
};

type CapabilityExperienceCollection = CapabilityExperience[];

/**
 * Renders the period of an experience (start date to end date/present) using DateDisplay components.
 */
function ExperiencePeriodDisplay({
    experience,
    locale,
    presentLabel,
}: {
    experience: CapabilityExperience;
    locale: string;
    presentLabel: string;
}): JSX.Element {
    const startDateDisplay = (
        <DateDisplay
            value={experience.start_date}
            locale={locale}
            format="PP"
            key="start-date"
        />
    );

    if (experience.end_date) {
        return (
            <>
                {startDateDisplay}
                {' – '}
                <DateDisplay
                    value={experience.end_date}
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
 * Renders an experience timeline section driven by ContentManagement capabilities data.
 *
 * Experiences are expected to be provided in section.data.experiences
 * by the backend layer integrating with the experiences.visible.v1 capability.
 */
export function ExperienceTimelineSection({
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

    const rawExperiences = data['experiences'] as unknown;

    const allExperiences: CapabilityExperienceCollection = Array.isArray(
        rawExperiences,
    )
        ? rawExperiences.filter(
              (item): item is CapabilityExperience =>
                  item !== null && typeof item === 'object',
          )
        : [];

    const maxItems =
        getNumber('max_items') ?? getNumber('maxItems') ?? undefined;

    const visibleExperiences: CapabilityExperienceCollection =
        typeof maxItems === 'number' && maxItems > 0
            ? allExperiences.slice(0, maxItems)
            : allExperiences;

    const hasExperiences = visibleExperiences.length > 0;

    const sectionLabel = translate(
        'experience.sectionLabel',
        'Professional experience timeline',
    );

    const eyebrowFromData = getString('eyebrow');
    const eyebrowFromTranslation = translate(
        'experience.header.eyebrow',
        'Career',
    );
    const eyebrow = eyebrowFromData ?? eyebrowFromTranslation;

    const titleFromData = getString('title');
    const titleFromTemplate = template?.label;
    const titleFromTranslation = translate(
        'experience.header.title',
        'Professional Experience',
    );
    const title =
        titleFromData ?? titleFromTemplate ?? titleFromTranslation ?? '';

    const descriptionFromData =
        getString('subtitle') ?? getString('description');
    const descriptionFromTemplate = template?.description ?? undefined;
    const descriptionFromTranslation = translate(
        'experience.header.description',
        'A timeline of roles and responsibilities that shaped my professional journey.',
    );
    const description =
        descriptionFromData ??
        descriptionFromTemplate ??
        descriptionFromTranslation;

    const emptyMessageFromData = getString('empty_message');
    const emptyMessageFromTranslation = translate(
        'experience.emptyMessage',
        'No professional experience available to display yet.',
    );
    const emptyMessage = emptyMessageFromData ?? emptyMessageFromTranslation;

    const presentLabelFromData = getString('present_label');
    const presentLabelFromTranslation = translate(
        'experience.presentLabel',
        'Present',
    );
    const presentLabel = presentLabelFromData ?? presentLabelFromTranslation;

    const sectionId = section.anchor || 'experience';

    if (!hasExperiences && !title && !description && !eyebrow) {
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
                description={description}
                align="left"
            />

            {!hasExperiences && (
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            )}

            {hasExperiences && (
                <div className="relative ml-2 md:ml-0">
                    {visibleExperiences.map((experience, index) => (
                        <TimelineItem
                            key={experience.id}
                            period={
                                <ExperiencePeriodDisplay
                                    experience={experience}
                                    locale={locale}
                                    presentLabel={presentLabel}
                                />
                            }
                            title={experience.position}
                            subtitle={experience.company ?? undefined}
                            short_description={
                                experience.short_description ?? undefined
                            }
                            long_description={
                                experience.long_description ?? undefined
                            }
                            tags={[]}
                            icon={<Briefcase className="h-4 w-4" />}
                            isLast={index === visibleExperiences.length - 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
