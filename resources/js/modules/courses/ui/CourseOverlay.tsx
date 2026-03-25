import { useTranslation } from '@/common/i18n';
import type { Course } from '@/modules/courses/core/types';
import { COURSES_NAMESPACES, useCoursesTranslation } from '@/modules/courses/i18n';
import {
  compactRichTextTheme,
  extractRichTextPlainText,
  RichTextRenderer,
} from '@/common/rich-text';
import {
  formatTableDateRange,
  TableBooleanBadge,
  TableDetailDialog,
} from '@/common/table';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Eye, EyeOff } from 'lucide-react';
import { CourseStatusBadge, type CourseStatus } from './table/CourseStatusBadge';

interface CourseOverlayProps {
    open: boolean;
    course: Course | null;
    onOpenChange: (open: boolean) => void;
}

/**
 * CourseOverlay displays the full details of a course entry in a modal dialog.
 */
export function CourseOverlay({
  open,
  course,
  onOpenChange,
}: CourseOverlayProps) {
  const { locale } = useTranslation();
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);

  if (!course) {
    return null;
  }

  // Alias 'course' to 'details' to ensure TypeScript narrowing persists
  // correctly inside closures (like renderStatus) and JSX.
  const details = course;
  const hasDescription = extractRichTextPlainText(details.description).length > 0;
  const dateRangeLabel = formatTableDateRange(
    details.started_at,
    details.completed_at,
    {
      locale,
      fallback: tForm('values.empty'),
      presentLabel: tForm('values.present'),
    },
  );

  return (
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex flex-wrap items-center gap-2 text-base leading-none">
          <span className="font-semibold">{details.name}</span>
          <Badge variant="outline" className="text-xs font-normal">
            {details.institution}
          </Badge>
        </div>
      }
      className="max-w-xl"
    >
      <div className="text-muted-foreground space-y-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <CourseStatusBadge status={details.status as CourseStatus} />

          <div className="bg-muted flex items-center gap-1.5 rounded-md px-2 py-0.5">
            <CalendarDays className="h-3.5 w-3.5 opacity-70" />
            <span>{dateRangeLabel}</span>
          </div>

          <TableBooleanBadge
            active={details.display}
            activeLabel={tForm('visibility.public')}
            inactiveLabel={tForm('visibility.private')}
            activeIcon={Eye}
            inactiveIcon={EyeOff}
          />
        </div>

        {details.summary ? (
          <p className="text-foreground/80 font-medium text-balance">
            {details.summary}
          </p>
        ) : null}
      </div>

      <Separator className="my-2" />

      <div className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          {tForm('overlay.about')}
        </p>

        <div>
          {hasDescription ? (
            <RichTextRenderer
              value={details.description}
              className="text-foreground text-sm leading-relaxed"
              fallbackClassName="text-foreground text-sm leading-relaxed whitespace-pre-line"
              theme={compactRichTextTheme}
            />
          ) : (
            <span className="text-muted-foreground italic">
              {tForm('overlay.noDescription')}
            </span>
          )}
        </div>
      </div>
    </TableDetailDialog>
  );
}
