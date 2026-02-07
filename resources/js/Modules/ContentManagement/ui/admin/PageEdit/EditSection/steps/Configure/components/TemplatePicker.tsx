import { Label } from '@/Components/Ui/label';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/core/types';
import { TemplateSelector } from '@/Modules/ContentManagement/ui/editor/TemplateSelector';

interface TemplatePickerProps {
    templates: TemplateDefinitionDto[];
    selectedTemplateKey: string;
    disabled?: boolean;
    onTemplateChange: (value: string) => void;
}

export function TemplatePicker({
    templates,
    selectedTemplateKey,
    disabled = false,
    onTemplateChange,
}: TemplatePickerProps) {
    return (
        <div className="grid gap-4">
            <div className="space-y-1.5">
                <Label htmlFor="edit-section-template">Template</Label>
                <TemplateSelector
                    templates={templates}
                    value={selectedTemplateKey}
                    onChange={onTemplateChange}
                    placeholder="Select a template"
                    disabled={disabled}
                    className="h-14 w-full"
                />
            </div>
        </div>
    );
}
