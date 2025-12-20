import { Button } from '@/Components/Ui/button';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';

interface PageSectionReorderControlProps {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

/**
 * Vertical reorder control for a section row.
 */
export function PageSectionReorderControl({
    canMoveUp,
    canMoveDown,
    onMoveUp,
    onMoveDown,
}: PageSectionReorderControlProps) {
    return (
        <div className="flex flex-col items-center gap-1 pr-1">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                aria-label="Move section up"
                className="h-6 w-6"
            >
                <ArrowUp className="h-3 w-3" />
            </Button>

            <div className="bg-background text-muted-foreground rounded-md border p-1">
                <GripVertical className="h-3 w-3" />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                aria-label="Move section down"
                className="h-6 w-6"
            >
                <ArrowDown className="h-3 w-3" />
            </Button>
        </div>
    );
}
