import {
  FormErrorSummary,
  FormField,
  collectFormErrorSummary,
  type FormErrors,
} from '@/common/forms';
import { useTranslation } from '@/common/i18n';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import { Link } from '@inertiajs/react';
import React from 'react';

type ExperienceEditableField =
  | 'locale'
  | 'position'
  | 'company'
  | 'summary'
  | 'description'
  | 'start_date'
  | 'end_date'
  | 'display';

interface ExperienceFormProps {
  data: ExperienceFormData;
  errors: FormErrors<keyof ExperienceFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  cancelHref: string;
  submitLabel: string;
  localeDisabled?: boolean;
  localeNote?: string | null;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChange<K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ): void;
  onLocaleChange?(locale: string): void;
}

/**
 * Renders the reusable experience form for create and edit flows.
 */
export function ExperienceForm({
  data,
  errors,
  processing,
  supportedLocales,
  cancelHref,
  submitLabel,
  localeDisabled = false,
  localeNote = null,
  onSubmit,
  onChange,
  onLocaleChange,
}: ExperienceFormProps) {
  const { translate: t } = useTranslation('experience');
  const summaryFields = collectFormErrorSummary(errors);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Experience details</h2>

        <FormField
          name="locale"
          errors={errors}
          htmlFor="locale"
          label={t('fields.locale.label')}
          required
        >
          {({ a11yAttributes, getSelectClassName }) => (
            <Select
              value={data.locale}
              onValueChange={(value) => {
                if (onLocaleChange) {
                  onLocaleChange(value);
                  return;
                }

                onChange('locale', value);
              }}
              disabled={processing || localeDisabled}
            >
              <SelectTrigger
                id="locale"
                className={getSelectClassName()}
                {...a11yAttributes}
              >
                <SelectValue placeholder={t('fields.locale.placeholder')} />
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

        {localeNote && (
          <p className="text-muted-foreground text-xs">{localeNote}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="position"
            errors={errors}
            htmlFor="position"
            label="Position"
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="position"
                value={data.position}
                onChange={(event) => onChange('position', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="company"
            errors={errors}
            htmlFor="company"
            label="Company"
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="company"
                value={data.company}
                onChange={(event) => onChange('company', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>
        </div>

        <FormField
          name="summary"
          errors={errors}
          htmlFor="summary"
          label="Summary"
        >
          {({ a11yAttributes, getInputClassName }) => (
            <Input
              id="summary"
              value={data.summary}
              onChange={(event) => onChange('summary', event.target.value)}
              className={getInputClassName()}
              {...a11yAttributes}
            />
          )}
        </FormField>

        <FormField
          name="description"
          errors={errors}
          htmlFor="description"
          label="Description"
          required
        >
          {() => (
            <RichTextEditor
              id="description"
              value={data.description}
              onChange={(value) => onChange('description', value)}
            />
          )}
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="start_date"
            errors={errors}
            htmlFor="start_date"
            label="Start date"
            required
            errorId="start-date-error"
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(event) => onChange('start_date', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="end_date"
            errors={errors}
            htmlFor="end_date"
            label="End date"
            errorId="end-date-error"
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(event) => onChange('end_date', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>
        </div>

        <FormField
          name="display"
          errors={errors}
          htmlFor="display"
          label="Display on portfolio"
          variant="inline"
          className="pt-1"
        >
          {({ a11yAttributes }) => (
            <Checkbox
              id="display"
              checked={data.display}
              onCheckedChange={(checked) => onChange('display', !!checked)}
              {...a11yAttributes}
            />
          )}
        </FormField>
      </section>

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
    </form>
  );
}
