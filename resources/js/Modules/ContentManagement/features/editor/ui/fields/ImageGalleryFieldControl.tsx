import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { parseCommaSeparatedPositiveIntegers } from '@/Modules/ContentManagement/shared/numbers';

interface ImageGalleryFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: number[];
    onChange: (value: number[]) => void;
}

/**
 * ImageGalleryFieldControl renders a simple comma-separated list of image identifiers.
 *
 * Each entry is a positive integer. Ordering is preserved and used as gallery position.
 */
export function ImageGalleryFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: ImageGalleryFieldControlProps) {
    const displayValue =
        value.length > 0 ? value.map((id) => String(id)).join(', ') : '';

    const handleChange = (raw: string) => {
        onChange(parseCommaSeparatedPositiveIntegers(raw));
    };

    return (
        <div className="space-y-1">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Textarea
                id={name}
                name={name}
                rows={3}
                value={displayValue}
                onChange={(event) => handleChange(event.target.value)}
            />

            <p className="text-muted-foreground text-xs">
                Enter image IDs separated by commas. The order will be used as
                the gallery ordering.
            </p>
        </div>
    );
}
