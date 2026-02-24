import { FieldError, FormField, resolveFieldErrorMessage, type FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ProjectFormData } from '@/modules/projects/core/forms';
import type { ProjectImage } from '@/modules/projects/core/types';
import { Link } from '@inertiajs/react';
import type React from 'react';

interface ImagesSectionProps {
  projectId?: number;
  existingImages: ProjectImage[];
  images: ProjectFormData['images'];
  errors: FormErrors<keyof ProjectFormData>;
  onAddImageRow(): void;
  onRemoveImageRow(index: number): void;
  onUpdateImageAlt(index: number, value: string): void;
  onUpdateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}

function resolveExistingImageUrl(image: ProjectImage): string | null {
  if (image.url) {
    return image.url;
  }

  if (image.storage_path) {
    return route('storage.local', { path: image.storage_path });
  }

  return null;
}

export function ImagesSection({
  projectId,
  existingImages,
  images,
  errors,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: ImagesSectionProps) {
  const hasExistingImages = existingImages.length > 0;
  const hasNewImages = images.length > 0;
  const imagesError = resolveFieldErrorMessage(errors, 'images');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Images</h2>

      <div className="space-y-6">
        {hasExistingImages && (
          <div className="space-y-2">
            <div className="grid gap-3 md:grid-cols-3">
              {existingImages.map((image) => {
                const resolvedUrl = resolveExistingImageUrl(image);

                if (!resolvedUrl) {
                  return null;
                }

                const imageAlt =
                  image.alt_text || image.image_title || image.caption || '';
                const caption = image.caption || imageAlt || '';

                return (
                  <figure
                    key={image.id}
                    className="bg-background flex flex-col gap-2 rounded-md border p-3"
                  >
                    <img
                      src={resolvedUrl}
                      alt={imageAlt}
                      className="h-32 w-full rounded-md object-cover"
                    />
                    {caption && (
                      <figcaption className="text-muted-foreground text-xs">
                        {caption}
                      </figcaption>
                    )}

                    {projectId && (
                      <div className="flex justify-end">
                        <Link
                          href={route('projects.images.destroy', {
                            project: projectId,
                            image: image.id,
                          })}
                          method="delete"
                          as="button"
                          className="text-destructive text-xs hover:underline"
                        >
                          Delete image
                        </Link>
                      </div>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!hasNewImages && !hasExistingImages && (
            <p className="text-muted-foreground text-sm">No images added yet.</p>
          )}

          {!hasNewImages && hasExistingImages && (
            <p className="text-muted-foreground text-sm">
              No new images selected.
            </p>
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
      </div>
    </section>
  );
}
