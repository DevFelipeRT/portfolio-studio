import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface InitiativeHeaderProps {
    total: number;
    visibleCount: number;
    createRoute: string;
}

/**
 * InitiativeHeader renders the page header and summary for initiatives.
 */
export function InitiativeHeader({
    total,
    visibleCount,
    createRoute,
}: InitiativeHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className='w-full'>
                <p className="text-muted-foreground mt-1 text-sm">
                    Activities you led, such as talks, workshops and community
                    actions.
                </p>
            </div>

            <div className='flex gap-4 text-nowrap justify-end'>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline">Total: {total}</Badge>
                    <Badge variant="outline">Visible: {visibleCount}</Badge>
                </div>

                <Button asChild size="sm">
                    <Link href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        New initiative
                    </Link>
                </Button>
            </div>
        </div>
    );
}
