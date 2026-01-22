import { Label } from '@/Components/Ui/label';
import { parsePositiveIntegerStrict } from '@/Modules/ContentManagement/utils/numbers';

interface ImageFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: number | null;
    onChange: (value: number | null) => void;
}

/**
 * ImageFieldControl renders a basic numeric input for a single image identifier.
 *
 * This control is a minimal implementation and can later be replaced or extended
 * with a full media picker integrated with the Images module.
 */
export function ImageFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: ImageFieldControlProps) {
    const handleChange = (raw: string) => {
        const next = parsePositiveIntegerStrict(raw);

        if (next === undefined) {
            return;
        }

        onChange(next);
    };

    const displayValue = value ?? '';

    return (
        <div className="space-y-1">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <input
                id={name}
                name={name}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={displayValue}
                onChange={(event) => handleChange(event.target.value)}
            />

            <p className="text-muted-foreground text-xs">
                Use a valid image ID. A dedicated media picker can be integrated
                here later.
            </p>
        </div>
    );
}
