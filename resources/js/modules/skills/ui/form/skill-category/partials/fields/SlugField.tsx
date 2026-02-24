import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';

interface SlugFieldProps {
  value: SkillCategoryFormData['slug'];
  errors: FormErrors<keyof SkillCategoryFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function SlugField({
  value,
  errors,
  processing,
  onChange,
}: SlugFieldProps) {
  return (
    <FormField name="slug" errors={errors} htmlFor="slug" label="Slug">
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="slug"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Leave blank to auto-generate"
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

