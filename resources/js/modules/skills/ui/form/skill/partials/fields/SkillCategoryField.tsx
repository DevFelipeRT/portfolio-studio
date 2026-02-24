import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';

interface SkillCategoryFieldProps {
  value: SkillFormData['skill_category_id'];
  errors: FormErrors<keyof SkillFormData>;
  categories: SkillCategory[];
  processing: boolean;
  onChange(value: number | ''): void;
}

export function SkillCategoryField({
  value,
  errors,
  categories,
  processing,
  onChange,
}: SkillCategoryFieldProps) {
  return (
    <FormField
      name="skill_category_id"
      errors={errors}
      htmlFor="category"
      label="Category"
      errorId="skill-category-id-error"
    >
      {({ a11yAttributes, getSelectClassName }) => (
        <Select
          value={value === '' ? '' : String(value)}
          onValueChange={(nextValue) =>
            onChange(nextValue === '__none__' ? '' : Number(nextValue))
          }
          disabled={processing}
        >
          <SelectTrigger
            id="category"
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="__none__">Uncategorized</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

