import { type FormErrors } from '@/common/forms';
import { FieldError } from '@/common/forms/field/error/FieldError';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import { Button } from '@/components/ui/button';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';
import type { InitiativeImage } from '@/modules/initiatives/core/types';
import type React from 'react';
import { ExistingImageCard } from './ExistingImageCard';
import { SelectImageCard } from './SelectImageCard';

interface ImagesSectionProps {
  initiativeId?: number;
  existingImages: InitiativeImage[];
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

function resolveExistingImageUrl(image: InitiativeImage): string | null {
  if (image.url) {
    return image.url;
  }

  if (image.storage_path) {
    return route('storage.local', { path: image.storage_path });
  }

  return image.src ?? null;
}

export function ImagesSection({
  initiativeId,
  existingImages,
  images,
  errors,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: ImagesSectionProps) {
  const existingImageCards = existingImages
    .map((image) => {
      const resolvedUrl = resolveExistingImageUrl(image);
      if (!resolvedUrl) {
        return null;
      }

      const imageAlt =
        image.alt_text || image.alt || image.image_title || image.title || '';
      const caption = image.caption || imageAlt || '';

      return {
        id: image.id,
        resolvedUrl,
        imageAlt,
        caption,
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const hasExistingImages = existingImageCards.length > 0;
  const hasNewImages = images.length > 0;
  const hasPendingImageSelection = images.some((image) => !image.file);
  const hasAnyImages = hasExistingImages || hasNewImages;
  const emptyState = !hasAnyImages ? (
    <p className="text-muted-foreground text-sm">No images added yet.</p>
  ) : null;
  const imagesError = resolveFieldErrorMessage(
    errors as FormErrors<string>,
    'images',
  );

  const handleAddImageRow = () => {
    if (hasPendingImageSelection) {
      return;
    }

    onAddImageRow();
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Images</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddImageRow}
          disabled={hasPendingImageSelection}
          title={
            hasPendingImageSelection
              ? 'Select an image file before adding another field.'
              : undefined
          }
        >
          Add image
        </Button>
      </div>

      <div className="space-y-3">
        {emptyState}
        {hasAnyImages && (
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {existingImageCards.map((image) => (
              <ExistingImageCard
                key={image.id}
                image={image}
                initiativeId={initiativeId}
              />
            ))}
            {images.map((image, index) => (
              <SelectImageCard
                key={`new-${index}`}
                index={index}
                image={image}
                errors={errors as FormErrors<string>}
                onFileChange={(event) => onUpdateImageFile(index, event)}
                onAltChange={(value) => onUpdateImageAlt(index, value)}
                onRemove={() => onRemoveImageRow(index)}
              />
            ))}
          </div>
        )}
        <FieldError id="images-error" message={imagesError} />
      </div>
    </section>
  );
}
