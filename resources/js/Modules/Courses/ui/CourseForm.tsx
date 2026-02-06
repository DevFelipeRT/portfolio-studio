'use client';

import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import { useSupportedLocales, useTranslation } from '@/Common/i18n';
import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { DatePicker } from '@/Components/Ui/date-picker';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/Ui/select';
import type { CourseFormData } from '@/Modules/Courses/core/forms';
import { Loader2 } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

/**
 * Standardized validation error renderer.
 */
export function InputError({
  message,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
  if (!message) return null;
  return (
    <p
      {...props}
      className={['text-destructive', 'text-sm', 'font-medium', className].join(
        ' ',
      )}
    >
      {message}
    </p>
  );
}

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
  errors: Partial<Record<keyof CourseFormData, string | string[]>>;
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

  const normalizeError = (
    message: string | string[] | undefined,
  ): string | undefined => {
    if (!message) return undefined;
    return Array.isArray(message) ? message.join(' ') : message;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.details')}</h2>

        <div className="space-y-1.5">
          <Label htmlFor="locale">{t('fields.locale.label')}</Label>
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
            <SelectTrigger id="locale">
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
          <InputError message={normalizeError(errors.locale)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('fields.name.label')}</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder={t('fields.name.placeholder')}
              disabled={processing}
            />
            <InputError message={normalizeError(errors.name)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="institution">{t('fields.institution.label')}</Label>
            <Input
              id="institution"
              value={data.institution}
              onChange={(e) => setData('institution', e.target.value)}
              placeholder={t('fields.institution.placeholder')}
              disabled={processing}
            />
            <InputError message={normalizeError(errors.institution)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">{t('fields.category.label')}</Label>
            <Select
              value={data.category}
              onValueChange={(value) => setData('category', value)}
              disabled={processing}
            >
              <SelectTrigger id="category">
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

            <InputError message={normalizeError(errors.category)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">{t('fields.summary.label')}</Label>
          <Input
            id="summary"
            value={data.summary}
            onChange={(e) => setData('summary', e.target.value)}
            placeholder={t('fields.summary.placeholder')}
            disabled={processing}
          />
          <InputError message={normalizeError(errors.summary)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">{t('fields.description.label')}</Label>
          <RichTextEditor
            id="description"
            value={data.description}
            onChange={(value) => setData('description', value)}
          />
          <InputError message={normalizeError(errors.description)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.timeline')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            {/* Key is essential to force remount on locale change, preventing state race conditions. */}
            <DatePicker
              key={locale}
              id="started_at"
              label={t('fields.started_at.label')}
              value={data.started_at}
              onChange={(date) => setData('started_at', date)}
              disabled={processing}
              locale={locale}
              supportedLocales={supportedLocales}
            />
            <InputError message={normalizeError(errors.started_at)} />
          </div>

          <div className="space-y-1.5">
            {/* Key is essential to force remount on locale change, preventing state race conditions. */}
            <DatePicker
              key={locale}
              id="completed_at"
              label={t('fields.completed_at.label')}
              value={data.completed_at}
              onChange={(date) => setData('completed_at', date)}
              className="bg-transparent"
              disabled={processing}
              locale={locale}
              supportedLocales={supportedLocales}
            />
            <InputError message={normalizeError(errors.completed_at)} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.visibility')}</h2>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="display"
            checked={data.display}
            onCheckedChange={(checked) => setData('display', !!checked)}
            disabled={processing}
          />

          <label
            htmlFor="display"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('fields.display.label')}
          </label>
        </div>

        <InputError message={normalizeError(errors.display)} />
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
