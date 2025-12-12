import type {
    SectionDataValue,
    TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import { ArrayIntegerFieldControl } from './fields/ArrayIntegerFieldControl';
import { BooleanFieldControl } from './fields/BooleanFieldControl';
import { IntegerFieldControl } from './fields/IntegerFieldControl';
import { RichTextFieldControl } from './fields/RichTextFieldControl';
import { TextFieldControl } from './fields/TextFieldControl';
import { TextareaFieldControl } from './fields/TextareaFieldControl';

interface TemplateFieldRendererProps {
    field: TemplateFieldDto;
    value: SectionDataValue | undefined;
    onChange: (value: SectionDataValue) => void;
}

/**
 * Dispatches a template field to the appropriate concrete control.
 */
export function TemplateFieldRenderer({
    field,
    value,
    onChange,
}: TemplateFieldRendererProps) {
    const common = {
        name: field.name,
        label: field.label,
        required: field.required,
    };

    switch (field.type) {
        case 'string':
            return (
                <TextFieldControl
                    {...common}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                />
            );

        case 'text':
            return (
                <TextareaFieldControl
                    {...common}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                />
            );

        case 'rich_text':
            return (
                <RichTextFieldControl
                    {...common}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                />
            );

        case 'boolean':
            return (
                <BooleanFieldControl
                    name={field.name}
                    label={field.label}
                    value={typeof value === 'boolean' ? value : false}
                    onChange={onChange}
                />
            );

        case 'integer':
            return (
                <IntegerFieldControl
                    {...common}
                    value={
                        typeof value === 'number' && Number.isInteger(value)
                            ? value
                            : null
                    }
                    onChange={onChange}
                />
            );

        case 'array_integer': {
            const numericArray =
                Array.isArray(value) &&
                value.every((item) => typeof item === 'number')
                    ? (value as number[])
                    : [];

            return (
                <ArrayIntegerFieldControl
                    name={field.name}
                    label={field.label}
                    value={numericArray}
                    onChange={onChange}
                />
            );
        }

        default:
            return (
                <TextFieldControl
                    {...common}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                />
            );
    }
}
