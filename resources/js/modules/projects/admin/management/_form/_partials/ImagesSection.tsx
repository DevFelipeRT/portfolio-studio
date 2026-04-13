import { type FormErrors } from '@/common/forms';
import { FieldError } from '@/common/forms/field/error/FieldError';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import { Button } from '@/components/ui/button';
import type { ProjectFormData } from '@/modules/projects/admin/management/types';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectImage } from '@/modules/projects/types';
import type React from 'react';
import { ExistingProjectImageCard } from './ExistingProjectImageCard';
import { SelectImageCard } from './SelectImageCard';

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
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const existingImageCards = existingImages
    .map((image) => {
      const resolvedUrl = resolveExistingImageUrl(image);
      if (!resolvedUrl) {
        return null;
      }

      const imageAlt =
        image.alt_text || image.image_title || image.caption || '';
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
    <p className="text-muted-foreground text-sm">
      {tForm('fields.images.empty')}
    </p>
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
        <h2 className="text-lg font-medium">{tSections('images')}</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddImageRow}
          disabled={hasPendingImageSelection}
          title={
            hasPendingImageSelection
              ? tForm('fields.images.addDisabledTitle')
              : undefined
          }
        >
          {tActions('addImage')}
        </Button>
      </div>

      <div className="space-y-3">
        {emptyState}
        {hasAnyImages && (
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {existingImageCards.map((image) => (
              <ExistingProjectImageCard
                key={image.id}
                image={image}
                projectId={projectId}
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
