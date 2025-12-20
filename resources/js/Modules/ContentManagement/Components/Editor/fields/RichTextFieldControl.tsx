import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';

interface RichTextFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export function RichTextFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: RichTextFieldControlProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
                id={name}
                name={name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={6}
            />
            <p className="text-muted-foreground text-xs">
                Rich text content. Formatting support can be enhanced later.
            </p>
        </div>
    );
}
