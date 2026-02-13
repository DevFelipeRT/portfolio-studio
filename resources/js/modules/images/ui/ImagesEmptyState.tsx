import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface ImagesEmptyStateProps {
    createRoute: string;
}

/**
 * Empty state displayed when there are no images to list.
 */
export function ImagesEmptyState({ createRoute }: ImagesEmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="space-y-1">
                    <h2 className="text-base font-semibold">
                        No images available
                    </h2>
                    <p className="text-muted-foreground max-w-md text-sm">
                        Start by uploading your first image. Images can be
                        reused across projects and initiatives and managed
                        centrally here.
                    </p>
                </div>

                <Button asChild size="sm">
                    <Link href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload image
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
