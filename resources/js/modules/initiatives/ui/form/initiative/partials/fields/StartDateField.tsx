import { FormField, type FormErrors } from '@/common/forms';
import { DatePicker } from '@/components/ui/date-picker';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface StartDateFieldProps {
  value: InitiativeFormData['start_date'];
  errors: FormErrors<keyof InitiativeFormData>;
  onChange(value: string | null): void;
}

export function StartDateField({
  value,
  errors,
  onChange,
}: StartDateFieldProps) {
  return (
    <FormField
      name="start_date"
      errors={errors}
      htmlFor="start_date"
      label="Date or start date"
      required
      errorId="start-date-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <DatePicker
          id="start_date"
          value={value}
          onChange={onChange}
          placeholder="Select a date"
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

