import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface ImageHeaderProps {
    total: number;
    createRoute: string;
}

/**
 * ImageHeader renders the page header and summary for global images.
 */
export function ImageHeader({ total, createRoute }: ImageHeaderProps) {
    return (
        <div className="mb-4 flex flex-col gap-3 border-b pb-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">Images</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Centralized management of all images used across projects
                    and initiatives.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline">Total: {total}</Badge>
                </div>

                <Button asChild size="sm">
                    <Link href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload image
                    </Link>
                </Button>
            </div>
        </div>
    );
}
