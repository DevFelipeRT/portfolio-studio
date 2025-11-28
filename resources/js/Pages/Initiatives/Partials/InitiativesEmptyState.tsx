import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { Link } from '@inertiajs/react';
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
    return (
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle className="text-base">No initiatives yet</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Start by registering a talk, workshop or action you led so
                    it can be highlighted in your portfolio.
                </p>

                <Button asChild size="sm">
                    <Link href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        New initiative
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
