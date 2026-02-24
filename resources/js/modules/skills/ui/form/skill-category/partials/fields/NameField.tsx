import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';

interface NameFieldProps {
  value: SkillCategoryFormData['name'];
  errors: FormErrors<keyof SkillCategoryFormData>;
  processing: boolean;
  autoFocus?: boolean;
  onChange(value: string): void;
}

export function NameField({
  value,
  errors,
  processing,
  autoFocus,
  onChange,
}: NameFieldProps) {
  return (
    <FormField name="name" errors={errors} htmlFor="name" label="Name" required>
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoFocus={autoFocus}
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

