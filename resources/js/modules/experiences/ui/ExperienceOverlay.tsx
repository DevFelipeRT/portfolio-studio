import {
  compactRichTextTheme,
  extractRichTextPlainText,
  RichTextRenderer,
} from '@/common/rich-text';
import { useTranslation } from '@/common/i18n';
import {
  formatTableDate,
  formatTableDateRange,
  ItemDialog,
} from '@/common/table';
import { VisibilityBadge } from '@/components/badges';
import { useIsMobile } from '@/hooks/useMobile';
import type { Experience } from '@/modules/experiences/core/types';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';
import { OverlayInfoRow } from './_partials';

interface ExperienceOverlayProps {
  open: boolean;
  experience: Experience | null;
  onOpenChange: (open: boolean) => void;
}

export function ExperienceOverlay({
  open,
  experience,
  onOpenChange,
}: ExperienceOverlayProps) {
  const { locale } = useTranslation();
  const isMobile = useIsMobile();
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const { translate: tShared } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.shared,
  );

  if (!experience) {
    return null;
  }

  const period = formatTableDateRange(experience.start_date, experience.end_date, {
    locale,
    isMobile,
    presentLabel: tShared('period.present'),
    fallback: tForm('values.empty'),
  });
  const updatedLabel = formatTableDate(experience.updated_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });
  const hasDescription =
    extractRichTextPlainText(experience.description).length > 0;
  const createdLabel = formatTableDate(experience.created_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });

  return (
    <ItemDialog open={open} onOpenChange={onOpenChange}>
        <ItemDialog.Content className="max-w-2xl">
          <ItemDialog.Header>
            <ItemDialog.Main>
            <ItemDialog.Heading>
              <ItemDialog.Title>{experience.position}</ItemDialog.Title>

              {experience.summary ? (
                <ItemDialog.Description>
                  {experience.summary}
                </ItemDialog.Description>
              ) : null}
            </ItemDialog.Heading>

            <ItemDialog.Badges>
              <VisibilityBadge
                visible={experience.display}
                publicLabel={tForm('visibility.public')}
                privateLabel={tForm('visibility.private')}
              />
              <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
                {experience.locale}
              </span>
            </ItemDialog.Badges>
          </ItemDialog.Main>

          <ItemDialog.Metadata>
            <span>{tForm('fields.period.label')}: {period}</span>
            <span>{tForm('fields.created_at.label')}: {createdLabel}</span>
            <span>{tForm('fields.updated_at.label')}: {updatedLabel}</span>
          </ItemDialog.Metadata>
        </ItemDialog.Header>

        <ItemDialog.Body className="space-y-6">
          <OverlayInfoRow
            label={tForm('fields.company.label')}
            value={experience.company ?? tForm('values.empty')}
          />
          <OverlayInfoRow
            label={tForm('fields.description.label')}
            value={
              hasDescription ? (
                <RichTextRenderer
                  value={experience.description}
                  className="text-foreground text-sm leading-relaxed"
                  fallbackClassName="text-foreground text-sm leading-relaxed whitespace-pre-line"
                  theme={compactRichTextTheme}
                />
              ) : (
                tForm('values.empty')
              )
            }
          />
        </ItemDialog.Body>
      </ItemDialog.Content>
    </ItemDialog>
  );
}
