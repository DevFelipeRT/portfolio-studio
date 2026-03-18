import { useGetLocale } from '@/common/locale';
import {
  RichTextRenderer,
  compactRichTextTheme,
} from '@/common/rich-text';
import { DateDisplay } from '@/components/ui/date-display';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';
import { TimelineItem } from '@/components/ui/timeline-item';
import {
  SectionHeader,
  useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import type { SectionDataValue } from '@/modules/content-management/types';
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
export function ExperienceTimelineSection(): JSX.Element | null {
  const fieldResolver = useFieldValueResolver();
  const locale = useGetLocale();
  const { translate: tShared } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.shared,
  );
  const { translate: tSections } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.sections,
  );

  const rawExperiences =
    fieldResolver.getFieldValue<SectionDataValue>('experiences');

  const allExperiences: CapabilityExperienceCollection = Array.isArray(
    rawExperiences,
  )
    ? rawExperiences.filter(
        (item): item is CapabilityExperience =>
          item !== null && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

  const maxItems =
    fieldResolver.getFieldValue<number>('max_items') ??
    fieldResolver.getFieldValue<number>('maxItems') ??
    undefined;

  const visibleExperiences: CapabilityExperienceCollection =
    typeof maxItems === 'number' && maxItems > 0
      ? allExperiences.slice(0, maxItems)
      : allExperiences;

  const hasExperiences = visibleExperiences.length > 0;

  const sectionLabel =
    fieldResolver.getFieldValue<string>('section_label') ??
    tSections('public.sectionLabel');

  const eyebrow =
    fieldResolver.getFieldValue<string>('eyebrow') ??
    tSections('public.eyebrow');

  const title =
    fieldResolver.getFieldValue<string>('title') ?? tSections('public.title');

  const description =
    fieldResolver.getFieldValue<string>('subtitle') ??
    fieldResolver.getFieldValue<string>('description') ??
    tSections('public.description');

  const emptyMessage =
    fieldResolver.getFieldValue<string>('empty_message') ??
    tSections('public.emptyMessage');

  const presentLabel =
    fieldResolver.getFieldValue<string>('present_label') ??
    tShared('period.present');

  if (!hasExperiences && !title && !description && !eyebrow) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10" aria-label={sectionLabel}>
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
                <RichTextRenderer
                  value={experience.description}
                  theme={compactRichTextTheme}
                  className="text-sm leading-6"
                  fallbackClassName="text-sm leading-6 whitespace-pre-line"
                />
              )}
            </TimelineItem>
          ))}
        </div>
      )}
    </div>
  );
}
