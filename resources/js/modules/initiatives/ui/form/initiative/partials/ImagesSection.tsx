import { FieldError, FormField, resolveFieldErrorMessage, type FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';
import type React from 'react';

interface ImagesSectionProps {
  images: InitiativeFormData['images'];
  errors: FormErrors<keyof InitiativeFormData>;
  onAddImageRow(): void;
  onRemoveImageRow(index: number): void;
  onUpdateImageAlt(index: number, value: string): void;
  onUpdateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}

export function ImagesSection({
  images,
  errors,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: ImagesSectionProps) {
  const imagesError = resolveFieldErrorMessage(errors as FormErrors<string>, 'images');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Images</h2>

      <div className="space-y-3">
        {images.length === 0 && (
          <p className="text-muted-foreground text-sm">No images added yet.</p>
        )}

        {images.map((image, index) => (
          <div
            key={index}
            className="bg-background grid gap-3 rounded-md border p-3 md:grid-cols-[2fr,2fr,auto]"
          >
            <FormField
              name={`images.${index}.file`}
              errors={errors as FormErrors<string>}
              htmlFor={`image-file-${index}`}
              label="Image file"
              required
              errorId={`image-file-${index}-error`}
            >
              {({ a11yAttributes, getInputClassName }) => (
                <Input
                  id={`image-file-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) => onUpdateImageFile(index, event)}
                  className={getInputClassName()}
                  {...a11yAttributes}
                />
              )}
            </FormField>

            <FormField
              name={`images.${index}.alt`}
              errors={errors as FormErrors<string>}
              htmlFor={`image-alt-${index}`}
              label="Alt text (optional)"
              errorId={`image-alt-${index}-error`}
            >
              {({ a11yAttributes, getInputClassName }) => (
                <Input
                  id={`image-alt-${index}`}
                  value={image.alt ?? ''}
                  onChange={(event) =>
                    onUpdateImageAlt(index, event.target.value)
                  }
                  className={getInputClassName()}
                  {...a11yAttributes}
                />
              )}
            </FormField>

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

        <Button type="button" variant="outline" size="sm" onClick={onAddImageRow}>
          Add image
        </Button>

        <FieldError id="images-error" message={imagesError} />
      </div>
    </section>
  );
}
