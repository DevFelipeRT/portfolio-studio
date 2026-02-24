import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import {
  FieldError,
  FormErrorSummary,
  FormField,
  FormLabel,
  collectFormErrorSummary,
  resolveFieldErrorMessage,
  type FormErrors,
} from '@/common/forms';
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
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';
import type { InitiativeImage } from '@/modules/initiatives/core/types';
import { Link } from '@inertiajs/react';
import React from 'react';

type InitiativeFormProps = {
  submitLabel: string;
  backRoute: string;
  existingImages: InitiativeImage[];
  data: InitiativeFormData;
  errors: FormErrors<keyof InitiativeFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localeDisabled?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeField: <K extends keyof InitiativeFormData>(
    key: K,
    value: InitiativeFormData[K],
  ) => void;
  onChangeLocale?: (locale: string) => void;
  onAddImageRow: () => void;
  onRemoveImageRow: (index: number) => void;
  onUpdateImageAlt: (index: number, value: string) => void;
  onUpdateImageFile: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

/**
 * Shared form for creating and editing initiatives.
 */
export function InitiativeForm({
  submitLabel,
  backRoute,
  existingImages,
  data,
  errors,
  processing,
  supportedLocales,
  localeDisabled = false,
  onSubmit,
  onChangeField,
  onChangeLocale,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: InitiativeFormProps) {
  const hasExistingImages = existingImages.length > 0;
  const summaryFields = collectFormErrorSummary(errors);
  const imagesError = resolveFieldErrorMessage(
    errors as FormErrors<string>,
    'images',
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Basic information</h2>

        <FormField
          name="locale"
          errors={errors}
          htmlFor="locale"
          label="Locale"
          required
        >
          {({ a11yAttributes, getSelectClassName }) => (
            <Select
              value={data.locale}
              onValueChange={(value) => {
                if (onChangeLocale) {
                  onChangeLocale(value);
                  return;
                }

                onChangeField('locale', value);
              }}
              disabled={processing || localeDisabled}
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="name"
            errors={errors}
            htmlFor="name"
            label="Name"
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="name"
                value={data.name}
                onChange={(event) => onChangeField('name', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="start_date"
            errors={errors}
            htmlFor="start_date"
            label="Date or start date"
            required
            errorId="start-date-error"
          >
            {({ a11yAttributes, getInputClassName }) => (
              <DatePicker
                id="start_date"
                value={data.start_date}
                onChange={(value) => onChangeField('start_date', value)}
                placeholder="Select a date"
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="summary"
            errors={errors}
            htmlFor="summary"
            label="Summary"
            required
          >
            {({ a11yAttributes, getInputClassName }) => (
              <Input
                id="summary"
                value={data.summary}
                onChange={(event) => onChangeField('summary', event.target.value)}
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>

          <FormField
            name="end_date"
            errors={errors}
            htmlFor="end_date"
            label="End date (optional)"
            errorId="end-date-error"
          >
            {({ a11yAttributes, getInputClassName }) => (
              <DatePicker
                id="end_date"
                value={data.end_date}
                onChange={(value) => onChangeField('end_date', value)}
                placeholder="Select an end date"
                className={getInputClassName()}
                {...a11yAttributes}
              />
            )}
          </FormField>
        </div>

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
              onChange={(value) => onChangeField('description', value)}
            />
          )}
        </FormField>

        <FormField
          name="display"
          errors={errors}
          htmlFor="display"
          label="Display on landing"
          variant="inline"
        >
          {({ a11yAttributes }) => (
            <Checkbox
              id="display"
              checked={data.display}
              onCheckedChange={(checked) => {
                onChangeField('display', !!checked);
              }}
              {...a11yAttributes}
            />
          )}
        </FormField>
      </section>

      {hasExistingImages && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Current images</h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {existingImages.map((image) => (
              <figure
                key={image.id}
                className="bg-muted/40 overflow-hidden rounded-md border"
              >
                <img
                  src={image.url ?? image.src ?? ''}
                  alt={
                    image.alt_text ??
                    image.alt ??
                    image.image_title ??
                    image.title ??
                    ''
                  }
                  className="h-32 w-full object-cover sm:h-36 md:h-40"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Images</h2>

        <div className="space-y-3">
          {data.images.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No images added yet.
            </p>
          )}

          {data.images.map((image, index) => (
            <div
              key={index}
              className="bg-background grid gap-3 rounded-md border p-3 md:grid-cols-[2fr,2fr,auto]"
            >
              <div className="space-y-1.5">
                <FormLabel htmlFor={`image-file-${index}`} required>
                  Image file
                </FormLabel>
                <Input
                  id={`image-file-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) => onUpdateImageFile(index, event)}
                />
              </div>

              <div className="space-y-1.5">
                <FormLabel htmlFor={`image-alt-${index}`}>
                  Alt text (optional)
                </FormLabel>
                <Input
                  id={`image-alt-${index}`}
                  value={image.alt ?? ''}
                  onChange={(event) => onUpdateImageAlt(index, event.target.value)}
                />
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveImageRow(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddImageRow}
          >
            Add image
          </Button>

          <FieldError id="images-error" message={imagesError} />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link
          href={backRoute}
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
