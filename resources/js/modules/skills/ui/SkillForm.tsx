// resources/js/Pages/Skills/Partials/SkillForm.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormField,
  FormErrorSummary,
  collectErroredFieldLabels,
  type FormErrors,
} from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import { useSupportedLocales } from '@/common/i18n';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type SkillFormAlignment = 'right' | 'split';

interface SkillFormProps {
  data: SkillFormData;
  errors: FormErrors<keyof SkillFormData>;
  categories: SkillCategory[];
  processing: boolean;
  onChange(field: keyof SkillFormData, value: string | number | ''): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
  alignActions?: SkillFormAlignment;
}

/**
 * SkillForm renders the reusable skill form fields and actions.
 */
export function SkillForm({
  data,
  errors,
  categories,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  submitLabel,
  deleteHref,
  deleteLabel = 'Delete',
  alignActions = 'right',
}: SkillFormProps) {
  const supportedLocales = useSupportedLocales();
  const summaryFields = collectErroredFieldLabels(errors, [
    { name: 'locale', label: 'Locale' },
    { name: 'name', label: 'Name' },
    { name: 'skill_category_id', label: 'Category' },
  ] as const);

  const renderActionsRight = (): JSX.Element => (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <Button type="submit" disabled={processing}>
        {submitLabel}
      </Button>
    </div>
  );

  const renderActionsSplit = (): JSX.Element => (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <div className="flex items-center gap-3">
        {deleteHref && (
          <Link
            href={deleteHref}
            method="delete"
            as="button"
            className="text-destructive text-sm hover:underline"
          >
            {deleteLabel}
          </Link>
        )}

        <Button type="submit" disabled={processing}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <FormField name="locale" errors={errors} htmlFor="locale" label="Locale" required>
        {({ a11yAttributes, getSelectClassName }) => (
          <Select
            value={data.locale}
            onValueChange={(value) => onChange('locale', value)}
            disabled={processing}
          >
            <SelectTrigger
              id="locale"
              className={getSelectClassName()}
              {...a11yAttributes}
            >
              <SelectValue placeholder="Select a locale" />
            </SelectTrigger>
            <SelectContent>
              {supportedLocales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {locale}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      <FormField name="name" errors={errors} htmlFor="name" label="Name" required>
        {({ a11yAttributes, getInputClassName }) => (
          <Input
            id="name"
            value={data.name}
            onChange={(event) => onChange('name', event.target.value)}
            autoFocus
            className={getInputClassName()}
            {...a11yAttributes}
          />
        )}
      </FormField>

      <FormField
        name="skill_category_id"
        errors={errors}
        htmlFor="category"
        label="Category"
        errorId="skill-category-id-error"
      >
        {({ a11yAttributes, getSelectClassName }) => (
          <Select
            value={
              data.skill_category_id === ''
                ? ''
                : String(data.skill_category_id)
            }
            onValueChange={(value) =>
              onChange(
                'skill_category_id',
                value === '__none__' ? '' : Number(value),
              )
            }
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

      {alignActions === 'split' ? renderActionsSplit() : renderActionsRight()}
    </form>
  );
}
