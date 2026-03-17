import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLink } from '@/common/page-runtime';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { Plus } from 'lucide-react';

interface InitiativeHeaderProps {
    total: number;
    visibleCount: number;
    createRoute: string;
}

/**
 * InitiativeHeader renders the in-page header area for initiatives.
 */
export function InitiativeHeader({
  total,
  visibleCount,
  createRoute,
}: InitiativeHeaderProps) {
  const { translate: tActions } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.actions,
  );
  const { translate: tForm } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.form,
  );
  const { translate: tSections } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.sections,
  );
  return (
    <div className="mb-6 space-y-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tSections('managementTitle')}
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full">
          <p className="text-muted-foreground mt-1 text-sm">
            {tForm('help.managementSubtitle')}
          </p>
        </div>

        <div className="flex justify-end gap-4 text-nowrap">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Badge variant="outline">{tForm('stats.total', { count: total })}</Badge>
            <Badge variant="outline">
              {tForm('stats.visible', { count: visibleCount })}
            </Badge>
          </div>

          <Button asChild size="sm">
            <PageLink href={createRoute}>
              <Plus className="mr-2 h-4 w-4" />
              {tActions('newInitiative')}
            </PageLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
