'use client';

import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import { useSupportedLocales, useTranslation } from '@/common/i18n';
import {
  FormField,
  FormErrorSummary,
  collectErroredFieldLabels,
} from '@/common/forms';
import type { FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseFormData } from '@/modules/courses/core/forms';
import { Loader2 } from 'lucide-react';
import React from 'react';

/**
 * Course form data shape.
 * started_at and completed_at are persisted as ISO date strings (yyyy-MM-dd) or null.
 */
/**
 * Component props for CourseForm.
 */
interface CourseFormProps {
  data: CourseFormData;
  setData: (key: keyof CourseFormData, value: string | null | boolean) => void;
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  categories: Record<string, string>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onLocaleChange?: (locale: string) => void;
  localeDisabled?: boolean;
}

/**
 * CourseForm component. All user-facing strings are provided by the i18n hook.
 * The component expects date values in ISO format (yyyy-MM-dd) or null.
 */
export default function CourseForm({
  data,
  setData,
  errors,
  processing,
  categories,
  onSubmit,
  onCancel,
  onLocaleChange,
  localeDisabled = false,
}: CourseFormProps) {
  const { translate: t, locale } = useTranslation('courses');
  const supportedLocales = useSupportedLocales();

  const summaryFields = collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'institution', label: t('fields.institution.label') },
    { name: 'category', label: t('fields.category.label') },
    { name: 'summary', label: t('fields.summary.label') },
    { name: 'description', label: t('fields.description.label') },
    { name: 'started_at', label: t('fields.started_at.label') },
    { name: 'completed_at', label: t('fields.completed_at.label') },
    { name: 'display', label: t('fields.display.label') },
  ] as const);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.details')}</h2>

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
                setData('locale', value);
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
                {supportedLocales.map((supportedLocale) => (
                  <SelectItem key={supportedLocale} value={supportedLocale}>
                    {supportedLocale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="name"
            errors={errors}
            htmlFor="name"
            label={t('fields.name.label')}
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="name"
                value={data.name}
                onChange={(event) => setData('name', event.target.value)}
                placeholder={t('fields.name.placeholder')}
                disabled={processing}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="institution"
            errors={errors}
            htmlFor="institution"
            label={t('fields.institution.label')}
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="institution"
                value={data.institution}
                onChange={(event) =>
                  setData('institution', event.target.value)
                }
                placeholder={t('fields.institution.placeholder')}
                disabled={processing}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="category"
            errors={errors}
            htmlFor="category"
            label={t('fields.category.label')}
            required
          >
            {({ a11yAttributes, getSelectClassName }) => (
              <Select
                value={data.category}
                onValueChange={(value) => setData('category', value)}
                disabled={processing}
              >
                <SelectTrigger
                  id="category"
                  className={getSelectClassName()}
                  {...a11yAttributes}
                >
                  <SelectValue placeholder={t('fields.category.placeholder')} />
                </SelectTrigger>

                <SelectContent>
                  {Object.entries(categories).map(([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>

        <FormField
          name="summary"
          errors={errors}
          htmlFor="summary"
          label={t('fields.summary.label')}
          required
        >
          {({ a11yAttributes, getInputClassName }) => (
            <Input
              id="summary"
              value={data.summary}
              onChange={(event) => setData('summary', event.target.value)}
              placeholder={t('fields.summary.placeholder')}
              disabled={processing}
              className={getInputClassName()}
              {...a11yAttributes}
            />
          )}
        </FormField>

        <FormField
          name="description"
          errors={errors}
          htmlFor="description"
          label={t('fields.description.label')}
          required
        >
          {() => (
            <RichTextEditor
              id="description"
              value={data.description}
              onChange={(value) => setData('description', value)}
            />
          )}
        </FormField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.timeline')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="started_at"
            errors={errors}
            htmlFor="started_at"
            label={t('fields.started_at.label')}
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <DatePicker
                key={locale}
                id="started_at"
                value={data.started_at}
                onChange={(date) => setData('started_at', date)}
                disabled={processing}
                locale={locale}
                supportedLocales={supportedLocales}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="completed_at"
            errors={errors}
            htmlFor="completed_at"
            label={t('fields.completed_at.label')}
          >
            {({ a11yAttributes, getInputClassName }) => (
              <DatePicker
                key={locale}
                id="completed_at"
                value={data.completed_at}
                onChange={(date) => setData('completed_at', date)}
                disabled={processing}
                locale={locale}
                supportedLocales={supportedLocales}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.visibility')}</h2>

        <FormField
          name="display"
          errors={errors}
          htmlFor="display"
          label={t('fields.display.label')}
          variant="inline"
        >
          {({ a11yAttributes }) => (
            <Checkbox
              id="display"
              checked={data.display}
              onCheckedChange={(checked) => setData('display', !!checked)}
              disabled={processing}
              {...a11yAttributes}
            />
          )}
        </FormField>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={processing}
        >
          {t('actions.cancel')}
        </Button>

        <Button type="submit" disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('actions.saving')}
            </>
          ) : (
            t('actions.save')
          )}
        </Button>
      </div>
    </form>
  );
}
