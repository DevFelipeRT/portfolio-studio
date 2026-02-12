import { Textarea } from '@/Components/Ui/textarea';
import { parseCommaSeparatedPositiveIntegers } from '@/Modules/ContentManagement/utils/numbers';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

/**
 * ImageGalleryFieldControl renders a simple comma-separated list of image identifiers.
 *
 * Each entry is a positive integer. Ordering is preserved and used as gallery position.
 */
export function ImageGalleryFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const numericValue = value as number[];
  const displayValue =
    numericValue.length > 0
      ? numericValue.map((id) => String(id)).join(', ')
      : '';

  const handleChange = (raw: string) => {
    onChange(parseCommaSeparatedPositiveIntegers(raw));
  };

  return (
    <FieldFrame
      id={field.name}
      label={field.label}
      required={field.required}
      helperText="Enter image IDs separated by commas. The order will be used as the gallery ordering."
    >
      <Textarea
        id={field.name}
        name={field.name}
        rows={3}
        value={displayValue}
        onChange={(event) => handleChange(event.target.value)}
      />
    </FieldFrame>
  );
}
