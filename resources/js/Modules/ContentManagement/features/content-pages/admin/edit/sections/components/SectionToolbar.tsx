import { Button } from '@/Components/Ui/button';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

interface SectionToolbarProps {
    section: PageSectionDto;
    onToggleActive?: (section: PageSectionDto) => void;
    onEdit?: (section: PageSectionDto) => void;
    onRemove?: (section: PageSectionDto) => void;
}

/**
 * Action toolbar for a single section row.
 */
export function SectionToolbar({
    section,
    onToggleActive,
    onEdit,
    onRemove,
}: SectionToolbarProps) {
    const isActive = section.is_active;

    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToggleActive?.(section)}
                aria-label={
                    isActive ? 'Deactivate section' : 'Activate section'
                }
            >
                {isActive ? (
                    <Eye className="h-4 w-4" />
                ) : (
                    <EyeOff className="h-4 w-4" />
                )}
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(section)}
                aria-label="Edit section"
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove?.(section)}
                aria-label="Remove section"
            >
                <Trash2 className="text-destructive h-4 w-4" />
            </Button>
        </div>
    );
}
