import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface RepositoryUrlFieldProps {
  value: ProjectFormData['repository_url'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: string): void;
}

export function RepositoryUrlField({
  value,
  errors,
  onChange,
}: RepositoryUrlFieldProps) {
  return (
    <FormField
      name="repository_url"
      errors={errors}
      htmlFor="repository_url"
      label="Repository URL"
      errorId="repository-url-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="repository_url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://"
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

