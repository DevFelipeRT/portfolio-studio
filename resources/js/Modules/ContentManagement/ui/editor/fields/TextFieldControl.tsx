import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';

interface TextFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export function TextFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: TextFieldControlProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
