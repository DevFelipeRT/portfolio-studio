import { Button } from '@/Components/Ui/button';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import type { ButtonHTMLAttributes, Ref } from 'react';

interface ReorderSectionControlProps {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    dragHandleRef?: Ref<HTMLButtonElement>;
}

/**
 * Vertical reorder control for a section row.
 */
export function ReorderSectionControl({
    canMoveUp,
    canMoveDown,
    onMoveUp,
    onMoveDown,
    dragHandleProps,
    dragHandleRef,
}: ReorderSectionControlProps) {
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

            <button
                type="button"
                ref={dragHandleRef}
                className="bg-background text-muted-foreground touch-none cursor-grab rounded-md border p-1 transition active:cursor-grabbing"
                aria-label="Drag to reorder section"
                {...dragHandleProps}
            >
                <GripVertical className="h-3 w-3" />
            </button>

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
