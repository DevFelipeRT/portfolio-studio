import type { InitiativeImage } from '@/modules/initiatives/core/types';

interface ExistingImagesSectionProps {
  images: InitiativeImage[];
}

export function ExistingImagesSection({ images }: ExistingImagesSectionProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Current images</h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image) => (
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
  );
}

