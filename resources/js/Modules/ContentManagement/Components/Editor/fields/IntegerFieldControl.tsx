import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import React from 'react';

interface IntegerFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: number | null;
    onChange: (value: number | null) => void;
}

export function IntegerFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: IntegerFieldControlProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const raw = event.target.value;

        if (raw.trim() === '') {
            onChange(null);
            return;
        }

        const parsed = Number.parseInt(raw, 10);

        if (Number.isNaN(parsed)) {
            onChange(null);
            return;
        }

        onChange(parsed);
    };

    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type="number"
                value={value ?? ''}
                onChange={handleChange}
            />
        </div>
    );
}
