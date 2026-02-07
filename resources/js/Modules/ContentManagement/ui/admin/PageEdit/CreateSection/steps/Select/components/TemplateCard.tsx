import { Badge } from '@/Components/Ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/Ui/card';
import { cn } from '@/lib/utils';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/core/types';

interface TemplateCardProps {
  template: TemplateDefinitionDto;
  isSelected: boolean;
  onSelect: (templateKey: string) => void;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  const originLabel =
    template.origin === 'content-management' ? 'Generic' : template.origin;
  const visibleSlots = (template.allowed_slots ?? []).slice(0, 3);
  const hiddenSlotCount = Math.max(
    (template.allowed_slots ?? []).length - visibleSlots.length,
    0,
  );
  const description = template.description?.trim() ?? '';

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(template.key)}
      className="group h-full w-full text-left focus-visible:outline-none"
    >
      <Card
        className={cn(
          'hover:border-foreground/40 group-focus-visible:ring-ring flex h-full flex-col overflow-hidden transition-colors group-focus-visible:ring-2 group-focus-visible:ring-offset-2',
          isSelected
            ? 'border-foreground ring-foreground/25 ring-1'
            : 'border-border',
        )}
      >
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm leading-snug">
              {template.label}
            </CardTitle>
            <Badge
              variant="outline"
              className="shrink-0 tracking-wide uppercase"
            >
              {originLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          {description ? (
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {description}
            </p>
          ) : (
            <p className="text-muted-foreground/70 text-sm">No description</p>
          )}
        </CardContent>
        <CardFooter className="min-h-12 border-t p-4 pt-3">
          {visibleSlots.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {visibleSlots.map((slot) => (
                <Badge key={slot} variant="outline" className="text-[0.7rem]">
                  {slot}
                </Badge>
              ))}
              {hiddenSlotCount > 0 && (
                <Badge variant="outline" className="text-[0.7rem]">
                  +{hiddenSlotCount}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground/70 text-xs">
              No slots restrictions
            </span>
          )}
        </CardFooter>
      </Card>
    </button>
  );
}
