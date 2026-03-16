import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLink } from '@/common/page-runtime';
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
  return (
    <div className="mb-6 space-y-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">Initiatives</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full">
          <p className="text-muted-foreground mt-1 text-sm">
            Activities you led, such as talks, workshops and community actions.
          </p>
        </div>

        <div className="flex justify-end gap-4 text-nowrap">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Badge variant="outline">Total: {total}</Badge>
            <Badge variant="outline">Visible: {visibleCount}</Badge>
          </div>

          <Button asChild size="sm">
            <PageLink href={createRoute}>
              <Plus className="mr-2 h-4 w-4" />
              New initiative
            </PageLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
