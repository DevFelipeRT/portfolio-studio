import { useGetLocale } from '@/Common/i18n';
import { RichTextRenderer } from '@/Common/RichText/RichTextRenderer';
import { DateDisplay } from '@/Components/Ui/date-display';
import { TimelineItem } from '@/Components/Ui/timeline-item';
import {
  SectionHeader,
  type SectionComponentProps,
  useSectionFieldResolver,
} from '@/Modules/ContentManagement/features/page-rendering';
import type { SectionDataValue } from '@/Modules/ContentManagement/types';
import { Briefcase } from 'lucide-react';
import { JSX } from 'react';

type CapabilityExperience = {
  id: number;
  position: string;
  company?: string | null;
  summary?: string | null;
  description?: string | null;
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
 * Experiences are expected to be provided in section data by the backend layer
 * integrating with the experiences.visible.v1 capability.
 */
export function ExperienceTimelineSection({
  section: renderModel,
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useSectionFieldResolver();
  const locale = useGetLocale();

  const targetId = renderModel.anchor || `experience-${renderModel.id}`;

  const rawExperiences =
    fieldResolver.getValue<SectionDataValue>('experiences');

  const allExperiences: CapabilityExperienceCollection = Array.isArray(
    rawExperiences,
  )
    ? rawExperiences.filter(
        (item): item is CapabilityExperience =>
          item !== null && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

  const maxItems =
    fieldResolver.getValue<number>('max_items') ??
    fieldResolver.getValue<number>('maxItems') ??
    undefined;

  const visibleExperiences: CapabilityExperienceCollection =
    typeof maxItems === 'number' && maxItems > 0
      ? allExperiences.slice(0, maxItems)
      : allExperiences;

  const hasExperiences = visibleExperiences.length > 0;

  const sectionLabel =
    fieldResolver.getValue<string>('section_label') ??
    'Professional experience timeline';

  const eyebrow = fieldResolver.getValue<string>('eyebrow') ?? 'Career';

  const title =
    fieldResolver.getValue<string>('title') ?? 'Professional Experience';

  const description =
    fieldResolver.getValue<string>('subtitle') ??
    fieldResolver.getValue<string>('description') ??
    'A timeline of roles and responsibilities that shaped my professional journey.';

  const emptyMessage =
    fieldResolver.getValue<string>('empty_message') ??
    'No professional experience available to display yet.';

  const presentLabel =
    fieldResolver.getValue<string>('present_label') ?? 'Present';

  if (!hasExperiences && !title && !description && !eyebrow) {
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
              summary={experience.summary ?? undefined}
              description={experience.description ?? undefined}
              tags={[]}
              icon={<Briefcase className="h-4 w-4" />}
              isLast={index === visibleExperiences.length - 1}
            >
              {experience.description && (
                <RichTextRenderer value={experience.description} />
              )}
            </TimelineItem>
          ))}
        </div>
      )}
    </section>
  );
}
