import { Checkbox } from '@/Components/Ui/checkbox';
import { Label } from '@/Components/Ui/label';

interface BooleanFieldControlProps {
    name: string;
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export function BooleanFieldControl({
    name,
    label,
    value,
    onChange,
}: BooleanFieldControlProps) {
    return (
        <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
            <Checkbox
                id={name}
                checked={value}
                onCheckedChange={(checked) => onChange(Boolean(checked))}
            />
            <div className="space-y-0.5">
                <Label htmlFor={name}>{label}</Label>
            </div>
        </div>
    );
}
