import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLink } from '@/common/page-runtime';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';
import { Plus } from 'lucide-react';

interface ImageHeaderProps {
    total: number;
    createRoute: string;
}

/**
 * ImageHeader renders the page header and summary for global images.
 */
export function ImageHeader({ total, createRoute }: ImageHeaderProps) {
    const { translate: tActions } = useImagesTranslation(IMAGES_NAMESPACES.actions);
    const { translate: tImages } = useImagesTranslation(IMAGES_NAMESPACES.images);

    return (
        <div className="mb-4 flex flex-col gap-3 border-b pb-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">
                    {tImages('page.title')}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    {tImages('page.description')}
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline">
                        {tImages('summary.total', { count: total })}
                    </Badge>
                </div>

                <Button asChild size="sm">
                    <PageLink href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        {tActions('uploadImage')}
                    </PageLink>
                </Button>
            </div>
        </div>
    );
}
