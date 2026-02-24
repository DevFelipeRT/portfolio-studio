import { FormField, type FormErrors } from '@/common/forms';
import { DatePicker } from '@/components/ui/date-picker';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface EndDateFieldProps {
  value: InitiativeFormData['end_date'];
  errors: FormErrors<keyof InitiativeFormData>;
  onChange(value: string | null): void;
}

export function EndDateField({ value, errors, onChange }: EndDateFieldProps) {
  return (
    <FormField
      name="end_date"
      errors={errors}
      htmlFor="end_date"
      label="End date (optional)"
      errorId="end-date-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <DatePicker
          id="end_date"
          value={value}
          onChange={onChange}
          placeholder="Select an end date"
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

