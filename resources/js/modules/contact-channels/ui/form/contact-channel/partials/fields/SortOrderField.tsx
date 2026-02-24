import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

interface SortOrderFieldProps {
  value: ContactChannelFormData['sort_order'];
  errors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange(value: number | ''): void;
}

export function SortOrderField({
  value,
  errors,
  processing,
  onChange,
}: SortOrderFieldProps) {
  return (
    <FormField
      name="sort_order"
      errors={errors}
      htmlFor="sort-order"
      label="Order"
      errorId="sort-order-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="sort-order"
          type="number"
          min={0}
          value={value}
          onChange={(event) =>
            onChange(event.target.value === '' ? '' : Number(event.target.value))
          }
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

