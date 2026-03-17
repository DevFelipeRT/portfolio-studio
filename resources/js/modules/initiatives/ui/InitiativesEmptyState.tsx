import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLink } from '@/common/page-runtime';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { Plus } from 'lucide-react';

interface InitiativesEmptyStateProps {
    createRoute: string;
}

/**
 * InitiativesEmptyState renders an empty-state card when there are no initiatives.
 */
export function InitiativesEmptyState({
    createRoute,
}: InitiativesEmptyStateProps) {
    const { translate: tActions } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.actions,
    );
    const { translate: tForm } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.form,
    );
    return (
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle className="text-base">{tForm('emptyState.title')}</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>
                    {tForm('emptyState.description')}
                </p>

                <Button asChild size="sm">
                    <PageLink href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        {tActions('newInitiative')}
                    </PageLink>
                </Button>
            </CardContent>
        </Card>
    );
}
