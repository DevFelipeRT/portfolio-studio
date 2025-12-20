import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/Ui/select';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import React from 'react';

interface TemplateSelectorProps {
    templates: TemplateDefinitionDto[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /**
     * Optional slot filter. When provided, only templates that
     * declare this slot in allowed_slots will be shown.
     */
    filterBySlot?: string | null;
}

/**
 * Reusable selector for template definitions.
 *
 * This component only concerns itself with listing templates and
 * emitting the selected key. Layout and label are handled by the caller.
 */
export function TemplateSelector({
    templates,
    value,
    onChange,
    placeholder = 'Select a template',
    disabled = false,
    filterBySlot = null,
}: TemplateSelectorProps) {
    const normalizedSlot =
        typeof filterBySlot === 'string' && filterBySlot.trim() !== ''
            ? filterBySlot.trim()
            : null;

    const visibleTemplates = React.useMemo(() => {
        if (!normalizedSlot) {
            return templates;
        }

        return templates.filter((template) =>
            template.allowed_slots.includes(normalizedSlot),
        );
    }, [templates, normalizedSlot]);

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {visibleTemplates.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                        {template.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
