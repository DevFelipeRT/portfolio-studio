import { DateDisplay } from '@/Components/Ui/date-display'; // Importação adicionada
import { useTranslation } from '@/i18n';
import { Briefcase } from 'lucide-react';
import { TimelineItem } from '../../../Components/TimelineItem';
import { Experience } from '../../types';
import { SectionHeader } from '../Partials/SectionHeader';
import { JSX } from 'react';

type ExperienceSectionProps = {
    experiences: Experience[];
};

/**
 * Renders the period of an experience (start date to end date/present) using DateDisplay components.
 *
 * @param {Experience} experience The experience data containing start and end dates.
 * @param {string} locale The current locale for date formatting.
 * @param {string} presentLabel Translated string for "Present".
 * @returns {JSX.Element} The rendered period string.
 */
function ExperiencePeriodDisplay({
    experience,
    locale,
    presentLabel,
}: {
    experience: Experience;
    locale: string;
    presentLabel: string;
}): JSX.Element {
    const startDateDisplay = (
        <DateDisplay
            value={experience.start_date}
            locale={locale}
            format="PP" // Usa formato de data padrão localizado (e.g., '3 Mar, 2020')
            key="start-date"
        />
    );

    // If end_date is available, display the full period: 'Start – End'
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

    // Otherwise, the experience is current: 'Start – Present'
    return (
        <>
            {startDateDisplay}
            {' – '}
            <span key="present-label">{presentLabel}</span>
        </>
    );
}

/**
 * ExperienceSection outlines relevant professional experience entries.
 */
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
    const { translate, locale } = useTranslation('home'); // locale extraído

    const hasExperiences = experiences.length > 0;

    // --- Translations for readability and separation of concerns
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

    // --- Component Logic
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
                            // Substituído formatPeriod pelo novo componente
                            period={
                                <ExperiencePeriodDisplay
                                    experience={experience}
                                    locale={locale}
                                    presentLabel={presentLabel}
                                />
                            }
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
