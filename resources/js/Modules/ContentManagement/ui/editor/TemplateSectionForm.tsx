import type {
    SectionData,
    SectionDataValue,
    TemplateDefinitionDto,
    TemplateFieldDto,
} from '@/Modules/ContentManagement/core/types';
import { TemplateFieldRenderer } from './TemplateFieldRenderer';

interface TemplateSectionFormProps {
    template: TemplateDefinitionDto;
    value: SectionData;
    onChange: (next: SectionData) => void;
}

/**
 * Renders a field set for a given template definition.
 *
 * This component is stateless and fully controlled via the value/onChange props.
 */
export function TemplateSectionForm({
    template,
    value,
    onChange,
}: TemplateSectionFormProps) {
    const handleFieldChange = (
        field: TemplateFieldDto,
        fieldValue: SectionDataValue,
    ): void => {
        const next: SectionData = {
            ...value,
            [field.name]: fieldValue,
        };

        onChange(next);
    };

    return (
        <div className="space-y-4">
            {template.description && (
                <p className="text-muted-foreground text-sm">
                    {template.description}
                </p>
            )}
            {template.fields.map((field) => (
                <TemplateFieldRenderer
                    key={field.name}
                    field={field}
                    value={value[field.name]}
                    onChange={(fieldValue) =>
                        handleFieldChange(field, fieldValue)
                    }
                />
            ))}
        </div>
    );
}
