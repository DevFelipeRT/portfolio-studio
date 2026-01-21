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
    className?: string;
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
    className,
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
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {visibleTemplates.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-left">
                                    {template.label}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {template.origin === 'content-management'
                                        ? 'Generic'
                                        : template.origin}
                                </span>
                            </div>
                            {template.description && (
                                <span className="text-muted-foreground text-xs">
                                    {template.description}
                                </span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
