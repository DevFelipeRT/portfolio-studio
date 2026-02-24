import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

interface IsActiveFieldProps {
  value: ContactChannelFormData['is_active'];
  errors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange(value: boolean): void;
}

export function IsActiveField({
  value,
  errors,
  processing,
  onChange,
}: IsActiveFieldProps) {
  return (
    <FormField
      name="is_active"
      errors={errors}
      htmlFor="is-active"
      label="Active"
      variant="inline"
      className="pt-6"
    >
      {({ a11yAttributes }) => (
        <Checkbox
          id="is-active"
          checked={value}
          onCheckedChange={(checked) => onChange(Boolean(checked))}
          disabled={processing}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

