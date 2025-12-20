import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';

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
        const parts = raw
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');

        const ids: number[] = [];

        for (const part of parts) {
            if (!/^\d+$/.test(part)) {
                continue;
            }

            const next = Number.parseInt(part, 10);

            if (Number.isNaN(next) || next < 1) {
                continue;
            }

            ids.push(next);
        }

        onChange(ids);
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
