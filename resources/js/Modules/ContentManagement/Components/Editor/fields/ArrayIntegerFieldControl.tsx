import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import React from 'react';

interface ArrayIntegerFieldControlProps {
    name: string;
    label: string;
    value: number[];
    onChange: (value: number[]) => void;
}

/**
 * Simple comma-separated integer list control.
 */
export function ArrayIntegerFieldControl({
    name,
    label,
    value,
    onChange,
}: ArrayIntegerFieldControlProps) {
    const textValue = value.join(', ');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const raw = event.target.value;

        if (raw.trim() === '') {
            onChange([]);
            return;
        }

        const parts = raw
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');

        const parsed = parts
            .map((part) => Number.parseInt(part, 10))
            .filter((item) => !Number.isNaN(item));

        onChange(parsed);
    };

    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                value={textValue}
                onChange={handleChange}
                placeholder="1, 2, 3"
            />
            <p className="text-muted-foreground text-xs">
                Comma-separated list of integer identifiers.
            </p>
        </div>
    );
}
