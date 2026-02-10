import { Badge } from '@/Components/Ui/badge';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';

interface TemplateSummaryProps {
  template: TemplateDefinitionDto;
}

export function TemplateSummary({ template }: TemplateSummaryProps) {
  const originLabel =
    template.origin === 'content-management' ? 'Generic' : template.origin;
  const allowedSlots = template.allowed_slots ?? [];
  const description = template.description?.trim() ?? '';

  return (
    <div className="bg-muted/40 rounded-md border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{template.label}</p>
          {description ? (
            <p className="text-muted-foreground text-xs">{description}</p>
          ) : null}
        </div>
        <Badge variant="outline" className="shrink-0 tracking-wide uppercase">
          {originLabel}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {allowedSlots.length > 0 ? (
          allowedSlots.map((slot) => (
            <Badge key={slot} variant="outline" className="text-[0.7rem]">
              {slot}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground/70 text-xs">
            No slots restrictions
          </span>
        )}
      </div>
    </div>
  );
}
