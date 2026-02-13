import type {
  SectionData,
  SectionDataValue,
  TemplateDefinitionDto,
  TemplateFieldDto,
} from '@/modules/content-management/types';
import * as React from 'react';
import { TemplateFieldRenderer } from './rendering/TemplateFieldRenderer';
import { useTemplateForm } from './useTemplateForm';

interface TemplateFormProps {
  template: TemplateDefinitionDto;
  value?: SectionData | null;
  onChange: (next: SectionData) => void;
}

/**
 * Controlled form for editing template-driven section data.
 *
 * Ensures missing template fields are initialized using template defaults.
 */
export function TemplateForm({ template, value, onChange }: TemplateFormProps) {
  const emptyValueRef = React.useRef<SectionData>({});
  const safeValue = value ?? emptyValueRef.current;

  // Use resolved data only for rendering (defaults + intersection).
  // Keep the underlying state as-is; discard happens only on save.
  const resolvedValue = useTemplateForm({ template, value: safeValue });

  const handleFieldChange = (
    field: TemplateFieldDto,
    fieldValue: SectionDataValue,
  ): void => {
    const next: SectionData = {
      ...safeValue,
      [field.name]: fieldValue,
    };

    onChange(next);
  };

  return (
    <div className="space-y-4">
      {template.description && (
        <p className="text-muted-foreground text-sm">{template.description}</p>
      )}
      {template.fields.map((field) => (
        <TemplateFieldRenderer
          key={field.name}
          field={field}
          value={resolvedValue[field.name]}
          onChange={(fieldValue) => handleFieldChange(field, fieldValue)}
        />
      ))}
    </div>
  );
}
