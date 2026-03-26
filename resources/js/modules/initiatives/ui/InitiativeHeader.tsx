import { Badge } from '@/components/ui/badge';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';

interface InitiativeHeaderProps {
    total: number;
    visibleCount: number;
}

/**
 * InitiativeHeader renders the in-page header area for initiatives.
 */
export function InitiativeHeader({
  total,
  visibleCount,
}: InitiativeHeaderProps) {
  const { translate: tForm } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.form,
  );
  const { translate: tSections } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.sections,
  );
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tSections('managementTitle')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {tForm('help.managementSubtitle')}
        </p>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-xs sm:pt-1">
        <Badge variant="outline">{tForm('stats.total', { count: total })}</Badge>
        <Badge variant="outline">
          {tForm('stats.public', { count: visibleCount })}
        </Badge>
      </div>
    </div>
  );
}
