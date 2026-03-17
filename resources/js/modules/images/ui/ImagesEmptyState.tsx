import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLink } from '@/common/page-runtime';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';
import { Plus } from 'lucide-react';

interface ImagesEmptyStateProps {
    createRoute: string;
}

/**
 * Empty state displayed when there are no images to list.
 */
export function ImagesEmptyState({ createRoute }: ImagesEmptyStateProps) {
    const { translate: tActions } = useImagesTranslation(IMAGES_NAMESPACES.actions);
    const { translate: tImages } = useImagesTranslation(IMAGES_NAMESPACES.images);

    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="space-y-1">
                    <h2 className="text-base font-semibold">
                        {tImages('emptyState.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-md text-sm">
                        {tImages('emptyState.description')}
                    </p>
                </div>

                <Button asChild size="sm">
                    <PageLink href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        {tActions('uploadImage')}
                    </PageLink>
                </Button>
            </CardContent>
        </Card>
    );
}
