import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface CategoryFieldProps {
  value: CourseFormData['category'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  label: string;
  placeholder: string;
  categories: Record<string, string>;
  onChange(value: string): void;
}

export function CategoryField({
  value,
  errors,
  processing,
  label,
  placeholder,
  categories,
  onChange,
}: CategoryFieldProps) {
  return (
    <FormField
      name="category"
      errors={errors}
      htmlFor="category"
      label={label}
      required
    >
      {({ a11yAttributes, getSelectClassName }) => (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={processing}
        >
          <SelectTrigger
            id="category"
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {Object.entries(categories).map(([id, categoryLabel]) => (
              <SelectItem key={id} value={id}>
                {categoryLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

