import {
  compactRichTextTheme,
  extractRichTextPlainText,
  RichTextRenderer,
} from '@/common/rich-text';
import { TableBooleanBadge, TableDetailDialog, formatTableDate, formatTableDateRange } from '@/common/table';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/common/i18n';
import { useIsMobile } from '@/hooks/useMobile';
import type { Experience } from '@/modules/experiences/core/types';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';
import { Eye, EyeOff } from 'lucide-react';

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
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={experience.position}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TableBooleanBadge
            active={experience.display}
            activeLabel={tForm('visibility.public')}
            inactiveLabel={tForm('visibility.private')}
            activeIcon={Eye}
            inactiveIcon={EyeOff}
          />
          <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
            {experience.locale}
          </span>
        </div>

        <InfoRow
          label={tForm('fields.company.label')}
          value={experience.company ?? tForm('values.empty')}
        />
        <InfoRow label={tForm('fields.period.label')} value={period} />
        <InfoRow
          label={tForm('fields.summary.label')}
          value={experience.summary ?? tForm('values.empty')}
        />
        <InfoRow
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

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label={tForm('fields.created_at.label')} value={createdLabel} />
          <InfoRow label={tForm('fields.updated_at.label')} value={updatedLabel} />
        </div>
      </div>
    </TableDetailDialog>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="text-sm">{value}</div>
    </div>
  );
}
